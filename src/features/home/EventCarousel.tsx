"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { VolunteerEvent } from "@/lib/volunteer-events/types";
import { VolunteerEventCard } from "@/features/volunteers/VolunteerEventCard";

/**
 * Horizontally scrolling strip of upcoming events.
 *
 * Built on native overflow scrolling with snap points rather than a JS slider:
 * it works with a trackpad, a touch swipe, and keyboard scrolling for free, and
 * degrades to a plain scrollable row if JavaScript never runs. The buttons are
 * an enhancement on top, not the mechanism.
 */
export function EventCarousel({ events }: { events: VolunteerEvent[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft >= max - 1);
  };

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  /** Scrolls by roughly one card, so a click never skips past an event. */
  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : track.clientWidth;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        onScroll={sync}
        className={cn(
          "flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2",
          // Hide the scrollbar without disabling scrolling.
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {events.map((event) => (
          <li
            key={event.id}
            className="flex w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <VolunteerEventCard event={event} />
          </li>
        ))}
      </ul>

      <ScrollButton side="left" disabled={atStart} onClick={() => scrollBy(-1)} />
      <ScrollButton side="right" disabled={atEnd} onClick={() => scrollBy(1)} />
    </div>
  );
}

function ScrollButton({
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
      aria-label={side === "left" ? "Previous events" : "Next events"}
      className={cn(
        "absolute top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full",
        "bg-surface text-ink shadow-raised transition-opacity hover:bg-brand-tint sm:flex",
        "disabled:pointer-events-none disabled:opacity-0",
        side === "left" ? "-left-4" : "-right-4"
      )}
    >
      <ChevronDownIcon
        className={cn("size-5 fill-current", side === "left" ? "rotate-90" : "-rotate-90")}
      />
    </button>
  );
}
