"use client";

import { useEffect, useState } from "react";
import {
  formatEventDate,
  formatEventDateShort,
  formatEventTimeRange
} from "@/lib/volunteer-events/format";

type EventTimeProps = {
  startAt: Date;
  endAt: Date | null;
  /** The event's own IANA zone — the server-render fallback. */
  eventTimeZone: string;
  variant?: "short" | "long";
};

/**
 * Renders an event's date and time in the viewer's local timezone.
 *
 * These pages are server-rendered, where the runtime timezone is the server's,
 * not the visitor's. So the first paint uses the event's own zone — correct,
 * unambiguous, and what crawlers and non-JS visitors see — and the viewer's
 * zone is applied after mount. Seeding state with the event zone keeps the
 * hydration output identical to the server's, so there is no mismatch; the
 * swap happens in the effect that follows.
 *
 * For a San Francisco visitor reading about a San Francisco event — nearly all
 * of them — the two are the same and nothing visibly changes.
 */
export function EventTime({ startAt, endAt, eventTimeZone, variant = "long" }: EventTimeProps) {
  const [timeZone, setTimeZone] = useState(eventTimeZone);

  useEffect(() => {
    const viewerZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (viewerZone) setTimeZone(viewerZone);
  }, []);

  const date =
    variant === "short" ? formatEventDateShort(startAt, timeZone) : formatEventDate(startAt, timeZone);

  return (
    <>
      <time dateTime={startAt.toISOString()}>{date}</time>
      {variant === "short" ? " · " : ", "}
      {formatEventTimeRange(startAt, endAt, timeZone)}
    </>
  );
}
