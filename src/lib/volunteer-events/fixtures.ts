import type { ApiVolunteerEvent } from "./types";

/**
 * Development fixtures, used only when `SFLUV_API_BASE_URL` is unset.
 *
 * They mirror the wire shape from comms.md [2] exactly — including the awkward
 * cases (full event, cancelled event, no cover photo, affiliate organizer with
 * and without a logo) so the UI is exercised before the API exists.
 */

const DAY = 24 * 60 * 60 * 1000;

function at(dayOffset: number, hour: number, minute = 0) {
  const date = new Date();
  date.setUTCHours(hour + 7, minute, 0, 0); // PDT is UTC-7
  return new Date(date.getTime() + dayOffset * DAY).toISOString();
}

const SFLUV = {
  type: "sfluv" as const,
  organization_id: null,
  name: "SFLuv",
  logo_url: "/assets/wp-content/uploads/2024/06/cropped-SFLUV-Currency-Symbol-Logo-1.png"
};

const ST_ANTHONY = {
  type: "affiliate" as const,
  organization_id: 12,
  name: "St. Anthony Foundation",
  logo_url: "/assets/wp-content/uploads/2025/10/st-anthonys.png"
};

const GLIDE = {
  type: "affiliate" as const,
  organization_id: 14,
  name: "GLIDE",
  logo_url: "/assets/wp-content/uploads/2026/05/glide-logo.png"
};

