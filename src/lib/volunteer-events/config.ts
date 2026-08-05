/**
 * Configuration for everything that talks to the events API.
 *
 * Centralised so the "are we configured?" question is answered in one place
 * rather than re-derived at each call site.
 */

/** Base URL of the SFLuv backend, e.g. `https://api.sfluv.org`. */
export const API_BASE_URL = process.env.SFLUV_API_BASE_URL?.replace(/\/+$/, "") ?? "";

/**
 * Shared secret proving a signup came through our proxy.
 *
 * The API only trusts our forwarded client IP when this matches; otherwise it
 * rate-limits on the socket IP, which is the correct fallback rather than a
 * failure. Server-only — it must never be exposed as `NEXT_PUBLIC_*`.
 */
export const PROXY_KEY = process.env.SFLUV_VOLUNTEER_PROXY_KEY ?? "";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/** Opt-in escape hatch for exercising a production build against fixtures. */
const FIXTURES_FORCED = process.env.SFLUV_USE_FIXTURES === "1";

/**
 * True when it is safe to serve local stand-ins — sample events, stubbed
 * confirmations.
 *
 * Enabled implicitly in development, so the site is workable with no backend;
 * and explicitly via `SFLUV_USE_FIXTURES=1`, so a production build can still be
 * exercised locally.
 *
 * Never implicit in production. Serving fixtures on the live site would
 * advertise events that do not exist and tell people their signup succeeded
 * when nothing was recorded. An unconfigured production deploy must degrade
 * visibly rather than invent data.
 */
export function usingStubs() {
  if (FIXTURES_FORCED) return true;
  return API_BASE_URL === "" && !IS_PRODUCTION;
}

/** True when there is no backend to call and stubbing is not permitted. */
export function apiUnavailable() {
  return API_BASE_URL === "" && !usingStubs();
}

let warned = false;

/** Logs once, loudly, so a misconfigured deploy is obvious in the logs. */
export function warnIfUnconfigured(context: string) {
  if (!apiUnavailable() || warned) return;
  warned = true;
  console.error(
    `[volunteer-events] SFLUV_API_BASE_URL is not set in production (${context}). ` +
      "Event data and signups are unavailable until it is configured."
  );
}
