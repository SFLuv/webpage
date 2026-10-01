import { NextResponse } from "next/server";
import { API_BASE_URL, PROXY_KEY } from "@/lib/volunteer-events/config";

/**
 * Server-side proxy for signing a form.
 *
 * Same reasoning as the volunteer signup proxy: the browser never talks to the
 * backend directly, so the API host stays out of the public bundle and no CORS
 * is needed, and we can forward the visitor's real IP (with the shared secret
 * the backend requires before it will trust one) so rate limiting there is per
 * person rather than per Vercel egress address.
 */

const WINDOW_MS = 10 * 60_000;
// Generous: a room of people signs from one venue network at a shoot.
const MAX_PER_WINDOW = 40;
const MAX_BODY_BYTES = 2 * 1024 * 1024;

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

const FIELDS = [
  "version",
  "signer_name",
  "preferred_name",
  "contact",
  "event",
  "event_date",
  "choice",
  "is_minor",
  "guardian_name",
  "guardian_relationship",
  "signature_png",
  "guardian_signature_png",
  "esign_consent",
  "website"
] as const;

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return NextResponse.json({ message: "That signature was too large to send. Please try again." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "That request could not be read." }, { status: 400 });
  }

  // Honeypot — accept silently so a bot cannot tell it was rejected.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ confirmation_message: "Thank you." }, { status: 201 });
  }

  if (rateLimited(clientKey(request))) {
    return NextResponse.json(
      { message: "Too many signatures from this connection just now. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  // A signature that was not recorded must never look like one that was.
  if (!API_BASE_URL) {
    console.error("[forms] SFLUV_API_BASE_URL is not set; cannot record signatures");
    return NextResponse.json(
      { message: "Signing is temporarily unavailable. Please try again later." },
      { status: 502 }
    );
  }

  // Forward only the fields the form has, nothing else a caller might add.
  const forwarded: Record<string, unknown> = {};
  for (const field of FIELDS) {
    if (field in body) forwarded[field] = body[field];
  }

  try {
    const upstream = await fetch(`${API_BASE_URL}/site/forms/${encodeURIComponent(slug)}/sign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Forwarded-For": clientKey(request),
        "User-Agent": request.headers.get("user-agent") ?? "",
        ...(PROXY_KEY ? { "X-SFLUV-Proxy-Key": PROXY_KEY } : {})
      },
      body: JSON.stringify(forwarded),
      cache: "no-store"
    });

    const payload = await upstream.json().catch(() => ({}));
    return NextResponse.json(payload, { status: upstream.status });
  } catch (error) {
    console.error("[forms] upstream request failed", error);
    return NextResponse.json(
      { message: "We could not reach the server. Check your connection and try again." },
      { status: 502 }
    );
  }
}
