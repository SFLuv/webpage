import { fiscalYears, annualImpactReports } from "@/content/financials";
import { archivedEvents, type ArchivedEvent } from "@/content/volunteers";
import { spotlightSlides } from "@/content/spotlight";
import type { SpotlightSlide } from "@/content/spotlight";
import { API_BASE_URL } from "@/lib/volunteer-events/config";
import { toSpotlightSlide } from "./spotlight";
import type {
  FormLookup,
  PublicSpotlight,
  PublicFinancials,
  PublicForm,
  PublicFormSummary,
  PublicPastEvent
} from "./types";

/**
 * Seconds a response stays cached on the site. An edit in the admin panel shows
 * up within about this long, with no deploy.
 */
const REVALIDATE_SECONDS = 30;
/** Forms are shorter: staff open one and put its QR code up straight away. */
const FORM_REVALIDATE_SECONDS = 10;
const TIMEOUT_MS = 4000;

type Fetched<T> = { ok: true; data: T } | { ok: false; status: number };

async function get<T>(path: string, revalidate = REVALIDATE_SECONDS): Promise<Fetched<T>> {
  if (!API_BASE_URL) return { ok: false, status: 0 };

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate },
      signal: AbortSignal.timeout(TIMEOUT_MS)
    });
    if (!response.ok) return { ok: false, status: response.status };
    return { ok: true, data: (await response.json()) as T };
  } catch (error) {
    console.error(`[site-content] ${path} failed`, error);
    return { ok: false, status: 0 };
  }
}

/**
 * The slides in the homepage carousel, in order.
 *
 * Failure policy: a 404 can only mean the backend predates this feature, so the
 * slides that ship with the site are used. Any other failure shows none —
 * advertising something that may since have been switched off is worse than a
 * missing card. (Once a response has been cached, a failed refresh keeps
 * serving the last good one, so this only bites a cold start.)
 */
export async function getSpotlightSlides(): Promise<SpotlightSlide[]> {
  const result = await get<PublicSpotlight>("/site/spotlight");

  if (result.ok) return result.data.slides.map(toSpotlightSlide);
  if (result.status === 404 || !API_BASE_URL) return spotlightSlides.filter((slide) => slide.enabled);
  return [];
}

/**
 * Financial statements and impact reports.
 *
 * Failure policy: fall back to the copy that ships with the site. These
 * documents only ever accumulate, so an old list is stale but never wrong.
 */
export async function getFinancials(): Promise<PublicFinancials> {
  const result = await get<PublicFinancials>("/site/financials");
  if (result.ok) return result.data;

  return { years: fiscalYears, impact_reports: annualImpactReports };
}

/** Forms open for signing right now, or null if they could not be loaded. */
export async function listOpenForms(): Promise<PublicFormSummary[] | null> {
  const result = await get<{ forms: PublicFormSummary[] }>("/site/forms", FORM_REVALIDATE_SECONDS);
  return result.ok ? result.data.forms : null;
}

export async function getForm(slug: string): Promise<FormLookup> {
  const result = await get<
    | { status: "open"; slug: string; kind: string; title: string; summary: string; version: number; body: string; config: PublicForm["config"] }
    | { status: "closed"; title: string }
  >(`/site/forms/${encodeURIComponent(slug)}`, FORM_REVALIDATE_SECONDS);

  if (!result.ok) return result.status === 404 ? { state: "notfound" } : { state: "unavailable" };

  const data = result.data;
  if (data.status === "closed") return { state: "closed", title: data.title };
  return { state: "open", form: data };
}

/** The gallery page's address for a title, as the backend makes it. */
export function pastEventSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f’']/g, "")
    .replace(/[&+]/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)
    .replace(/-$/, "");
  return slug || "event";
}

/** "5/16/26" or "1/24/2026" → "2026-05-16". */
function isoFromShipped(date: string | undefined): string {
  const [m, d, y] = (date ?? "").split("/").map(Number);
  if (!m || !d || !y) return "";
  const year = y < 100 ? 2000 + y : y;
  return `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function fromShipped(event: ArchivedEvent): PublicPastEvent {
  const photos = event.images.map((image) => ({ url: image.src, width: image.width, height: image.height, alt: image.alt }));
  return {
    slug: pastEventSlug(event.title),
    title: event.title,
    date: isoFromShipped(event.date),
    cover: photos[0] ?? null,
    photo_count: photos.length,
    photos
  };
}

/**
 * Tiles for the Past events section, newest first.
 *
 * Failure policy: a 404 means the backend predates this feature, so the tiles
 * that ship with the site are used. Any other failure shows none (the page
 * says so) rather than an archive that may have been edited since.
 */
export async function listPastEvents(): Promise<PublicPastEvent[] | null> {
  const result = await get<{ events: PublicPastEvent[] }>("/site/past-events");
  if (result.ok) return result.data.events;
  if (result.status === 404 || !API_BASE_URL) return archivedEvents.map(fromShipped);
  return null;
}

export type PastEventLookup = { state: "found"; event: PublicPastEvent } | { state: "missing" } | { state: "unavailable" };

/** One event's gallery page. */
export async function getPastEvent(slug: string): Promise<PastEventLookup> {
  const result = await get<PublicPastEvent>(`/site/past-events/${encodeURIComponent(slug)}`);
  if (result.ok) return { state: "found", event: result.data };
  if (result.status === 404) {
    // Either no such event, or a backend that predates this feature.
    const shipped = archivedEvents.map(fromShipped).find((event) => event.slug === slug);
    return shipped && !(await backendHasPastEvents()) ? { state: "found", event: shipped } : { state: "missing" };
  }
  if (!API_BASE_URL) {
    const shipped = archivedEvents.map(fromShipped).find((event) => event.slug === slug);
    return shipped ? { state: "found", event: shipped } : { state: "missing" };
  }
  return { state: "unavailable" };
}

async function backendHasPastEvents(): Promise<boolean> {
  const result = await get<{ events: PublicPastEvent[] }>("/site/past-events");
  return result.ok;
}
