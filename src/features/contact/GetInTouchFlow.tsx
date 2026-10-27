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
 * The Get in touch flow: one form, shown immediately.
 *
 * It used to be two steps, with the Telegram community chat first and the form
 * behind a "fill out the contact form" button. The chat has been withdrawn
 * pending a link to chat inside the SFLuv app, and with it gone the second step
 * stopped being a step — a panel whose only content was a button revealing the
 * one thing on the page. So the gate went with it, and the form is open on
 * arrival.
 *
 * The form does not compose a mailto:. That approach looked like it worked and
 * frequently did not — a visitor with webmail and no configured mail client got
 * a dead button, and nothing was recorded either way, so a message that failed
 * to send left no trace of having been attempted. The submission is posted to
 * us, stored, and acknowledged with a reference.
 *
 * Nothing stands behind it now. The "prefer email?" fallback under the form is
 * gone too, because that inbox is not actively monitored — offering it sent
 * people somewhere nobody is reading, which is worse than offering nothing.
 */

type Props = {
  /** ?subject= from the page, so a link can arrive with its subject chosen. */
  initialSubject?: string | null;
};

export function GetInTouchFlow({ initialSubject }: Props) {
  const id = useId();
  const fieldId = (name: string) => `${id}-${name}`;

  const [subject, setSubject] = useState(() => subjectFromSlug(initialSubject));
  const [status, setStatus] = useState<Status>(null);
  const [sending, setSending] = useState(false);
  const [reference, setReference] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const subjectSlug = subjectFromSlug(String(data.get("subject")));
    const subjectLabel = getInTouchSubjects.find((option) => option.slug === subjectSlug)?.label ?? "";

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
          // Both, and they do different jobs. The label is what a person
          // reads on the alert; the slug is what the backend routes on, and it
          // is stable where the label is editable copy.
          subject_slug: subjectSlug,
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
      </Panel>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-title font-medium">{content.title}</h1>
      <p className="mt-2 mb-6 text-ink-muted">{content.lead}</p>

      <Panel padding="lg" bordered>
        <h2 className="text-lg font-medium text-ink">{content.form.heading}</h2>
        <p className="mt-2 text-ink-muted">{content.form.body}</p>

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
              // The Listbox hands back a plain string; narrowed through
              // subjectFromSlug so an unknown value falls back to the default
              // rather than being stored as a slug nothing routes on.
              onChange={(value) => setSubject(subjectFromSlug(value))}
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
        </form>
      </Panel>
    </div>
  );
}
