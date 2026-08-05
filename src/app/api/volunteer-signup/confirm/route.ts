import { NextResponse } from "next/server";
import { confirmSignup } from "@/lib/volunteer-events/signup-confirm";

/**
 * Confirms a portal signup and redirects back to the landing page.
 *
 * POST-only: mail clients and corporate link scanners prefetch URLs in email,
 * so a GET that confirmed would mark a signup confirmed on behalf of someone
 * who never clicked — defeating the point of confirming at all.
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const token = String(form.get("token") ?? "");

  const result = await confirmSignup(token);

  const target = new URL("/volunteer-signup/confirm", request.url);
  target.searchParams.set("status", result);
  // Keep the token only when a retry could still succeed.
  if (result === "unavailable") target.searchParams.set("token", token);

  return NextResponse.redirect(target, { status: 303 });
}
