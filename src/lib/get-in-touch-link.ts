import { routes } from "./routes";

/**
 * Every subject the Get in touch form offers, as a type.
 *
 * These slugs are the routing keys: they travel in the ?subject= link from
 * wherever somebody started, and the backend matches support-request
 * recipients against them, so adding one is a change in two repositories.
 * Permanent once published — they are in other people's links and in browser
 * history — so add rather than rename.
 *
 * This lives in lib/ rather than beside the subject list in content/ for a
 * boring reason: content/get-in-touch.ts reads the contact addresses from
 * lib/site.ts, and lib/site.ts needs to build these links, so putting the
 * helper in content/ makes the two import each other.
 */
export type GetInTouchSubjectSlug =
  | "general"
  | "become-an-improver"
  | "merchant-onboarding"
  | "events"
  | "donations"
  | "press"
  | "technical-support"
  | "other";

export const defaultSubjectSlug: GetInTouchSubjectSlug = "general";

/**
 * The link to use from anywhere that offers to put somebody in touch.
 *
 * Every "contact us", "get in touch" and "support" affordance points at the
 * one page; what differs between them is which subject arrives preselected, so
 * somebody coming from merchant onboarding is not asked to pick it off a list.
 *
 * Built through a helper rather than written out at each call site, because a
 * hand-written ?subject= carrying a slug that no longer exists fails silently:
 * the page falls back to General and nobody notices the link stopped carrying
 * where it came from. Here the slug is typed, so a bad one is a build error.
 */
export function getInTouchLink(slug?: GetInTouchSubjectSlug): string {
  if (!slug || slug === defaultSubjectSlug) {
    return routes.getInTouch;
  }
  return `${routes.getInTouch}?subject=${slug}`;
}
