import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { EmailPreferenceResult } from "@/features/volunteers/EmailPreferenceResult";
import { readSignupToken } from "@/lib/volunteer-events/signup-confirm";

export const metadata: Metadata = {
  title: "Confirm your volunteer signup",
  robots: { index: false, follow: false }
};

/** Token links are single-use and personal — never cache the outcome. */
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ token?: string | string[]; status?: string | string[] }>;
};

function one(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function ConfirmSignupPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = one(params.token);
  const status = one(params.status);

  // Post-confirmation states, set by the redirect from the POST handler.
  if (status === "ok") {
    return (
      <EmailPreferenceResult
        title="Your spot is confirmed"
        body="Thanks for confirming — we'll see you there. Details are in your email, including a link to cancel if your plans change."
      />
    );
  }

  if (status === "invalid") {
    return (
      <EmailPreferenceResult
        tone="error"
        title="That confirmation link didn't work"
        body="It may have already been used, or the 24-hour window may have passed and the spot released. You're welcome to sign up again."
      />
    );
  }

  if (status === "unavailable") {
    return (
      <EmailPreferenceResult
        tone="error"
        title="We couldn't confirm your spot just now"
        body="Something went wrong on our end. Please try the link again in a few minutes — your spot is still held."
      />
    );
  }

  const read = await readSignupToken(token);

  if (read.kind === "invalid") {
    return (
      <EmailPreferenceResult
        tone="error"
        title="That confirmation link didn't work"
        body="It may have already been used, or the 24-hour window may have passed and the spot released. You're welcome to sign up again."
      />
    );
  }

  if (read.kind === "unavailable") {
    return (
      <EmailPreferenceResult
        tone="error"
        title="We couldn't load your signup"
        body="Something went wrong on our end. Please try the link again in a few minutes."
      />
    );
  }

  if (read.state === "confirmed") {
    return (
      <EmailPreferenceResult
        title="This spot is already confirmed"
        body="Nothing more to do — we'll see you there."
      />
    );
  }

  const eventName = read.eventTitle ?? "this volunteer event";

  return (
    <EmailPreferenceResult
      title="Confirm your spot"
      body={
        read.email
          ? `Confirm the spot held for ${read.email} at ${eventName}.`
          : `Confirm the spot held for you at ${eventName}.`
      }
    >
      <form method="post" action="/api/volunteer-signup/confirm">
        <input type="hidden" name="token" value={token} />
        <Button type="submit" size="lg">
          Yes, confirm my spot
        </Button>
      </form>
    </EmailPreferenceResult>
  );
}
