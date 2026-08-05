import { API_BASE_URL, usingStubs } from "./config";

export type EmailListAction = "confirm" | "unsubscribe";

/**
 * Backend subscription state for a token, as returned by the read-only GET.
 * Unrecognised values are passed through so a new state never crashes the page.
 */
export type EmailListState = "pending" | "active" | "unsubscribed" | (string & {});

export type EmailListRead =
  | { kind: "ok"; email: string | null; state: EmailListState }
  | { kind: "invalid" }
  | { kind: "unavailable" };

export type EmailListMutation = "ok" | "invalid" | "unavailable";

/** Development stand-in when no backend is configured. */
const FIXTURE_EMAIL = "you@example.com";

/**
 * Reads a token's current state. Safe to call on page load — the backend's GET
 * is read-only, which is what makes link prefetching harmless (comms.md [13]).
 */
export async function readEmailListToken(
  action: EmailListAction,
  token: string
): Promise<EmailListRead> {
  if (!token.trim()) return { kind: "invalid" };

  if (usingStubs()) {
    return { kind: "ok", email: FIXTURE_EMAIL, state: action === "confirm" ? "pending" : "active" };
  }

  // Never claim success we cannot verify.
  if (!API_BASE_URL) return { kind: "unavailable" };

  try {
    const response = await fetch(
      `${API_BASE_URL}/volunteer-email-list/${action}?token=${encodeURIComponent(token)}`,
      { cache: "no-store", headers: { Accept: "application/json" } }
    );

    if (response.ok) {
      const payload = await response.json().catch(() => ({}));
      return {
        kind: "ok",
        email: typeof payload?.email === "string" ? payload.email : null,
        state: typeof payload?.status === "string" ? payload.status : "pending"
      };
    }

    if ([400, 404, 410].includes(response.status)) return { kind: "invalid" };
    return { kind: "unavailable" };
  } catch (error) {
    console.error(`[volunteer-email-list] read ${action} failed`, error);
    return { kind: "unavailable" };
  }
}

/**
 * Performs the mutation. Only ever called from a POST handler, never on page
 * load — a GET that mutates would let a link scanner confirm or unsubscribe on
 * the recipient's behalf.
 */
export async function mutateEmailList(
  action: EmailListAction,
  token: string
): Promise<EmailListMutation> {
  if (!token.trim()) return "invalid";
  if (usingStubs()) return "ok";
  if (!API_BASE_URL) return "unavailable";

  try {
    const response = await fetch(`${API_BASE_URL}/volunteer-email-list/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store"
    });

    if (response.ok) return "ok";
    if ([400, 404, 410].includes(response.status)) return "invalid";
    return "unavailable";
  } catch (error) {
    console.error(`[volunteer-email-list] ${action} failed`, error);
    return "unavailable";
  }
}
