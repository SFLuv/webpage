import type { ApiMerchant } from "./types";

/**
 * Sample merchants for local development, in the API's own wire shape so they
 * exercise the same mapping code the real response does.
 *
 * Deliberately never served in production — see `usingStubs` in
 * `lib/volunteer-events/config`. A map of merchants that do not accept SFLuv
 * would send people to shops that cannot serve them.
 */
const week = (openMinute: number, closeMinute: number, closedDays: number[] = []) =>
  Array.from({ length: 7 }, (_, weekday) => ({
    weekday,
    is_closed: closedDays.includes(weekday),
    intervals: closedDays.includes(weekday) ? [] : [{ open_minute: openMinute, close_minute: closeMinute }]
  }));

export const fixtureMerchants: ApiMerchant[] = [
  {
    id: 1,
    name: "Mission Corner Cafe",
    description: "Neighbourhood coffee bar and bakery on 24th Street.",
    type: "cafe",
    street: "2801 24th St",
    city: "San Francisco",
    state: "CA",
    zip: "94110",
    lat: 37.7526,
    lng: -122.4084,
    phone: "(415) 555-0142",
    website: "https://example.com",
    hours: week(7 * 60, 17 * 60)
  },
  {
    id: 2,
    name: "The Richmond Grocer",
    description: "Family-run grocery with produce from local farms.",
    type: "grocery",
    street: "3901 Balboa St",
    city: "San Francisco",
    state: "CA",
    zip: "94121",
    lat: 37.7758,
    lng: -122.5001,
    phone: "(415) 555-0177",
    hours: week(9 * 60, 20 * 60, [6])
  },
  {
    id: 3,
    name: "Bayview Bike Repair",
    description: "Tune-ups, wheel builds, and second-hand frames.",
    type: "repair",
    street: "5100 3rd St",
    city: "San Francisco",
    state: "CA",
    zip: "94124",
    lat: 37.7317,
    lng: -122.3907,
    hours: week(10 * 60, 18 * 60, [0, 6])
  },
  {
    id: 4,
    name: "Sunset Noodle House",
    description: "Late-night hand-pulled noodles on Irving.",
    type: "restaurant",
    street: "1246 Irving St",
    city: "San Francisco",
    state: "CA",
    zip: "94122",
    lat: 37.7638,
    lng: -122.4772,
    // Closes after midnight — the case a naive open/close comparison gets wrong.
    hours: week(17 * 60, 2 * 60)
  },
  {
    id: 5,
    name: "Tenderloin Books",
    description: "Used books, zines, and a community noticeboard.",
    type: "retail",
    street: "401 Ellis St",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    lat: 37.7845,
    lng: -122.4137
    // No hours at all: the "unknown" case.
  }
];
