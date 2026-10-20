"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, TextArea, TextInput } from "@/components/ui/Field";
import { Listbox } from "@/components/ui/Listbox";
import { Panel } from "@/components/ui/Panel";
import { StatusMessage, type Status } from "@/components/ui/StatusMessage";
import {
  getInTouchContent as content,
  getInTouchSubjects,
  subjectFromSlug
} from "@/content/get-in-touch";

/**
 * The Get in touch flow.
 *
 * The first step is a choice rather than a form, because the right answer for
 * most people is the community chat: it is faster than we are and the answer is
 * usually already there. The form is the second option, opened deliberately.
 *
 * The form itself no longer composes a mailto:. That approach looked like it
 * worked and frequently did not — a visitor with webmail and no configured mail
 * client got a dead button, and nothing was recorded either way, so a message
 * that failed to send left no trace of having been attempted. Now the
 * submission is posted to us, stored, and acknowledged with a reference.
 */

type Props = {
  /** ?subject= from the page, so a link can arrive with its subject chosen. */
  initialSubject?: string | null;
  /** The community chat invite, or "" when none is configured. */
  communityUrl: string;
  /** Open the form immediately — used when a link arrives with a subject. */
  startOnForm?: boolean;
};

export function GetInTouchFlow({ initialSubject, communityUrl, startOnForm = false }: Props) {
  const id = useId();
  const fieldId = (name: string) => `${id}-${name}`;

  const [showForm, setShowForm] = useState(startOnForm);
  const [subject, setSubject] = useState(() => subjectFromSlug(initialSubject));
  const [status, setStatus] = useState<Status>(null);
  const [sending, setSending] = useState(false);
  const [reference, setReference] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const subjectLabel =
      getInTouchSubjects.find((option) => option.slug === String(data.get("subject")))?.label ?? "";

    setSending(true);
    setStatus(null);

    try {
      const res = await fetch("/api/support-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? "").trim(),
          name: String(data.get("name") ?? "").trim(),
          subject: subjectLabel,
          message: String(data.get("message") ?? "").trim(),
          // Honeypot. Hidden from people, irresistible to bots.
          company: String(data.get("company") ?? "")
        })
      });

      const body = (await res.json().catch(() => null)) as { reference?: string; error?: string } | null;

      if (!res.ok) {
        setStatus({ tone: "error", message: body?.error || content.form.failure });
        return;
      }

      setReference(body?.reference ?? "");
      setStatus({ tone: "success", message: content.form.success(body?.reference ?? "") });
      form.reset();
      setSubject(subjectFromSlug(initialSubject));
    } catch {
      setStatus({ tone: "error", message: content.form.failure });
    } finally {
      setSending(false);
    }
  };

  // Once a message is in, the form is replaced by its own confirmation: leaving
  // a filled-in form on screen beside "thank you" invites a second send.
  if (reference) {
    return (
      <Panel padding="lg" bordered className="mx-auto max-w-2xl">
        <h1 className="text-title font-medium">Message received</h1>
        <p className="mt-2 text-ink-muted">{content.form.success(reference)}</p>
        <p className="mt-6 text-sm text-ink-subtle">
          Keep <span className="font-medium text-ink">{reference}</span> for your records.
        </p>
        {communityUrl ? (
          <p className="mt-6">
            <Button href={communityUrl} variant="secondary">
              {content.chat.cta}
            </Button>
          </p>
        ) : null}
      </Panel>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-title font-medium">{content.title}</h1>
      <p className="mt-2 mb-6 text-ink-muted">{content.lead}</p>

      {/* Step one: the chat. */}
      <Panel padding="lg" bordered>
        <h2 className="text-lg font-medium text-ink">{content.chat.heading}</h2>
        <p className="mt-2 text-ink-muted">{content.chat.body}</p>
        {communityUrl ? (
          <p className="mt-4">
            <Button href={communityUrl}>
              {content.chat.cta}
            </Button>
          </p>
        ) : (
          <p className="mt-4 text-sm text-ink-subtle">{content.chat.unavailable}</p>
        )}
      </Panel>

      {/* Step two: the form, closed until asked for. */}
      <Panel padding="lg" bordered className="mt-4">
        <h2 className="text-lg font-medium text-ink">{content.form.heading}</h2>
        <p className="mt-2 text-ink-muted">{content.form.body}</p>

        {!showForm ? (
          <p className="mt-4">
            <Button type="button" variant="secondary" onClick={() => setShowForm(true)}>
              Fill out the contact form
            </Button>
          </p>
        ) : (
          <form className="relative mt-6" onSubmit={handleSubmit} noValidate={false}>
            <Field label="Your email" htmlFor={fieldId("email")} required hint="This is how we reply to you.">
              <TextInput
                id={fieldId("email")}
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={sending}
              />
            </Field>

            <Field label="Your name" htmlFor={fieldId("name")}>
              <TextInput id={fieldId("name")} name="name" type="text" autoComplete="name" disabled={sending} />
            </Field>

            <Field label="Subject" htmlFor={fieldId("subject")}>
              <Listbox
                id={fieldId("subject")}
                name="subject"
                options={getInTouchSubjects.map((option) => ({
                  value: option.slug,
                  label: option.label,
                  hint: option.hint
                }))}
                value={subject}
                onChange={setSubject}
              />
            </Field>

            <Field label="Message" htmlFor={fieldId("message")} required>
              <TextArea id={fieldId("message")} name="message" required disabled={sending} />
            </Field>

            {/* Off-screen rather than display:none, which some bots skip. */}
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <label htmlFor={fieldId("company")}>Company</label>
              <input id={fieldId("company")} name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" disabled={sending}>
                {sending ? content.form.sending : content.form.cta}
              </Button>
              <StatusMessage status={status} />
            </div>

            <p className="mt-4 text-sm text-ink-subtle">
              Prefer email? Write to{" "}
              <a className="text-brand-deep underline" href={`mailto:${content.form.fallbackEmail}`}>
                {content.form.fallbackEmail}
              </a>
              .
            </p>
          </form>
        )}
      </Panel>
    </div>
  );
}
