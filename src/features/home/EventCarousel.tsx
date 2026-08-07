"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { VolunteerEvent } from "@/lib/volunteer-events/types";
import { VolunteerEventCard } from "@/features/volunteers/VolunteerEventCard";

/** One slide: an event, optionally flagged as a past event. */
export type CarouselEvent = { event: VolunteerEvent; past?: boolean };

/**
 * Paged carousel of events: one active card centred on screen, with the
 * previous and next cards peeking in on either side.
 *
 * Still built on native scroll-snap rather than a transform-driven slider, so
 * trackpad, touch swipe and keyboard scrolling keep working and it degrades to
 * a scrollable row without JavaScript. The arrows, dots and active-card styling
 * are enhancements layered on the scroll position, not the mechanism.
 */
export function EventCarousel({ events }: { events: CarouselEvent[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  /** The card whose centre is nearest the viewport centre is the active one. */
  const syncActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const centre = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;

    Array.from(track.children).forEach((child, index) => {
      const item = child as HTMLElement;
      const distance = Math.abs(item.offsetLeft + item.offsetWidth / 2 - centre);
      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });

    setActive(nearest);
  }, []);

  useEffect(() => {
    syncActive();
    window.addEventListener("resize", syncActive);
    return () => window.removeEventListener("resize", syncActive);
  }, [syncActive]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    const item = track?.children[index] as HTMLElement | undefined;
    if (!track || !item) return;

    track.scrollTo({
      left: item.offsetLeft + item.offsetWidth / 2 - track.clientWidth / 2,
      behavior: "smooth"
    });
  };

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        onScroll={syncActive}
        className={cn(
          "flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto scroll-smooth py-2",
          // Side padding centres the first and last cards, so every slide can
          // sit in the middle of the screen with its neighbours peeking in.
          "px-[10vw] sm:px-[calc(50%-12rem)] lg:px-[calc(50%-14rem)]",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {events.map(({ event, past }, index) => (
          <li
            key={event.id}
            aria-current={index === active ? "true" : undefined}
            className={cn(
              "flex w-[80vw] shrink-0 snap-center sm:w-[24rem] lg:w-[28rem]",
              "transition-all duration-300",
              // Inactive slides recede so the active one reads as the subject.
              index === active ? "opacity-100" : "scale-95 opacity-55"
            )}
          >
            <VolunteerEventCard event={event} showPastBadge={past} />
          </li>
        ))}
      </ul>

      <PageButton side="left" disabled={active === 0} onClick={() => goTo(active - 1)} />
      <PageButton
        side="right"
        disabled={active === events.length - 1}
        onClick={() => goTo(active + 1)}
      />

      <div className="mt-6 flex justify-center gap-2">
        {events.map(({ event }, index) => (
          <button
            key={event.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Show event ${index + 1} of ${events.length}`}
            aria-current={index === active}
            className={cn(
              "h-2.5 rounded-full transition-all",
              index === active ? "w-6 bg-brand" : "w-2.5 bg-ink/20 hover:bg-ink/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function PageButton({
  side,
  disabled,
  onClick
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Previous event" : "Next event"}
      className={cn(
        // Centred on the cards, not on the dots below them.
        "absolute top-[45%] hidden size-12 -translate-y-1/2 items-center justify-center rounded-full",
        "bg-surface text-ink shadow-raised transition-opacity hover:bg-brand-tint sm:flex",
        "disabled:pointer-events-none disabled:opacity-0",
        side === "left" ? "left-4 lg:left-10" : "right-4 lg:right-10"
      )}
    >
      <ChevronDownIcon
        className={cn("size-5 fill-current", side === "left" ? "rotate-90" : "-rotate-90")}
      />
    </button>
  );
}
