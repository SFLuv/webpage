import type { MetadataRoute } from "next";
import { sitemapRoutes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";
import { listEvents } from "@/lib/volunteer-events/client";
import { eventPath } from "@/lib/volunteer-events/map";
import { emptyFilters } from "@/lib/volunteer-events/client";

/** Rebuilt hourly so newly published events get indexed without a deploy. */
export const revalidate = 3600;

/** Upper bound on event URLs, so a large back catalogue cannot bloat the file. */
const MAX_EVENT_URLS = 500;

const absolute = (path: string) => new URL(path, siteConfig.url).toString();

/**
 * Collects event detail URLs by walking the public list endpoint.
 *
 * Failure is non-fatal: a sitemap missing its event pages is far better than a
 * sitemap that 500s, which search engines treat as a fetch error for the whole
 * file.
 */
async function eventEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const when of ["upcoming", "past"] as const) {
    let page = 1;

    while (entries.length < MAX_EVENT_URLS) {
      const result = await listEvents({ ...emptyFilters, when, page });
      if (result.degraded) return entries;

      for (const event of result.events) {
        entries.push({
          url: absolute(eventPath(event)),
          changeFrequency: when === "upcoming" ? "daily" : "yearly",
          priority: when === "upcoming" ? 0.7 : 0.3
        });
      }

      if (page >= result.totalPages || result.events.length === 0) break;
      page += 1;
    }
  }

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = sitemapRoutes.map(({ path, priority }) => ({
    url: absolute(path),
    changeFrequency: path === "/volunteers" ? "daily" : "monthly",
    priority
  }));

  return [...staticEntries, ...(await eventEntries())];
}
