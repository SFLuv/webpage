"use client";

import { useId, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Select, TextArea, TextInput } from "@/components/ui/Field";
import { Panel } from "@/components/ui/Panel";
import type { MailtoFormConfig } from "@/content/forms";

/**
 * Composes a mailto: link from the submitted fields and hands off to the
 * visitor's mail client — the same behaviour as the original inline script,
 * shared by the contact and support pages.
 */
export function MailtoForm({ config }: { config: MailtoFormConfig }) {
  const id = useId();
  const fieldId = (name: string) => `${id}-${name}`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const topic = String(data.get("topic") ?? "");
    const message = String(data.get("message") ?? "").trim();

    const subject = `${topic} from ${name}`;
    const body = [
      `Name: ${name}`,
      phone ? `Phone: ${phone}` : "",
      `Topic: ${topic}`,
      "",
      "Message:",
      message
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${config.recipient}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Panel padding="lg" bordered className="mx-auto max-w-2xl">
      <h1 className="text-title font-medium">{config.title}</h1>
      <p className="mt-2 mb-6 text-ink-muted">{config.lead}</p>

      <form onSubmit={handleSubmit} noValidate={false}>
        <Field label="Name" htmlFor={fieldId("name")} required>
          <TextInput id={fieldId("name")} name="name" type="text" autoComplete="name" required />
        </Field>

        <Field label="Phone" htmlFor={fieldId("phone")}>
          <TextInput id={fieldId("phone")} name="phone" type="tel" autoComplete="tel" />
        </Field>

        <Field label="Topic" htmlFor={fieldId("topic")}>
          <Select id={fieldId("topic")} name="topic" defaultValue={config.topics[0]}>
            {config.topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Message" htmlFor={fieldId("message")} required>
          <TextArea id={fieldId("message")} name="message" required />
        </Field>

        <Button type="submit">Open Email</Button>

        <p className="mt-4 text-sm text-ink-subtle">{config.note}</p>
      </form>

      <noscript>
        <p className="mt-4 text-sm text-ink-subtle">
          {config.noscriptNote}{" "}
          <a className="text-brand-deep underline" href={`mailto:${config.recipient}`}>
            {config.recipient}
          </a>
          .
        </p>
      </noscript>
    </Panel>
  );
}
