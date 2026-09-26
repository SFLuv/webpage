import type { InlineNode } from "@/components/content/document";
import { annualImpactReportsAnchor } from "@/content/financials";
import { routes } from "@/lib/routes";
import type { ImageAsset } from "./types";

export type SpotlightAction = {
  label: string;
  href: string;
  /** Open in a new tab. Use for PDFs and off-site links. */
  newTab?: boolean;
  /**
   * A second URL (e.g. a PDF) opened in a new tab on the same click, while
   * this tab follows `href`.
   */
  alsoOpen?: string;
};

export type SpotlightSlide = {
  /** Stable key. Change it when the slide becomes a different announcement. */
  id: string;
  /**
   * The on/off switch. A disabled slide is skipped, so it can stay in place
   * until it is needed again. When every slide is off the card disappears.
   */
  enabled: boolean;
  /** Short tag above the title, e.g. "Now published" or "Every Sunday". */
  label: string;
  title: string;
  /**
   * Plain strings, or `{ type: "link" | "strong" | "em" }` nodes. Keep it to a
   * sentence: phones leave it out to keep the card short.
   */
  body: InlineNode[];
  /** Cropped to a wide strip across the top of the card, so use a landscape photo. */
  image: ImageAsset;
  /** CSS `object-position` for that crop, e.g. "center 30%" to keep faces in frame. Centred by default. */
  imagePosition?: string;
  action: SpotlightAction;
  /**
   * Ties the slide to a recurring volunteer event. Each occurrence has its own
   * page, so the next upcoming one whose title matches is looked up on every
   * render: the button goes to it, and its date and reward are shown. If none
   * is found the slide falls back to `action.href` and `label` as written.
   */
  liveEvent?: { titleMatch: RegExp };
};

/**
 * The rotating card beside the homepage title.
 *
 * Slides appear in this order. To post an announcement, add a slide to the top
 * with `enabled: true`; to retire one, set `enabled: false` or delete it.
 */
export const spotlightSlides: SpotlightSlide[] = [
  {
    id: "impact-report-2025-2026",
    enabled: true,
    label: "Now published",
    title: "Our 2025–2026 Annual Impact Report",
    body: ["A look back at our first year of operations in San Francisco's Tenderloin."],
    // The photo from the report's cover.
    image: {
      src: "/assets/announcements/impact-report-2025-2026-photo.jpg",
      alt: "Five SFLuv volunteers in safety vests holding litter grabbers on a Tenderloin sidewalk",
      width: 1050,
      height: 817
    },
    imagePosition: "center 8%",
    action: {
      label: "Read the report",
      href: `${routes.financialsAndReports}#${annualImpactReportsAnchor}`,
      alsoOpen: "/assets/wp-content/uploads/2026/09/SFLuv-Annual-Impact-Report-2025-2026.pdf"
    }
  },
  {
    id: "weekly-cleanup",
    enabled: true,
    label: "Every Sunday",
    title: "Tenderloin Weekly Clean-up",
    body: ["Clean up the neighborhood with us and earn SFLuv to spend at local shops."],
    image: {
      src: "/assets/wp-content/uploads/2026/01/Tenderloin-Weekly-Cleanup-._001_20240703164325983424_20250215031301212105.jpg",
      alt: "Volunteers in safety vests at the Tenderloin weekly cleanup",
      width: 944,
      height: 494
    },
    action: { label: "Join the clean-up", href: routes.volunteers },
    liveEvent: { titleMatch: /weekly.*clean[\s-]?up/i }
  }
];
