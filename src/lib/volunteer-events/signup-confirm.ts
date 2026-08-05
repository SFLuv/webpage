import { API_BASE_URL, usingStubs } from "./config";

export type SignupConfirmRead =
  | { kind: "ok"; email: string | null; eventTitle: string | null; state: string }
  | { kind: "invalid" }
  | { kind: "unavailable" };

export type SignupConfirmResult = "ok" | "invalid" | "unavailable";

/**
 * Reads a signup-confirmation token. Safe to call on page load — the backend's
 * GET is read-only, which is what makes link prefetching harmless. See
 * comms.md [29].
 */
export async function readSignupToken(token: string): Promise<SignupConfirmRead> {
  if (!token.trim()) return { kind: "invalid" };

  if (usingStubs()) {
    return { kind: "ok", email: "you@example.com", eventTitle: "a volunteer event", state: "pending" };
  }

  // Never show a confirmation page we cannot actually act on.
  if (!API_BASE_URL) return { kind: "unavailable" };

  try {
    const response = await fetch(
      `${API_BASE_URL}/volunteer-events/signup/confirm?token=${encodeURIComponent(token)}`,
      { cache: "no-store", headers: { Accept: "application/json" } }
    );

    if (response.ok) {
      const payload = await response.json().catch(() => ({}));
      return {
        kind: "ok",
        email: typeof payload?.email === "string" ? payload.email : null,
        eventTitle: typeof payload?.event_title === "string" ? payload.event_title : null,
        state: typeof payload?.status === "string" ? payload.status : "pending"
      };
    }

    if ([400, 404, 410].includes(response.status)) return { kind: "invalid" };
    return { kind: "unavailable" };
  } catch (error) {
    console.error("[signup-confirm] read failed", error);
    return { kind: "unavailable" };
  }
}

/** Performs the confirmation. Only ever called from a POST handler. */
export async function confirmSignup(token: string): Promise<SignupConfirmResult> {
  if (!token.trim()) return "invalid";
  if (usingStubs()) return "ok";
  if (!API_BASE_URL) return "unavailable";

  try {
    const response = await fetch(`${API_BASE_URL}/volunteer-events/signup/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store"
    });

    if (response.ok) return "ok";
    if ([400, 404, 410].includes(response.status)) return "invalid";
    return "unavailable";
  } catch (error) {
    console.error("[signup-confirm] confirm failed", error);
    return "unavailable";
  }
}
