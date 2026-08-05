import type { VolunteerEvent } from "./types";
import { siteConfig } from "@/lib/site";
import { eventPath } from "./map";

/** iCalendar UTC stamp: 20260811T183000Z */
function icsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Escapes the characters RFC 5545 gives meaning to inside a property value. */
function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Folds a content line to 75 octets, per RFC 5545.
 *
 * Not cosmetic — several calendar clients reject or truncate over-long lines,
 * and event descriptions routinely exceed the limit. Folding counts bytes
 * rather than characters so multi-byte text is not split mid-codepoint.
 */
function foldLine(line: string) {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;

  const parts: string[] = [];
  let current = "";
  let currentBytes = 0;

  for (const char of line) {
    const size = encoder.encode(char).length;
    // Continuation lines carry a leading space, so their budget is one smaller.
    const limit = parts.length === 0 ? 75 : 74;

    if (currentBytes + size > limit) {
      parts.push(current);
      current = "";
      currentBytes = 0;
    }

    current += char;
    currentBytes += size;
  }

  if (current) parts.push(current);
  return parts.join("\r\n ");
}

/**
 * Builds an iCalendar document for a single event.
 *
 * The web-native equivalent of the app's push reminder: anonymous signups have
 * no account and can never receive one, but anyone can add an event to their
 * own calendar. See comms.md [25].
 */
export function buildEventIcs(event: VolunteerEvent, now: Date) {
  const url = new URL(eventPath(event), siteConfig.url).toString();

  // Calendars need an end; a volunteer slot without one is treated as an hour.
  const end = event.endAt ?? new Date(event.startAt.getTime() + 60 * 60 * 1000);

  const descriptionParts = [event.description, `Organized by ${event.organizer.name}.`, url].filter(
    Boolean
  );

  const location = event.location
    ? [event.location.name, event.location.addressLine].filter(Boolean).join(", ")
    : null;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${siteConfig.name}//Volunteer Events//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@sfluv.org`,
    `DTSTAMP:${icsDate(now)}`,
    `DTSTART:${icsDate(event.startAt)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(descriptionParts.join("\n\n"))}`,
    ...(location ? [`LOCATION:${escapeText(location)}`] : []),
    ...(event.location?.lat != null && event.location?.lng != null
      ? [`GEO:${event.location.lat};${event.location.lng}`]
      : []),
    `URL:${url}`,
    `ORGANIZER;CN=${escapeText(event.organizer.name)}:MAILTO:inquiries@sfluv.org`,
    `STATUS:${event.status === "cancelled" ? "CANCELLED" : "CONFIRMED"}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  // RFC 5545 requires CRLF line endings.
  return lines.map(foldLine).join("\r\n") + "\r\n";
}

/** Filename-safe slug for the download. */
export function icsFilename(event: VolunteerEvent) {
  return `${event.slug || "sfluv-event"}.ics`;
}
