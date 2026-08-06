"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, TextInput } from "@/components/ui/Field";
import { StatusMessage, type Status } from "@/components/ui/StatusMessage";
import { useEventSpots } from "./EventSpotsContext";

type InternalSignupFormProps = {
  eventId: string;
  eventTitle: string;
  spotsRemaining: number | null;
};

const FAILURE_MESSAGES: Record<string, string> = {
  full: "This event just filled up. Try another event, or check back in case a spot opens.",
  already_signed_up: "You are already signed up for this event — no need to sign up again.",
  closed: "Signups for this event have closed.",
  not_internal: "Signups for this event are handled elsewhere. Please use the signup link.",
  rate_limited: "Too many attempts. Please wait a moment and try again.",
  validation_error: "Please check the details above and try again.",
  not_found: "This event is no longer available."
};

/**
 * Anonymous signup for internally-managed events.
 *
 * Posts to our own route handler rather than the events API directly, so the
 * backend host stays private and rate limiting happens before the request
 * leaves our infrastructure.
 */
export function InternalSignupForm({ eventId, eventTitle, spotsRemaining }: InternalSignupFormProps) {
  const id = useId();
  const { setSpotsRemaining } = useEventSpots(spotsRemaining);
  const fieldId = (name: string) => `${id}-${name}`;

  const [status, setStatus] = useState<Status>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  /** Server-reported signup outcome: confirmed | pending_confirmation. */
  const [signupState, setSignupState] = useState<string>("confirmed");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    setSubmitting(true);
    setStatus({ tone: "neutral", message: "Signing you up…" });

    try {
      const response = await fetch("/api/volunteer-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          first_name: String(data.get("first_name") ?? "").trim(),
          last_name: String(data.get("last_name") ?? "").trim(),
          email: String(data.get("email") ?? "").trim(),
          volunteer_list_opt_in: data.get("volunteer_list_opt_in") === "on",
          // Honeypot: bots fill every field, people never see this one.
          company: String(data.get("company") ?? "")
        })
      });

      if (response.ok) {
        const payload = await response.json().catch(() => null);
        form.reset();
        setDone(true);
        /*
         * The spot is confirmed immediately; the mailing-list subscription is
         * double opt-in and activates only when they click the confirmation
         * link. Driven off the server's `volunteer_list` field rather than the
         * checkbox, so the copy stays true if that policy ever changes —
         * see comms.md [13], Q-M1.
         */
        /*
         * Anonymous portal signups now land `pending_confirmation` — the spot
         * is held, but the address is unproven until they click the emailed
         * link (comms.md [29]). Copy is driven off the server's `status` rather
         * than assumed, so it stays true if that policy changes.
         */
        const state = payload?.status === "pending_confirmation" ? "pending_confirmation" : "confirmed";
        setSignupState(state);

        /*
         * Take the new count from the response rather than refetching. It
         * decrements immediately at `pending_confirmation` — the spot is held
         * while they confirm — so the page reflects that straight away.
         */
        if (typeof payload?.spots_remaining === "number") {
          setSpotsRemaining(payload.spots_remaining);
        }

        setStatus({
          tone: "success",
          message:
            state === "pending_confirmation"
              ? `Your spot at ${eventTitle} is held. Check your email and click the link to confirm it.`
              : `Your spot at ${eventTitle} is confirmed. We've emailed you the details, including a link to cancel if your plans change.`
        });
        return;
      }

      const body = await response.json().catch(() => null);
      const reason = body?.reason ?? body?.error ?? "";

      setStatus({
        tone: "error",
        message:
          FAILURE_MESSAGES[reason] ??
          (response.status === 422
            ? "Please check the details above and try again."
            : "We could not complete your signup. Please try again shortly.")
      });
    } catch {
      setStatus({ tone: "error", message: "We could not reach the signup service. Please try again shortly." });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div>
        <StatusMessage status={status} className="text-base" />

        {/*
          The spot is genuinely held while they confirm, so this says so
          plainly. The 24-hour release is stated because an abandoned form does
          eventually lose the place — but the framing is a deadline to act on,
          not a spot that is already at risk.
        */}
        {signupState === "pending_confirmation" ? (
          <p className="mt-3 text-sm text-ink-muted">
            We&rsquo;ll hold it for 24 hours while you confirm. If the email hasn&rsquo;t arrived in a few
            minutes, check your spam folder.
          </p>
        ) : null}

        {/*
          Signups are matched to app accounts by email, so an anonymous signup
          here can trigger a phone reminder. Disclosed at the point of
          collection rather than letting the notification be a surprise —
          see comms.md [14].
        */}
        <p className="mt-3 text-sm text-ink-subtle">
          If this address is linked to your SFLuv app account, you&rsquo;ll get a reminder on your phone
          before the event too.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="hidden" aria-hidden="true">
        <label htmlFor={fieldId("company")}>Leave this field empty</label>
        <input id={fieldId("company")} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-x-4 sm:grid-cols-2">
        <Field label="First name" htmlFor={fieldId("first")} required>
          <TextInput
            id={fieldId("first")}
            name="first_name"
            type="text"
            autoComplete="given-name"
            required
          />
        </Field>

        <Field label="Last name" htmlFor={fieldId("last")} required>
          <TextInput
            id={fieldId("last")}
            name="last_name"
            type="text"
            autoComplete="family-name"
            required
          />
        </Field>
      </div>

      <Field label="Email" htmlFor={fieldId("email")} required>
        <TextInput id={fieldId("email")} name="email" type="email" autoComplete="email" required />
      </Field>

      {/*
        Wording deliberately avoids starting with "Email" — the accessible name
        would otherwise collide with the Email field for anyone (or anything)
        picking controls by label.
      */}
      <Checkbox name="volunteer_list_opt_in" defaultChecked>
        Keep me posted about other SFLuv volunteer events. You can unsubscribe at any time.
      </Checkbox>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Signing up…" : "Sign up"}
      </Button>

      <StatusMessage status={status} className="mt-4" />
    </form>
  );
}
