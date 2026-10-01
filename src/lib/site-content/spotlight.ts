import type { SpotlightSlide } from "@/content/spotlight";
import { parseInline } from "./inline";
import type { PublicSlide } from "./types";

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Words from an event's title, in order, as the case-insensitive pattern the
 * carousel matches events with: "weekly clean" matches "Tenderloin Weekly
 * Clean-up". Editors type words, not patterns.
 */
function titleMatcher(words: string): RegExp | undefined {
  const parts = words.split(/\s+/).filter(Boolean).map(escapeRegExp);
  return parts.length > 0 ? new RegExp(parts.join(".*"), "i") : undefined;
}

/** A slide as the backend stores it, in the shape the carousel renders. */
export function toSpotlightSlide(slide: PublicSlide): SpotlightSlide {
  const titleMatch = titleMatcher(slide.event_match);

  return {
    id: slide.id,
    enabled: true,
    label: slide.label,
    title: slide.title,
    body: parseInline(slide.body),
    image: { src: slide.image.url, alt: slide.image.alt, width: slide.image.width, height: slide.image.height },
    imagePosition: slide.image_position || undefined,
    action: {
      label: slide.action.label,
      href: slide.action.href,
      newTab: slide.action.new_tab || undefined,
      alsoOpen: slide.action.also_open || undefined
    },
    liveEvent: titleMatch ? { titleMatch } : undefined
  };
}
