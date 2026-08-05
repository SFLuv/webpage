import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Route handlers, never content.
          "/api/",
          /*
           * Single-use token links from emails. These carry a `?token=` in the
           * URL, so keeping crawlers out avoids tokens landing in any index or
           * referrer log. The pages are also `noindex` at the meta level.
           */
          "/volunteer-email/"
        ]
      }
    ],
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString()
  };
}
