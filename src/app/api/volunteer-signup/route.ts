import { NextResponse } from "next/server";

/**
 * Server-side proxy for anonymous volunteer signups.
 *
 * The browser never talks to the events API directly. That keeps the API host
 * out of the public bundle, removes any CORS requirement (see comms.md [5] D3),
 * and gives us a place to drop honeypot hits and rate-limit before traffic
 * leaves our infrastructure.
 *
 * This is defence in depth, not the whole defence — the upstream endpoint is
 * publicly reachable, so it must rate-limit independently (comms.md [5] D4).
 */

import { API_BASE_URL, PROXY_KEY, usingStubs } from "@/lib/volunteer-events/config";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

/**
 * In-memory rate limit. Per-instance only, so it is a speed bump for casual
 * abuse rather than a guarantee — the upstream limit is the real one.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "validation" }, { status: 422 });
  }

  // Honeypot — silently accept so a bot cannot tell it was rejected.
  if (typeof body.company === "string" && body.company.trim()) {
    return NextResponse.json({ status: "confirmed" }, { status: 201 });
  }

  const eventId = String(body.event_id ?? "").trim();
  const firstName = String(body.first_name ?? "").trim();
  const lastName = String(body.last_name ?? "").trim();
  const email = String(body.email ?? "").trim();

  if (!eventId || !firstName || !lastName || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "validation" }, { status: 422 });
  }

  if (rateLimited(clientKey(request))) {
    return NextResponse.json({ reason: "rate_limited" }, { status: 429 });
  }

  if (usingStubs()) {
    // Local development against fixtures — never reachable in production.
    return NextResponse.json(
      {
        status: "pending_confirmation",
        signup_id: "fixture",
        spots_remaining: 11,
        volunteer_list: "pending_confirmation"
      },
      { status: 201 }
    );
  }

  // Telling someone they are signed up when nothing was recorded is worse than
  // an error, so an unconfigured production deploy fails loudly instead.
  if (!API_BASE_URL) {
    console.error("[volunteer-signup] SFLUV_API_BASE_URL is not set; cannot record signups");
    return NextResponse.json({ error: "upstream_unavailable" }, { status: 502 });
  }

  try {
    const upstream = await fetch(
      `${API_BASE_URL}/volunteer-events/${encodeURIComponent(eventId)}/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          /*
           * Every proxied signup leaves from the same egress IP, which would
           * collapse the backend's per-IP rate limit into a single bucket for
           * all of sfluv.org — see comms.md [8], correction 3. Forwarding the
           * original client IP keeps that limit meaningful. The backend only
           * trusts this header from known proxy sources.
           */
          "X-Forwarded-For": clientKey(request),
          ...(PROXY_KEY ? { "X-SFLUV-Proxy-Key": PROXY_KEY } : {})
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          volunteer_list_opt_in: body.volunteer_list_opt_in === true
        }),
        cache: "no-store"
      }
    );

    const payload = await upstream.json().catch(() => ({}));
    return NextResponse.json(payload, { status: upstream.status });
  } catch (error) {
    console.error("[volunteer-signup] upstream request failed", error);
    return NextResponse.json({ error: "upstream_unavailable" }, { status: 502 });
  }
}
