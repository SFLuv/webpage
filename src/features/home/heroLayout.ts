/*
 * Measurements for the homepage hero, which is sized to fit the first screen.
 *
 * Each runs twice: as an inline script while the page is still loading, so the
 * very first paint is already right, and again from a client component when
 * the layout changes. The inline copies are serialised with `toString()`, so
 * both functions must stay self-contained: no imports, nothing from this
 * module's scope, and no syntax that compiles to a helper.
 */

export const HERO_ID = "hero";
export const SPOTLIGHT_SLOT_ID = "spotlight";

/**
 * Pins the hero's unit of height, `--hero-vh`, to 1% of the small viewport as
 * it was when the page loaded.
 *
 * The hero is sized in that unit rather than in `svh` directly. `svh` is meant
 * to hold still while a phone's toolbars collapse on scroll, but mobile
 * browsers have not always agreed on that, and when it moves the whole first
 * screen re-lays itself out under the reader's thumb. A pixel value measured
 * once cannot move.
 */
export function pinHeroViewport(hero: HTMLElement | null) {
  if (!hero) return;

  const probe = document.createElement("div");
  probe.style.cssText = "position:absolute;top:0;visibility:hidden;height:100svh";
  document.body.appendChild(probe);
  const height = probe.offsetHeight || window.innerHeight;
  probe.remove();

  hero.style.setProperty("--hero-vh", height / 100 + "px");
}

/**
 * Scales the spotlight card down evenly — width, height, photo and type alike —
 * when the slot the hero leaves for it is shorter than the card. It then looks
 * the same on every screen, only smaller, rather than having its photo cropped
 * to a sliver.
 *
 * The card keeps its full size in the layout; this sets `--spotlight-scale` on
 * the slot, which the card applies as a transform. That leaves the slot's own
 * height, which the scale is worked out from, unaffected by it.
 */
export function fitSpotlight(slot: HTMLElement | null) {
  const card = slot && slot.firstElementChild;
  if (!slot || !(card instanceof HTMLElement) || card.offsetHeight === 0) return;

  slot.style.setProperty("--spotlight-scale", String(Math.min(1, slot.clientHeight / card.offsetHeight)));
}
