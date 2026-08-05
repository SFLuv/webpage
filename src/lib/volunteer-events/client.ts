import { API_BASE_URL, apiUnavailable, usingStubs, warnIfUnconfigured } from "./config";
import { fixtureEvents } from "./fixtures";
import { mapEvent, mapOrganizer } from "./map";
import type {
  ApiEventListResponse,
  ApiOrganizer,
  ApiVolunteerEvent,
  EventFilters,
  EventListResult,
  Organizer,
  VolunteerEvent
} from "./types";

export const PER_PAGE = 12;

/** Seconds the upstream responses stay cached. See comms.md [5] D2. */
const REVALIDATE_SECONDS = 60;

export { usingStubs as usingFixtures };

export const emptyFilters: EventFilters = {
  page: 1,
  search: "",
  organizer: "",
  when: "upcoming",
  openSpotsOnly: false
};

function organizerKey(organizer: Organizer) {
  return organizer.type === "affiliate" && organizer.organizationId !== null
    ? `org:${organizer.organizationId}`
    : "sfluv";
}

// ---------------------------------------------------------------------------
// Fixture-backed implementation
// ---------------------------------------------------------------------------

function filterFixtures(filters: EventFilters): EventListResult {
  const now = Date.now();
  const all = fixtureEvents
    .map(mapEvent)
    .filter((event): event is VolunteerEvent => event !== null);

  const organizers = Array.from(
    new Map(all.map((event) => [organizerKey(event.organizer), event.organizer])).values()
  );

  const search = filters.search.trim().toLowerCase();

  const matched = all.filter((event) => {
    const isPast = event.status === "ended" || event.startAt.getTime() < now;
    if (filters.when === "upcoming" && isPast) return false;
    if (filters.when === "past" && !isPast) return false;

    if (filters.organizer && organizerKey(event.organizer) !== filters.organizer) return false;

    if (filters.openSpotsOnly) {
      const open = event.signup.mode !== "none" && (event.spotsRemaining ?? 1) > 0;
      if (!open || event.status === "cancelled") return false;
    }

    if (search) {
      const haystack = [event.title, event.description, event.organizer.name]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    return true;
  });

  matched.sort((a, b) =>
    filters.when === "past"
      ? b.startAt.getTime() - a.startAt.getTime()
      : a.startAt.getTime() - b.startAt.getTime()
  );

  const total = matched.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const page = Math.min(Math.max(1, filters.page), totalPages);
  const start = (page - 1) * PER_PAGE;

  return {
    events: matched.slice(start, start + PER_PAGE),
    page,
    perPage: PER_PAGE,
    total,
    totalPages,
    organizers,
    degraded: false
  };
}

// ---------------------------------------------------------------------------
// API-backed implementation
// ---------------------------------------------------------------------------

function buildListUrl(filters: EventFilters) {
  const params = new URLSearchParams();
  // The API paginates from zero; the UI and its shareable URLs are 1-based.
  params.set("page", String(Math.max(0, filters.page - 1)));
  params.set("count", String(PER_PAGE));
  params.set("when", filters.when);

  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.organizer) params.set("organizer", filters.organizer);
  if (filters.openSpotsOnly) params.set("open_signups", "true");

  return `${API_BASE_URL}/volunteer-events?${params.toString()}`;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS }
    });

    if (!response.ok) {
      if (response.status !== 404) {
        console.error(`[volunteer-events] ${response.status} from ${url}`);
      }
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    // Never let the marketing site fail because the events API is down.
    console.error(`[volunteer-events] request failed for ${url}`, error);
    return null;
  }
}

/**
 * Organizer facet list.
 *
 * Its own endpoint rather than an inline field on the list response — see
 * comms.md [8] override 3, so a page request does not pay for a full-corpus
 * aggregate. Failure is non-fatal: the filter just falls back to "All".
 */
async function fetchOrganizers(): Promise<Organizer[]> {
  const payload = await fetchJson<{ organizers?: ApiOrganizer[] } | ApiOrganizer[]>(
    `${API_BASE_URL}/volunteer-events/organizers`
  );

  if (!payload) return [];

  const list = Array.isArray(payload) ? payload : (payload.organizers ?? []);
  return list.map((organizer) => mapOrganizer(organizer));
}

/** Empty result flagged as degraded, so pages can explain themselves. */
function degradedResult(organizers: Organizer[]): EventListResult {
  return {
    events: [],
    page: 1,
    perPage: PER_PAGE,
    total: 0,
    totalPages: 1,
    organizers,
    degraded: true
  };
}

/**
 * Lists public volunteer events.
 *
 * Always resolves. On upstream failure it returns an empty, `degraded` result
 * so the page can explain itself instead of throwing a 500.
 */
export async function listEvents(filters: EventFilters): Promise<EventListResult> {
  if (usingStubs()) return filterFixtures(filters);

  warnIfUnconfigured("listEvents");

  // No base URL means there is nothing to call — fail fast rather than
  // constructing an invalid request.
  if (apiUnavailable()) return degradedResult([]);

  const [payload, organizers] = await Promise.all([
    fetchJson<ApiEventListResponse>(buildListUrl(filters)),
    fetchOrganizers()
  ]);

  if (!payload) return degradedResult(organizers);

  const events = (payload.events ?? [])
    .map(mapEvent)
    .filter((event): event is VolunteerEvent => event !== null);

  const total = payload.total ?? events.length;
  const perPage = payload.count ?? PER_PAGE;

  return {
    events,
    page: filters.page,
    perPage,
    total,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
    organizers,
    degraded: false
  };
}

/** Fetches one event by id. Resolves to null when missing or unreachable. */
export async function getEvent(id: string): Promise<VolunteerEvent | null> {
  if (usingStubs()) {
    const raw = fixtureEvents.find((event) => event.id === id);
    return raw ? mapEvent(raw) : null;
  }

  warnIfUnconfigured("getEvent");
  if (apiUnavailable()) return null;

  const payload = await fetchJson<ApiVolunteerEvent>(
    `${API_BASE_URL}/volunteer-events/${encodeURIComponent(id)}`
  );

  return payload ? mapEvent(payload) : null;
}

export { organizerKey };
