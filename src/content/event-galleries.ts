/**
 * Photo galleries shown under live recurring volunteer events.
 *
 * A recurring event never becomes a past event, so its photos have no natural
 * home in Past events. Each one here is an ordinary gallery made in the app
 * (Website → Past events), found by its address, and tied to the event's series
 * so it follows the event from week to week. These galleries show on the event
 * instead of as tiles in Past events.
 *
 * Until a gallery exists at that address, or while it has no photos, the event
 * page simply shows nothing extra.
 */
type LiveEventGallery = {
  /** The gallery's address: /volunteers/past/<slug>. Comes from the title it was first created with. */
  slug: string;
  heading: string;
};

/** Keyed by the event's series id, which every occurrence in the series shares. */
const gallerySeries: Record<string, LiveEventGallery> = {
  // Tenderloin Weekly Clean-up
  "de71a6a6-95ef-4223-aa1d-a06e86b8a0b1": { slug: "tenderloin-weekly-clean-up", heading: "Photos from past clean-ups" },
  // St. Anthony's Dining: Monday Breakfast Shift
  "db20efba-6279-4bb9-9ab9-b6b0e6f27a0e": { slug: "st-anthonys-dining-room", heading: "Photos from past shifts" },
  // Beautify the Block
  "d3b58e51-1fae-41b7-bf25-bbb07192f258": { slug: "beautify-the-block", heading: "Photos from past events" }
};

export function liveEventGallery(seriesId: string | null): LiveEventGallery | null {
  return seriesId ? (gallerySeries[seriesId] ?? null) : null;
}

const gallerySlugs = new Set(Object.values(gallerySeries).map((gallery) => gallery.slug));

/** True for a gallery that belongs on a live event rather than among the Past events tiles. */
export function isLiveEventGallery(slug: string): boolean {
  return gallerySlugs.has(slug);
}
