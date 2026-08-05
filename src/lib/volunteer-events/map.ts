import type {
  ApiCoverPhoto,
  ApiLocation,
  ApiOrganizer,
  ApiVolunteerEvent,
  CoverPhoto,
  EventLocation,
  EventSignup,
  Organizer,
  VolunteerEvent
} from "./types";
import { API_BASE_URL } from "./config";

/**
 * Cards crop every cover photo to a fixed ratio, so these fallbacks only exist
 * to satisfy next/image when the API omits intrinsic dimensions.
 */
const FALLBACK_PHOTO_SIZE = { width: 1600, height: 900 };

const DEFAULT_TIME_ZONE = "America/Los_Angeles";

/**
 * Anchors an API-supplied image URL to the API host.
 *
 * When the backend's `PUBLIC_BACKEND_URL` is unset it returns root-relative
 * paths like `/volunteer-events/photos/…`. A browser resolves those against
 * sfluv.org, so every cover photo and logo 404s — the same trap @MOBILE hit in
 * comms.md [23], where React Native rendered them blank. Absolute URLs and
 * local `/assets/…` paths pass through untouched.
 */
function resolveAssetUrl(url: string) {
  if (!url || /^https?:\/\//i.test(url) || url.startsWith("data:")) return url;
  if (url.startsWith("/assets/")) return url;
  if (!API_BASE_URL || !url.startsWith("/")) return url;
  return `${API_BASE_URL}${url}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Canonical public path: `/volunteers/<slug>-<id>`.
 *
 * The slug is decorative — `parseEventId` reads the trailing id — so a renamed
 * event never breaks an existing link.
 */
export function eventPath(event: Pick<VolunteerEvent, "id" | "slug">) {
  return `/volunteers/${event.slug ? `${event.slug}-${event.id}` : event.id}`;
}

/**
 * A trailing UUID, the id format the events API issues.
 *
 * Matched explicitly because UUIDs contain dashes: splitting `<slug>-<id>` on
 * the last dash would turn `ocean-beach-cleanup-b2f4c8d1-…-1a2b3c4d5e6f` into
 * just `1a2b3c4d5e6f` and 404 every event page.
 */
const TRAILING_UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Extracts the event id from a `<slug>-<id>` path segment. */
export function parseEventId(segment: string) {
  const decoded = decodeURIComponent(segment);

  const uuid = decoded.match(TRAILING_UUID);
  if (uuid) return uuid[0];

  const lastDash = decoded.lastIndexOf("-");
  if (lastDash === -1) return decoded;

  // Fallback for opaque, dash-free ids.
  const candidate = decoded.slice(lastDash + 1);
  return candidate.length >= 3 ? candidate : decoded;
}

function mapPhoto(photo: ApiCoverPhoto): CoverPhoto | null {
  if (!photo?.url) return null;

  return {
    url: resolveAssetUrl(photo.url),
    width: photo.width && photo.width > 0 ? photo.width : FALLBACK_PHOTO_SIZE.width,
    height: photo.height && photo.height > 0 ? photo.height : FALLBACK_PHOTO_SIZE.height
  };
}

export function mapOrganizer(organizer: ApiOrganizer | undefined): Organizer {
  return {
    type: organizer?.type === "affiliate" ? "affiliate" : "sfluv",
    organizationId: organizer?.organization_id ?? null,
    name: organizer?.name?.trim() || "SFLuv",
    logoUrl: organizer?.logo_url ? resolveAssetUrl(organizer.logo_url) : null
  };
}

function mapSignup(event: ApiVolunteerEvent): EventSignup {
  const signup = event.signup;
  const mode = signup?.mode ?? "none";

  if (mode === "external") {
    // An external event with no URL is unusable; degrade to no signup.
    return signup?.url ? { mode: "external", url: signup.url } : { mode: "none" };
  }

  if (mode === "internal") {
    return {
      mode: "internal",
      open: signup?.open ?? true,
      closedReason: signup?.closed_reason ?? null
    };
  }

  return { mode: "none" };
}

function clean(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/**
 * Maps a location row.
 *
 * Accepts both the structured shape from comms.md [12] and the older flat
 * `address` string, so it maps correctly whichever the backend is serving
 * during rollout. Returns null when there is nothing worth rendering.
 */
function mapLocation(raw: ApiLocation | null | undefined): EventLocation | null {
  if (!raw) return null;

  const street = clean(raw.street);
  const city = clean(raw.city);
  const state = clean(raw.state);
  const zip = clean(raw.zip);

  const regionAndZip = [state, zip].filter(Boolean).join(" ");
  const composed = [street, city, regionAndZip].filter(Boolean).join(", ");
  const addressLine = composed || clean(raw.address);

  const location: EventLocation = {
    id: raw.id ?? null,
    name: clean(raw.name),
    street,
    city,
    state,
    zip,
    lat: typeof raw.lat === "number" ? raw.lat : null,
    lng: typeof raw.lng === "number" ? raw.lng : null,
    addressLine
  };

  return location.name || location.addressLine ? location : null;
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Maps a wire event to the domain shape.
 *
 * Tolerant by design: a partial payload degrades to a renderable event rather
 * than throwing, so a backend that ships fields incrementally never breaks the
 * public page. Returns null only when the event is unusable.
 */
export function mapEvent(raw: ApiVolunteerEvent): VolunteerEvent | null {
  if (!raw?.id || !raw.title) return null;

  const startAt = parseDate(raw.start_at);
  if (!startAt) return null;

  // Honour explicit `position` when present; array order otherwise.
  const coverPhotos = [...(raw.cover_photos ?? [])]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map(mapPhoto)
    .filter((photo): photo is CoverPhoto => photo !== null);

  const location = mapLocation(raw.location);

  return {
    id: raw.id,
    slug: raw.slug?.trim() || slugify(raw.title),
    seriesId: raw.series_id ?? null,
    title: raw.title.trim(),
    description: raw.description?.trim() ?? "",
    coverPhotos,
    organizer: mapOrganizer(raw.organizer),
    startAt,
    endAt: parseDate(raw.end_at),
    timeZone: raw.timezone || DEFAULT_TIME_ZONE,
    recurrenceSummary: raw.recurrence?.summary?.trim() || null,
    maxParticipants: raw.max_participants ?? null,
    spotsRemaining: raw.spots_remaining ?? null,
    rewardAmountSfluv: raw.reward_amount_sfluv ?? null,
    signup: mapSignup(raw),
    status: raw.status ?? "scheduled",
    // mapLocation already returns null when there is nothing worth rendering.
    location
  };
}
