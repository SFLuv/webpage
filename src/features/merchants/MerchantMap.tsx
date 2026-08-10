"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";

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
          >
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

      {selected ? (
        <MerchantCard merchant={selected} state={openStateFor(selected)} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  );
}

/**
 * The popup for a selected merchant.
 *
 * Anchored to the map's own bottom edge rather than to the marker: an InfoWindow
 * tethered to a pin near the viewport edge gets clipped or shoves the map, and
 * on a phone there is no room for it beside the pin at all.
 */
function MerchantCard({
  merchant,
  state,
  onClose
}: {
  merchant: Merchant;
  state: OpenState;
  onClose: () => void;
}) {
  const today = currentWeekdayIndex();
  const todayLine = merchant.openingHours.find((line, index) => isTodayHoursLine(line, index, today));

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-3 sm:p-4">
      <div className="pointer-events-auto w-full max-w-md rounded-2xl bg-surface p-4 shadow-raised">
        <div className="flex items-start gap-3">
          <div className="size-11 shrink-0 overflow-hidden rounded-xl shadow-panel">
            <MerchantIcon name={merchant.name} iconUrl={merchant.iconUrl} size={44} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-ink">{merchant.name}</p>
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

        <p className="mt-3 text-sm text-ink-muted">
          {[merchant.street, merchant.city].filter(Boolean).join(", ")}
        </p>
        {todayLine ? <p className="mt-1 text-sm text-ink-subtle">{todayLine}</p> : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button href={directionsUrl(merchant)} size="sm">
            Get directions
          </Button>
          {merchant.website !== "" ? (
            <Button href={merchant.website} variant="secondary" size="sm">
              Website
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
