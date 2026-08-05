import { Button } from "@/components/ui/Button";
import { EmailPreferenceResult } from "./EmailPreferenceResult";
import { readEmailListToken, type EmailListAction } from "@/lib/volunteer-events/email-list";

type Copy = {
  /** Shown once the mutation has succeeded. */
  doneTitle: string;
  doneBody: string;
  /** Shown before acting, with the confirm button. */
  askTitle: string;
  askBody: (email: string | null) => string;
  askButton: string;
  /** Shown when the token's state means there is nothing to do. */
  noopTitle: string;
  noopBody: string;
  /** Backend state that means the action has already happened. */
  settledState: string;
};

const COPY: Record<EmailListAction, Copy> = {
  confirm: {
    doneTitle: "You're on the list",
    doneBody:
      "Thanks for confirming. We'll email you when new SFLuv volunteer events are announced, and every one of those emails has an unsubscribe link.",
    askTitle: "Confirm your subscription",
    askBody: (email) =>
      email
        ? `Confirm that ${email} should receive announcements about new SFLuv volunteer events.`
        : "Confirm that you'd like to receive announcements about new SFLuv volunteer events.",
    askButton: "Yes, subscribe me",
    noopTitle: "You're already subscribed",
    noopBody: "Nothing more to do — you'll hear from us when new volunteer events are announced.",
    settledState: "active"
  },
  unsubscribe: {
    doneTitle: "You've been unsubscribed",
    doneBody:
      "You won't receive any more volunteer event emails from SFLuv. You're welcome back any time — signing up for an event never requires joining the list.",
    askTitle: "Unsubscribe from volunteer emails?",
    askBody: (email) =>
      email
        ? `${email} will stop receiving announcements about new SFLuv volunteer events. Any event you've already signed up for is unaffected.`
        : "You'll stop receiving announcements about new SFLuv volunteer events. Any event you've already signed up for is unaffected.",
    askButton: "Yes, unsubscribe me",
    noopTitle: "You're already unsubscribed",
    noopBody: "This address isn't on the volunteer email list, so there's nothing to remove.",
    settledState: "unsubscribed"
  }
};

type EmailPreferencePageProps = {
  action: EmailListAction;
  token: string;
  status: string;
};

/**
 * Shared shell for the volunteer email-list landing pages.
 *
 * Reads token state on load (the backend GET is read-only) and only mutates
 * from an explicit POST, so prefetching the link from an inbox changes nothing.
 */
export async function EmailPreferencePage({ action, token, status }: EmailPreferencePageProps) {
  const copy = COPY[action];

  // Post-mutation states, set by the redirect from the POST handler.
  if (status === "ok") {
    return <EmailPreferenceResult title={copy.doneTitle} body={copy.doneBody} />;
  }

  if (status === "invalid") {
    return (
      <EmailPreferenceResult
        tone="error"
        title="That link didn't work"
        body="It may have already been used or expired. If you're still receiving emails you didn't ask for, contact us and we'll sort it out."
      />
    );
  }

  if (status === "unavailable") {
    return (
      <EmailPreferenceResult
        tone="error"
        title="We couldn't process that just now"
        body="Something went wrong on our end. Please try the link again in a few minutes."
      />
    );
  }

  const read = await readEmailListToken(action, token);

  if (read.kind === "invalid") {
    return (
      <EmailPreferenceResult
        tone="error"
        title="That link didn't work"
        body="It may have already been used or expired. Please use the most recent email we sent you."
      />
    );
  }

  if (read.kind === "unavailable") {
    return (
      <EmailPreferenceResult
        tone="error"
        title="We couldn't load your preferences"
        body="Something went wrong on our end. Please try the link again in a few minutes."
      />
    );
  }

  if (read.state === copy.settledState) {
    return <EmailPreferenceResult title={copy.noopTitle} body={copy.noopBody} />;
  }

  return (
    <EmailPreferenceResult title={copy.askTitle} body={copy.askBody(read.email)}>
      <form method="post" action={`/api/volunteer-email/${action}`}>
        <input type="hidden" name="token" value={token} />
        <Button type="submit" size="lg">
          {copy.askButton}
        </Button>
      </form>
    </EmailPreferenceResult>
  );
}
