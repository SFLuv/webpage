"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdvancedMarker, APIProvider, Map, useMap } from "@vis.gl/react-google-maps";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_MAP_ID,
  MAP_CENTER,
  MAP_DEFAULT_ZOOM,
  mapConfigured
} from "@/lib/merchants/config";
import { currentWeekdayIndex, getOpenState, isTodayHoursLine, type OpenState } from "@/lib/merchants/hours";
import type { Merchant } from "@/lib/merchants/types";
import { MerchantIcon, MerchantPin, OpenStatusBadge } from "./MerchantPin";

type MerchantMapProps = {
  merchants: Merchant[];
  /** Tailwind height classes for the map canvas. */
  heightClassName?: string;
  className?: string;
};

function directionsUrl(merchant: Merchant): string {
  if (merchant.mapsPage !== "") return merchant.mapsPage;
  if (merchant.googleId !== "") return `https://www.google.com/maps/place/?q=place_id:${merchant.googleId}`;
  return `https://www.google.com/maps/search/?api=1&query=${merchant.lat},${merchant.lng}`;
}

/**
 * A clock that ticks once a minute, shared by every pin and card on the map.
 *
 * Null until after mount on purpose: an open/closed answer computed during
 * server rendering can disagree with the one computed a moment later in the
 * browser, and React treats that as a hydration error.
 */
function useMinuteTick(): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    // Align to the next minute boundary so every indicator flips together
    // rather than drifting apart by however long each took to mount.
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      setNow(new Date());
      interval = setInterval(() => setNow(new Date()), 60_000);
    }, 60_000 - (Date.now() % 60_000));

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  return now;
}

/**
 * Frames every merchant inside the middle of the map.
 *
 * The default San Francisco view wastes most of its area on ocean and the
 * avenues, leaving the pins as a smudge in one corner. Fitting to the actual
 * bounds with heavy padding starts the map already zoomed to the merchants,
 * with the padding keeping them off the edges — and, on the home page, clear of
 * the popup that slides over the bottom.
 *
 * Runs once. Re-fitting on every render would fight anyone who has panned away.
 */
function FitToMerchants({ merchants }: { merchants: Merchant[] }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (!map || fitted.current || merchants.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    for (const merchant of merchants) {
      bounds.extend({ lat: merchant.lat, lng: merchant.lng });
    }

    if (merchants.length === 1) {
      map.setCenter(bounds.getCenter());
      map.setZoom(15);
      fitted.current = true;
      return;
    }

    const element = map.getDiv();
    // A quarter of the frame on each side leaves the merchants occupying
    // roughly the middle half, which is what was asked for.
    const horizontal = Math.round(element.clientWidth * 0.25);
    const vertical = Math.round(element.clientHeight * 0.25);
    map.fitBounds(bounds, { top: vertical, bottom: vertical, left: horizontal, right: horizontal });
    fitted.current = true;
  }, [map, merchants]);

  return null;
}

/**
 * The public merchant map.
 *
 * Renders nothing at all when Maps is unconfigured rather than an empty grey
 * box: a marketing page with a broken map on it is worse than one section
 * shorter. The same applies when the API returned no merchants — an empty map
 * of San Francisco says "there are none", which is never the truth.
 */
export function MerchantMap({ merchants, heightClassName = "h-[26rem] sm:h-[32rem]", className }: MerchantMapProps) {
  const [selected, setSelected] = useState<Merchant | null>(null);
  const now = useMinuteTick();

  const openStateFor = useCallback(
    (merchant: Merchant): OpenState => (now === null ? "unknown" : getOpenState(merchant.hours, now)),
    [now]
  );

  const placed = useMemo(() => merchants.filter((merchant) => merchant.lat !== 0 || merchant.lng !== 0), [merchants]);

  // Escape closes the card, matching every other dismissible surface on the
  // site. Clicking away is handled by the map's own click handler and the
  // backdrop-free card's outside-click guard below.
  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  if (!mapConfigured() || placed.length === 0) return null;

  return (
    <div className={cn("relative overflow-hidden rounded-panel shadow-panel", className)}>
      <div className={cn("w-full", heightClassName)}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            mapId={GOOGLE_MAPS_MAP_ID}
            defaultCenter={MAP_CENTER}
            defaultZoom={MAP_DEFAULT_ZOOM}
            gestureHandling="cooperative"
            disableDefaultUI
            zoomControl
            className="size-full"
            // Tapping the map dismisses the card, which is what "click
            // elsewhere" means when the map is most of the surface.
            onClick={() => setSelected(null)}
          >
            <FitToMerchants merchants={placed} />

            {placed.map((merchant) => (
              <AdvancedMarker
                key={merchant.id}
                position={{ lat: merchant.lat, lng: merchant.lng }}
                title={merchant.name}
                clickable
                onClick={() => setSelected(merchant)}
              >
                <MerchantPin name={merchant.name} iconUrl={merchant.iconUrl} state={openStateFor(merchant)} />
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>
      </div>

      <MerchantCard
        merchant={selected}
        state={selected ? openStateFor(selected) : "unknown"}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

/**
 * The popup for a selected merchant.
 *
 * Anchored to the map's own bottom edge rather than to the marker: an
 * InfoWindow tethered to a pin near the viewport edge gets clipped or shoves
 * the map, and on a phone there is no room for it beside the pin at all.
 *
 * Kept mounted and slid out of frame rather than unmounted, so it animates on
 * the way out as well as in.
 */
function MerchantCard({
  merchant,
  state,
  onClose
}: {
  merchant: Merchant | null;
  state: OpenState;
  onClose: () => void;
}) {
  // The last merchant is held through the exit animation; unmounting on close
  // would blank the card before it finished sliding away.
  const [shown, setShown] = useState<Merchant | null>(merchant);
  useEffect(() => {
    if (merchant) setShown(merchant);
  }, [merchant]);

  const open = merchant !== null;
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Anything outside the card closes it — including the page around the map,
  // which the map's own click handler never sees.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onClose]);

  if (!shown) return null;

  const today = currentWeekdayIndex();
  const todayLine = shown.openingHours.find((line, index) => isTodayHoursLine(line, index, today));

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-3 transition-all duration-300 ease-out sm:p-4",
        open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      )}
      aria-hidden={!open}
    >
      <div
        ref={cardRef}
        className={cn("w-full max-w-md rounded-2xl bg-surface p-4 shadow-raised", open && "pointer-events-auto")}
      >
        <div className="flex items-start gap-3">
          <div className="size-11 shrink-0 overflow-hidden rounded-xl shadow-panel">
            <MerchantIcon name={shown.name} iconUrl={shown.iconUrl} size={44} state={state} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-ink">{shown.name}</p>
            <OpenStatusBadge state={state} className="mt-0.5" />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close merchant details"
            className="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-ink-subtle transition-colors hover:bg-ink/5"
          >
            <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
              <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.18 12 2.89 5.71 4.3 4.29l6.29 6.3 6.3-6.3z" />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-sm text-ink-muted">{[shown.street, shown.city].filter(Boolean).join(", ")}</p>
        {todayLine ? <p className="mt-1 text-sm text-ink-subtle">{todayLine}</p> : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button href={directionsUrl(shown)} size="sm">
            Get directions
          </Button>
          {shown.website !== "" ? (
            <Button href={shown.website} variant="secondary" size="sm">
              Website
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
