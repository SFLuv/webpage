import type { ApiDayHours, ApiMerchant, DayHours, Merchant } from "./types";

function text(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function coordinate(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * Structured opening hours.
 *
 * Days without usable times are kept rather than dropped: "shut on Sunday" and
 * "we never learned Sunday" are different answers, and the open/closed
 * indicator has to tell them apart.
 */
function mapHours(hours: ApiDayHours[] | null | undefined): DayHours[] {
  if (!Array.isArray(hours)) return [];

  return hours
    .filter((day): day is ApiDayHours => day !== null && typeof day === "object")
    .map((day) => ({
      weekday: typeof day.weekday === "number" ? day.weekday : -1,
      isClosed: day.is_closed === true,
      intervals: (day.intervals ?? [])
        .filter((interval) => interval !== null && typeof interval === "object")
        .map((interval) => ({
          openMinute: typeof interval.open_minute === "number" ? interval.open_minute : -1,
          closeMinute: typeof interval.close_minute === "number" ? interval.close_minute : -1
        }))
        .filter((interval) => interval.openMinute >= 0 && interval.closeMinute >= 0)
    }))
    .filter((day) => day.weekday >= 0 && day.weekday <= 6);
}

/**
 * Map one API merchant, or null if it cannot be placed.
 *
 * A listing without coordinates has nowhere to go on a map, and a marker at
 * (0, 0) would put a San Francisco cafe in the Gulf of Guinea — so it is
 * dropped rather than guessed at.
 */
export function mapMerchant(input: ApiMerchant | null | undefined): Merchant | null {
  if (!input || typeof input.id !== "number") return null;

  const lat = coordinate(input.lat);
  const lng = coordinate(input.lng);
  if (lat === null || lng === null || (lat === 0 && lng === 0)) return null;

  const name = text(input.name);
  if (name === "") return null;

  return {
    id: input.id,
    googleId: text(input.google_id),
    name,
    description: text(input.description),
    type: text(input.type),
    street: text(input.street),
    city: text(input.city),
    state: text(input.state),
    zip: text(input.zip),
    lat,
    lng,
    phone: text(input.phone),
    website: text(input.website),
    iconUrl: text(input.icon_url),
    mapsPage: text(input.maps_page),
    openingHours: Array.isArray(input.opening_hours) ? input.opening_hours.filter((line) => typeof line === "string") : [],
    hours: mapHours(input.hours)
  };
}
