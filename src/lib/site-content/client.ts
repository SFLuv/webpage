import { fiscalYears, annualImpactReports } from "@/content/financials";
import { fallbackAnnouncement } from "@/content/announcement";
import { API_BASE_URL } from "@/lib/volunteer-events/config";
import type {
  FormLookup,
  PublicAnnouncement,
  PublicFinancials,
  PublicForm,
  PublicFormSummary
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
 * The homepage banner, or null to show nothing.
 *
 * Failure policy: a 404 can only mean the backend predates this feature, so the
 * banner that ships with the site is used. Any other failure shows nothing —
 * announcing something that may since have been switched off is worse than a
 * missing banner.
 */
export async function getAnnouncement(): Promise<PublicAnnouncement | null> {
  const result = await get<PublicAnnouncement>("/site/announcement");

  if (result.ok) return result.data.enabled && result.data.title ? result.data : null;
  if (result.status === 404 || !API_BASE_URL) return fallbackAnnouncement.enabled ? fallbackAnnouncement : null;
  return null;
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
