/**
 * Google Maps configuration for the merchant map.
 *
 * Unlike everything else this site reads from the environment, these two are
 * `NEXT_PUBLIC_` on purpose. A Maps JavaScript API key is used by the browser
 * and cannot be hidden from it — Google's own protection is an HTTP-referrer
 * allowlist on the key, not secrecy. The same key the wallet app uses works
 * here once sfluv.org is added to that allowlist.
 */
export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";

/**
 * Cloud-styled map id. Advanced markers — which is what draws our pins —
 * require one, so an unset value disables the map rather than silently
 * downgrading it to default Google pins.
 *
 * Same variable names the wallet app reads, so one pair of values in the shared
 * dev environment configures every surface that draws a map.
 */
export const GOOGLE_MAPS_MAP_ID = process.env.NEXT_PUBLIC_MAP_ID?.trim() ?? "";

/** San Francisco. Every merchant is here, so this is the map's home. */
export const MAP_CENTER = { lat: 37.7749, lng: -122.4194 };

export const MAP_DEFAULT_ZOOM = 12;

/** True when the map can actually render. */
export function mapConfigured(): boolean {
  return GOOGLE_MAPS_API_KEY !== "" && GOOGLE_MAPS_MAP_ID !== "";
}
