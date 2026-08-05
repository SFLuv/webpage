import { homeContent, type Partner } from "@/content/home";

import { API_BASE_URL } from "./volunteer-events/config";

/** Partners change rarely; the API serves `max-age=300` (comms.md [21]). */
const REVALIDATE_SECONDS = 300;

/** Used when a logo's intrinsic size can't be determined server-side. */
const FALLBACK_LOGO_SIZE = { width: 400, height: 120 };

type ApiPartner = {
  id?: string;
  name?: string;
  link_url?: string;
  logo_url?: string;
  logo_width?: number;
  logo_height?: number;
};

function mapPartner(raw: ApiPartner): Partner | null {
  // A partner with no logo would leave a gap in the scrolling strip.
  if (!raw?.name?.trim() || !raw.logo_url || !raw.link_url) return null;

  return {
    name: raw.name.trim(),
    href: raw.link_url,
    logo: {
      // Root-relative when the backend's PUBLIC_BACKEND_URL is unset; a browser
      // would resolve that against sfluv.org and 404. See comms.md [23].
      src: /^https?:\/\//i.test(raw.logo_url) ? raw.logo_url : `${API_BASE_URL}${raw.logo_url}`,
      alt: raw.name.trim(),
      // `0` is a documented "size unknown" value — never pass it through.
      width: raw.logo_width && raw.logo_width > 0 ? raw.logo_width : FALLBACK_LOGO_SIZE.width,
      height: raw.logo_height && raw.logo_height > 0 ? raw.logo_height : FALLBACK_LOGO_SIZE.height
    }
  };
}

/**
 * Partners for the homepage carousel.
 *
 * Falls back to the built-in list when the API is unreachable or has no
 * partners configured yet — a backend hiccup must never blank out a section of
 * the marketing site.
 */
export async function getPartners(): Promise<Partner[]> {
  if (!API_BASE_URL) return homeContent.partners.logos;

  try {
    const response = await fetch(`${API_BASE_URL}/partners`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS }
    });

    if (!response.ok) {
      console.error(`[partners] ${response.status} from /partners`);
      return homeContent.partners.logos;
    }

    const payload = (await response.json()) as { partners?: ApiPartner[] };
    // Order is already applied server-side by `position` — do not re-sort.
    const partners = (payload.partners ?? [])
      .map(mapPartner)
      .filter((partner): partner is Partner => partner !== null);

    return partners.length > 0 ? partners : homeContent.partners.logos;
  } catch (error) {
    console.error("[partners] request failed", error);
    return homeContent.partners.logos;
  }
}
