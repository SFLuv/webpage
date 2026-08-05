import { NextResponse } from "next/server";
import { mutateEmailList, type EmailListAction } from "@/lib/volunteer-events/email-list";

const ACTIONS: EmailListAction[] = ["confirm", "unsubscribe"];

/**
 * Performs a volunteer email-list mutation and redirects back to the landing
 * page with the outcome.
 *
 * POST-only by design: mail clients and corporate link scanners prefetch URLs
 * in email, so a GET that mutated would confirm or unsubscribe on behalf of
 * someone who never clicked. See comms.md [13].
 */
export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;

  if (!ACTIONS.includes(action as EmailListAction)) {
    return NextResponse.json({ error: "unknown_action" }, { status: 404 });
  }

  const form = await request.formData();
  const token = String(form.get("token") ?? "");

  const result = await mutateEmailList(action as EmailListAction, token);

  const target = new URL(`/volunteer-email/${action}`, request.url);
  target.searchParams.set("status", result);
  // Keep the token only when the user may need to retry.
  if (result === "unavailable") target.searchParams.set("token", token);

  return NextResponse.redirect(target, { status: 303 });
}
