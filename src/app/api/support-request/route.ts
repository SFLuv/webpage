import { NextResponse } from "next/server";

/**
 * Server-side proxy for Get in touch submissions.
 *
 * The browser never talks to the backend directly, for the same reasons as the
 * volunteer signup proxy: the API host stays out of the public bundle, there is
 * no CORS requirement, and we get somewhere to drop honeypot hits before
 * traffic leaves our infrastructure.
 *
 * The proxy key is what lets the backend trust our forwarded client address.
 * Without it every submission from the website shares one rate-limit bucket,
 * which is a working fallback rather than a failure.
 */

import { API_BASE_URL, PROXY_KEY, usingStubs } from "@/lib/volunteer-events/config";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE = 8000;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Could not read that." }, { status: 422 });
  }

  // Honeypot — accepted so a bot cannot tell it was rejected, and never
  // forwarded.
  if (typeof body.company === "string" && body.company.trim()) {
    return NextResponse.json({ reference: "SUP-000000" }, { status: 201 });
  }

  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { error: "That email address does not look right. We need it to reply to you." },
      { status: 422 }
    );
  }
  if (!message) {
    return NextResponse.json({ error: "Please tell us what you need." }, { status: 422 });
  }

  const payload = {
    email,
    name: String(body.name ?? "").trim().slice(0, 200),
    subject: String(body.subject ?? "").trim().slice(0, 200),
    message: message.slice(0, MAX_MESSAGE)
  };

  // Local development with no backend: acknowledge with an obviously fake
  // reference so the flow can be walked end to end, and never in production —
  // telling somebody we have their message when nothing recorded it would be
  // the worst failure this page can have.
  if (usingStubs()) {
    return NextResponse.json({ reference: "SUP-LOCAL1" }, { status: 201 });
  }
  if (!API_BASE_URL) {
    console.error("[support-request] SFLUV_API_BASE_URL is not set; a message was lost");
    return NextResponse.json(
      { error: "We could not send that right now. Please email us directly." },
      { status: 503 }
    );
  }

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  try {
    const upstream = await fetch(`${API_BASE_URL}/support/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(PROXY_KEY ? { "X-SFLUV-Proxy-Key": PROXY_KEY } : {}),
        ...(forwarded ? { "X-Forwarded-For": forwarded } : {})
      },
      body: JSON.stringify(payload)
    });

    const data = (await upstream.json().catch(() => null)) as
      | { reference?: string; error?: string }
      | null;

    if (!upstream.ok) {
      return NextResponse.json(
        { error: data?.error || "We could not send that. Please try again." },
        { status: upstream.status }
      );
    }
    return NextResponse.json({ reference: data?.reference ?? "" }, { status: 201 });
  } catch (error) {
    console.error("[support-request] upstream failed", error);
    return NextResponse.json(
      { error: "We could not send that right now. Please email us directly." },
      { status: 502 }
    );
  }
}
