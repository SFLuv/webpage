/** The spotlight's slot, which the hero's inline script looks up by id. */
export const SPOTLIGHT_SLOT_ID = "spotlight";

/**
 * Scales the spotlight card down evenly — width, height, photo and type alike —
 * when the slot the hero leaves for it is shorter than the card. It then looks
 * the same on every screen, only smaller, rather than having its photo cropped
 * to a sliver.
 *
 * The card keeps its full size in the layout; this sets `--spotlight-scale` on
 * the slot, which the card applies as a transform. That leaves the slot's own
 * height, which the scale is worked out from, unaffected by it.
 *
 * Also inlined as a script straight after the hero, so the very first paint is
 * already the right size instead of correcting itself once React loads. That
 * serialises it with `toString()`, so it must stay self-contained: no imports,
 * nothing from the enclosing scope, and no syntax that compiles to a helper.
 */
export function fitSpotlight(slot: HTMLElement | null) {
  const card = slot && slot.firstElementChild;
  if (!slot || !(card instanceof HTMLElement) || card.offsetHeight === 0) return;

  slot.style.setProperty("--spotlight-scale", String(Math.min(1, slot.clientHeight / card.offsetHeight)));
}
