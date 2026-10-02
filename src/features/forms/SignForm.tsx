"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, TextInput } from "@/components/ui/Field";
import { Panel } from "@/components/ui/Panel";
import { StatusMessage, type Status } from "@/components/ui/StatusMessage";
import type { PublicForm } from "@/lib/site-content/types";
import { CHOICES_TOKEN, FormBody } from "./FormBody";
import { SignaturePad, type SignaturePadHandle } from "./SignaturePad";

type Result = { message: string; emailed: boolean };

/**
 * Signs a form. Wrapped so "Sign for another person" can start clean: at an
 * event one tablet gets handed round, and nothing from the last person may be
 * left behind.
 */
export function SignForm({ form }: { form: PublicForm }) {
  const [round, setRound] = useState(0);
  return <SignFormInner key={round} form={form} onAnother={() => setRound((n) => n + 1)} />;
}

function SignFormInner({ form, onAnother }: { form: PublicForm; onAnother: () => void }) {
  const id = useId();
  const fieldId = (name: string) => `${id}-${name}`;
  const { config } = form;

  const [signerName, setSignerName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [contact, setContact] = useState("");
  const [event, setEvent] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [choice, setChoice] = useState("");
  const [isMinor, setIsMinor] = useState(false);
  const [guardianName, setGuardianName] = useState("");
  const [guardianRelationship, setGuardianRelationship] = useState("");
  const [esign, setEsign] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot

  const signature = useRef<SignaturePadHandle>(null);
  const guardianSignature = useRef<SignaturePadHandle>(null);

  const [status, setStatus] = useState<Status>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }));
  }, []);

  const fail = (message: string) => {
    setStatus({ tone: "error", message });
    return false;
  };

  const validate = () => {
    if (signerName.trim().length < 2) return fail("Please enter your full name.");
    if (config.contact === "required" && !contact.trim()) return fail("Please enter an email address or phone number.");
    if (config.choices.length > 0 && !choice) return fail("Please choose one of the options.");
    if (isMinor) {
      if (guardianName.trim().length < 2) return fail("Please enter the parent or guardian's full name.");
      if (!guardianRelationship.trim()) return fail("Please enter the parent or guardian's relationship to the participant.");
      if (!guardianSignature.current?.toDataURL()) return fail("The parent or guardian needs to sign in their box.");
    } else if (!signature.current?.toDataURL()) {
      return fail("Please sign in the signature box.");
    }
    if (!esign) return fail("Please confirm that you agree to sign electronically.");
    return true;
  };

  const handleSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    if (submitting || !validate()) return;

    setSubmitting(true);
    setStatus({ tone: "neutral", message: "Submitting your signature…" });

    try {
      const response = await fetch(`/api/forms/${encodeURIComponent(form.slug)}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: form.version,
          signer_name: signerName.trim(),
          preferred_name: preferredName.trim(),
          contact: contact.trim(),
          event: event.trim(),
          event_date: eventDate,
          choice,
          is_minor: isMinor,
          guardian_name: guardianName.trim(),
          guardian_relationship: guardianRelationship.trim(),
          signature_png: signature.current?.toDataURL() ?? "",
          guardian_signature_png: isMinor ? (guardianSignature.current?.toDataURL() ?? "") : "",
          esign_consent: esign,
          website
        })
      });

      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
        confirmation_message?: string;
        emailed?: boolean;
      };

      if (!response.ok) {
        setStatus({ tone: "error", message: payload.message ?? "We could not record your signature. Please try again." });
        return;
      }

      setResult({ message: payload.confirmation_message ?? config.confirmation_message, emailed: payload.emailed === true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus({ tone: "error", message: "We could not reach the server. Check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <Panel padding="lg" bordered>
        <div role="status" className="text-center">
          <h2 className="text-title font-medium">Signed. Thank you!</h2>
          <p className="mt-3 text-ink-muted">{result.message}</p>
          {result.emailed ? (
            <p className="mt-2 text-ink-muted">We emailed you a copy of what you signed.</p>
          ) : (
            <p className="mt-2 text-ink-muted">
              Want a copy for your records? Take a screenshot of this page, or ask us for one.
            </p>
          )}
          <div className="mt-6">
            <Button variant="secondary" onClick={onAnother}>
              Sign for another person
            </Button>
          </div>
        </div>
      </Panel>
    );
  }

  const choiceGroup =
    config.choices.length > 0 ? (
      <fieldset className="my-5">
        <legend className={config.choices_prompt ? "mb-2 font-medium text-ink" : "sr-only"}>
          {config.choices_prompt || "Choose one"}
        </legend>
        <div className="flex flex-col gap-2.5">
          {config.choices.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-surface p-3.5 has-[:checked]:border-brand has-[:checked]:bg-brand-tint"
            >
              <input
                type="radio"
                name={fieldId("choice")}
                value={option.id}
                checked={choice === option.id}
                onChange={() => setChoice(option.id)}
                className="mt-1 size-4 shrink-0 accent-brand"
              />
              <span className="text-ink-muted">
                <strong className="font-semibold text-ink">{option.label}</strong>
                {option.description ? ` ${option.description}` : ""}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Panel padding="lg" bordered>
        {form.summary ? <p className="mb-6 text-ink-muted">{form.summary}</p> : null}

        <div className="grid gap-x-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor={fieldId("name")} required>
            <TextInput
              id={fieldId("name")}
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              autoComplete="name"
              maxLength={120}
            />
          </Field>
          {config.preferred_name ? (
            <Field label="Preferred name" htmlFor={fieldId("preferred")} hint="Optional. What you like to be called.">
              <TextInput
                id={fieldId("preferred")}
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                maxLength={80}
              />
            </Field>
          ) : null}
        </div>

        {config.contact !== "off" ? (
          <Field
            label={config.contact === "required" ? "Email or phone" : "Email or phone (optional)"}
            htmlFor={fieldId("contact")}
            required={config.contact === "required"}
            hint="If you give an email address, we will email you a copy of what you signed."
          >
            <TextInput
              id={fieldId("contact")}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              autoComplete="email"
              maxLength={200}
            />
          </Field>
        ) : null}

        {config.event === "ask" ? (
          <div className="grid gap-x-5 sm:grid-cols-2">
            <Field label="Event or project (optional)" htmlFor={fieldId("event")}>
              <TextInput id={fieldId("event")} value={event} onChange={(e) => setEvent(e.target.value)} maxLength={200} />
            </Field>
            <Field label="Event date (optional)" htmlFor={fieldId("eventDate")}>
              <TextInput
                id={fieldId("eventDate")}
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </Field>
          </div>
        ) : null}
        {config.event === "fixed" ? (
          <p className="mb-4 text-ink-muted">
            <strong className="font-semibold text-ink">Event or project:</strong> {config.event_name}
          </p>
        ) : null}

        <div className="my-6 border-t border-line pt-2">
          <FormBody body={form.body} choices={choiceGroup} />
          {!form.body.includes(CHOICES_TOKEN) ? choiceGroup : null}
        </div>

        {config.guardian_section ? (
          <Checkbox checked={isMinor} onChange={(e) => setIsMinor(e.target.checked)}>
            <strong className="font-semibold text-ink">The participant is under 18.</strong> A parent or legal guardian
            must also sign below.
          </Checkbox>
        ) : null}

        <h3 className="mt-6 mb-2 font-medium text-ink">
          {isMinor ? "Participant signature (optional)" : "Your signature"} <span className="sr-only">required</span>
        </h3>
        <SignaturePad ref={signature} label="Participant signature" suggestedName={signerName} />

        {isMinor ? (
          <div className="mt-8 rounded-lg border border-line bg-surface-muted/50 p-4 sm:p-5">
            <h3 className="mb-1 font-medium text-ink">Parent or guardian</h3>
            <p className="mb-4 text-sm text-ink-muted">
              I am the participant&apos;s parent or legal guardian. I consent to the recording and uses described above on
              the participant&apos;s behalf and confirm that I have authority to sign.
            </p>
            <div className="grid gap-x-5 sm:grid-cols-2">
              <Field label="Parent or guardian name" htmlFor={fieldId("gname")} required>
                <TextInput
                  id={fieldId("gname")}
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  maxLength={120}
                />
              </Field>
              <Field label="Relationship to participant" htmlFor={fieldId("grel")} required>
                <TextInput
                  id={fieldId("grel")}
                  value={guardianRelationship}
                  onChange={(e) => setGuardianRelationship(e.target.value)}
                  maxLength={80}
                />
              </Field>
            </div>
            <SignaturePad ref={guardianSignature} label="Parent or guardian signature" suggestedName={guardianName} />
          </div>
        ) : null}

        <p className="mt-5 text-sm text-ink-subtle">Date: {today || "today"}. The time of signing is recorded automatically.</p>

        <div className="mt-6">
          <Checkbox checked={esign} onChange={(e) => setEsign(e.target.checked)}>
            I agree to sign this form electronically, and I understand that my signature here has the same effect as a
            handwritten one.
          </Checkbox>
        </div>

        {/* Honeypot: invisible to people, tempting to bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Leave this empty
            <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Submitting…" : "Sign and submit"}
          </Button>
          <StatusMessage status={status} />
        </div>
      </Panel>
    </form>
  );
}
