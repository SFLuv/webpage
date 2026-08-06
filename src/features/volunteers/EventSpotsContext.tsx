"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { formatCapacity, formatSpots } from "@/lib/volunteer-events/format";
import type { VolunteerEvent } from "@/lib/volunteer-events/types";

type SpotsContextValue = {
  spotsRemaining: number | null;
  setSpotsRemaining: (value: number | null) => void;
};

const SpotsContext = createContext<SpotsContextValue | null>(null);

/**
 * Shares the live remaining-spots count across the event detail page.
 *
 * The figure appears both in the details table and in the signup panel, and a
 * signup updates it. Without shared state one of them would still read the
 * server-rendered value — a stale "12 of 20 spots left" sitting next to a
 * message saying you just took a spot.
 */
export function EventSpotsProvider({
  initial,
  children
}: {
  initial: number | null;
  children: ReactNode;
}) {
  const [spotsRemaining, setSpotsRemaining] = useState(initial);

  return (
    <SpotsContext.Provider value={{ spotsRemaining, setSpotsRemaining }}>
      {children}
    </SpotsContext.Provider>
  );
}

/** Falls back to static values outside a provider, so consumers stay usable. */
export function useEventSpots(fallback: number | null) {
  const context = useContext(SpotsContext);
  return {
    spotsRemaining: context ? context.spotsRemaining : fallback,
    setSpotsRemaining: context?.setSpotsRemaining ?? (() => {})
  };
}

/**
 * Availability or capacity text for an event, reflecting any signup made on
 * this page. Renders nothing when neither can be stated.
 */
export function EventSpotsText({ event }: { event: VolunteerEvent }) {
  const { spotsRemaining } = useEventSpots(event.spotsRemaining);
  const live = { ...event, spotsRemaining };
  const text = formatSpots(live) ?? formatCapacity(live);

  return text ? <>{text}</> : null;
}
