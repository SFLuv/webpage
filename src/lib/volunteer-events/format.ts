import type { VolunteerEvent } from "./types";

/**
 * Event times render in the *viewer's* local timezone (comms.md [14], Q-M4).
 *
 * The zone abbreviation is always shown alongside, so a reader outside San
 * Francisco sees "12:00 PM EDT" rather than a bare time they could mistake for
 * the event's local hour.
 *
 * These take an explicit `timeZone` rather than reading it off the event: the
 * pages are server-rendered, where the runtime zone is the server's, so the
 * caller decides — see `EventTime`, which renders the event's zone during SSR
 * and swaps to the viewer's after hydration.
 */

function formatter(timeZone: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone });
}

export function formatEventDate(date: Date, timeZone: string) {
  return formatter(timeZone, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function formatEventDateShort(date: Date, timeZone: string) {
  return formatter(timeZone, {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(date);
}

/** "10:00 AM – 1:00 PM PDT", collapsing to a single time when there is no end. */
export function formatEventTimeRange(startAt: Date, endAt: Date | null, timeZone: string) {
  const time = formatter(timeZone, { hour: "numeric", minute: "2-digit" });
  const zone = formatter(timeZone, { hour: "numeric", timeZoneName: "short" })
    .formatToParts(startAt)
    .find((part) => part.type === "timeZoneName")?.value;

  const start = time.format(startAt);
  const end = endAt ? time.format(endAt) : null;
  const range = end ? `${start} – ${end}` : start;

  return zone ? `${range} ${zone}` : range;
}

/** Machine-readable value for <time dateTime>. */
export function isoDateTime(date: Date) {
  return date.toISOString();
}

/** "GMT-07:00" → "-07:00", falling back to "Z" if the runtime lacks longOffset. */
function utcOffset(date: Date, timeZone: string) {
  const name = formatter(timeZone, { timeZoneName: "longOffset" })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;

  const match = name?.match(/GMT([+-]\d{2}:\d{2})/);
  return match ? match[1] : "Z";
}

/**
 * ISO 8601 timestamp in the event's local time with its UTC offset, e.g.
 * `2026-08-11T11:30:00-07:00`.
 *
 * Schema.org accepts plain UTC, but event rich results are matched on local
 * wall-clock time, so emitting the local form is what makes a listing read
 * "11:30 AM" in search rather than "6:30 PM".
 */
export function isoWithOffset(date: Date, timeZone: string) {
  const parts = formatter(timeZone, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}${utcOffset(date, timeZone)}`;
}

export function formatReward(amount: number | null) {
  if (amount === null || amount <= 0) return null;
  return `${amount.toLocaleString("en-US")} SFLuv`;
}

/**
 * Availability text, for internally-managed events only.
 *
 * Gated on `signup.mode` rather than just on `spotsRemaining` being present:
 * for an `external` event the signups live on someone else's system, so a
 * remaining-spots figure is unsupportable even if the API sends one. Returns
 * null when we cannot make the claim — see `formatCapacity` for that case.
 */
export function formatSpots(
  event: Pick<VolunteerEvent, "spotsRemaining" | "maxParticipants" | "signup">
) {
  const { spotsRemaining, maxParticipants } = event;
  if (event.signup.mode !== "internal") return null;
  if (spotsRemaining === null) return null;

  if (spotsRemaining <= 0) return "Full";
  if (maxParticipants) return `${spotsRemaining} of ${maxParticipants} spots left`;
  return `${spotsRemaining} spots left`;
}

/**
 * Capacity line for events we do not manage signups for.
 *
 * For `external` and `none` events the signups happen on someone else's system,
 * so we know the cap but not how many spots are left. This deliberately says
 * "40 volunteer spots", never "40 spots left" — see comms.md [13], Q-M3.
 */
export function formatCapacity(event: Pick<VolunteerEvent, "maxParticipants" | "signup">) {
  if (event.signup.mode === "internal") return null;
  if (!event.maxParticipants || event.maxParticipants <= 0) return null;

  return `${event.maxParticipants.toLocaleString("en-US")} volunteer spots`;
}

/** Human-readable reason a closed internal signup is closed. */
export function signupClosedMessage(reason: string | null) {
  switch (reason) {
    case "full":
      return "This event is full.";
    case "ended":
      return "This event has already taken place.";
    case "cancelled":
      return "This event was cancelled.";
    case "not_open_yet":
      return "Signups for this event are not open yet.";
    default:
      return "Signups are closed for this event.";
  }
}