export const fixtureEvents: ApiVolunteerEvent[] = [
  {
    id: "evt_tl_cleanup",
    slug: "tenderloin-weekly-sunday-cleanup",
    series_id: "ser_tl_cleanup",
    title: "Tenderloin Weekly Sunday Cleanup",
    description:
      "Join us every Sunday morning to clean up the Tenderloin alongside neighbors, merchants, and community organizations.\n\nSupplies, gloves, and coffee are provided. No experience needed — just show up in comfortable shoes.",
    cover_photos: [
      {
        url: "/assets/wp-content/uploads/2026/01/Tenderloin-Weekly-Cleanup-._001_20240703164325983424_20250215031301212105.jpg",
        width: 944,
        height: 494
      }
    ],
    organizer: SFLUV,
    start_at: at(3, 9),
    end_at: at(3, 12),
    timezone: "America/Los_Angeles",
    recurrence: { frequency: "weekly", interval: 1, summary: "Weekly on Sunday" },
    max_participants: 40,
    // null outside internal mode: signups live on the organizer's system.
    signup_count: null,
    spots_remaining: null,
    reward_amount_sfluv: 15,
    signup: { mode: "external", url: "https://www.mobilize.us/civicjoyfund/event/756069/", open: true },
    status: "scheduled",
    location: {
      id: 4101,
      name: "Boeddeker Park",
      street: "246 Eddy St",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      lat: 37.7838,
      lng: -122.4131
    }
  },
  {
    id: "evt_dining_room",
    slug: "dining-room-second-shift",
    series_id: null,
    title: "St. Anthony Dining Room — Second Shift",
    description:
      "Serve lunch to neighbors at St. Anthony's Dining Room. Volunteers help plate meals, greet guests, and reset tables between seatings.\n\nClosed-toe shoes required. Please arrive 15 minutes early for orientation.",
    cover_photos: [
      {
        url: "/assets/wp-content/uploads/2026/01/St-Anthony-Dining-volunteer-image.jpg",
        width: 2000,
        height: 642
      }
    ],
    organizer: ST_ANTHONY,
    start_at: at(6, 11, 30),
    end_at: at(6, 14, 30),
    timezone: "America/Los_Angeles",
    recurrence: null,
    max_participants: 20,
    signup_count: 8,
    spots_remaining: 12,
    reward_amount_sfluv: 20,
    signup: { mode: "internal", open: true, closed_reason: null },
    status: "scheduled",
    location: {
      id: 4102,
      name: "St. Anthony Foundation",
      street: "150 Golden Gate Ave",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      lat: 37.7817,
      lng: -122.4139
    }
  },
  {
    id: "evt_tree_steward",
    slug: "tenderloin-tree-steward-morning",
    series_id: "ser_tree",
    title: "Tenderloin Tree Steward Morning",
    description:
      "Water, mulch, and check on the 18 young street trees planted along Larkin and Eddy. Training provided on the day — this is the easiest possible way to start as a BUFEES volunteer.",
    cover_photos: [
      {
        url: "/assets/wp-content/uploads/2026/03/tenderloin_tree_steward_banner.png",
        width: 1800,
        height: 900
      }
    ],
    organizer: SFLUV,
    start_at: at(10, 8),
    end_at: at(10, 10, 30),
    timezone: "America/Los_Angeles",
    recurrence: { frequency: "monthly", interval: 1, summary: "First Thursday of every month" },
    max_participants: 12,
    signup_count: 12,
    spots_remaining: 0,
    reward_amount_sfluv: 10,
    signup: { mode: "internal", open: false, closed_reason: "full" },
    status: "scheduled",
    location: null
  },
  {
    id: "evt_glide_beautification",
    slug: "glide-business-beautification-day",
    series_id: null,
    title: "GLIDE Business Beautification Day",
    description:
      "Repaint storefronts, plant sidewalk gardens, and install new signage with GLIDE and neighborhood merchants.",
    cover_photos: [],
    organizer: GLIDE,
    start_at: at(17, 10),
    end_at: at(17, 15),
    timezone: "America/Los_Angeles",
    recurrence: null,
    max_participants: 60,
    signup_count: 4,
    spots_remaining: 56,
    reward_amount_sfluv: 25,
    signup: { mode: "internal", open: true, closed_reason: null },
    status: "scheduled",
    location: {
      id: 4103,
      name: "GLIDE",
      street: "330 Ellis St",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      lat: 37.7846,
      lng: -122.4118
    }
  },
  {
    id: "evt_cancelled_mural",
    slug: "elm-alley-mural-touch-up",
    series_id: null,
    title: "Elm Alley Mural Touch-Up",
    description: "Rescheduling — we are waiting on a dry weather window. Watch this page for the new date.",
    cover_photos: [
      {
        url: "/assets/wp-content/uploads/2026/03/Oasis-for-Girls-Elm-Alley-Gardens-Web-Banner1774989816.png",
        width: 851,
        height: 315
      }
    ],
    organizer: SFLUV,
    start_at: at(13, 13),
    end_at: at(13, 16),
    timezone: "America/Los_Angeles",
    recurrence: null,
    max_participants: 15,
    signup_count: 0,
    spots_remaining: 15,
    reward_amount_sfluv: 15,
    signup: { mode: "internal", open: false, closed_reason: "cancelled" },
    status: "cancelled",
    location: null
  },
  {
    id: "evt_past_holiday_tree",
    slug: "tenderloin-holiday-tree-decorating",
    series_id: null,
    title: "Tenderloin Holiday Tree Decorating",
    description: "Neighbors decorated the community tree and welcomed Z Zoul Cafe into the merchant network.",
    cover_photos: [
      { url: "/assets/wp-content/uploads/2025/12/IMG_6819.jpg", width: 3024, height: 2882 }
    ],
    organizer: SFLUV,
    start_at: at(-45, 16),
    end_at: at(-45, 19),
    timezone: "America/Los_Angeles",
    recurrence: null,
    max_participants: 30,
    signup_count: null,
    spots_remaining: null,
    reward_amount_sfluv: 10,
    signup: { mode: "none" },
    status: "ended",
    location: null
  },
  {
    id: "evt_past_superbowl",
    slug: "superbowl-saturday-clean-up",
    series_id: null,
    title: "SuperBowl Saturday Clean Up",
    description: "A citywide cleanup push ahead of the big game, with Civic Joy Fund and Public Works.",
    cover_photos: [
      { url: "/assets/wp-content/uploads/2026/01/Super-Bowl-Saturday.jpeg", width: 2000, height: 1600 }
    ],
    organizer: SFLUV,
    start_at: at(-120, 9),
    end_at: at(-120, 12),
    timezone: "America/Los_Angeles",
    recurrence: null,
    max_participants: 50,
    signup_count: null,
    spots_remaining: null,
    reward_amount_sfluv: 15,
    signup: { mode: "none" },
    status: "ended",
    location: null
  }
];
