import type { InlineNode } from "@/components/content/document";
import { routes } from "@/lib/routes";

export type AnnouncementAction = {
  label: string;
  href: string;
  /** Open in a new tab. Use for PDFs and off-site links. */
  newTab?: boolean;
};

export type Announcement = {
  /**
   * The on/off switch. When false the banner is not rendered anywhere, so the
   * rest of this object can stay in place until the next announcement.
   */
  enabled: boolean;
  /** Small label above the title, e.g. "New" or "Now published". */
  eyebrow?: string;
  title: string;
  /** Plain strings, or `{ type: "link" | "strong" | "em" }` nodes for inline formatting. */
  body: InlineNode[];
  /** Optional image on the left, e.g. a report cover or event photo. Files live in `public/`. */
  image?: { src: string; alt: string; width: number; height: number };
  /** Up to two buttons: the first is primary, the second secondary. */
  actions?: AnnouncementAction[];
};

/**
 * The homepage announcement banner.
 *
 * To turn it off, set `enabled: false`. To post a new announcement, replace
 * the fields below and set `enabled: true`.
 */
export const announcement: Announcement = {
  enabled: true,
  eyebrow: "Now published",
  title: "Our 2025–2026 Annual Impact Report",
  body: [
    "A look back at our first year of operations in San Francisco's Tenderloin: the merchants, volunteers, and neighbors building a community currency that keeps improvement in the neighborhood."
  ],
  image: {
    src: "/assets/announcements/impact-report-2025-2026-cover.jpg",
    alt: "Cover of the SFLuv 2025–2026 Annual Impact Report",
    width: 480,
    height: 621
  },
  actions: [
    {
      label: "Read the report",
      href: "/assets/wp-content/uploads/2026/09/SFLuv-Annual-Impact-Report-2025-2026.pdf",
      newTab: true
    },
    { label: "All reports", href: routes.financialsAndReports }
  ]
};
