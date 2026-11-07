"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Select, TextArea, TextInput } from "@/components/ui/Field";
import { StatusMessage, type Status } from "@/components/ui/StatusMessage";
import { deleteAccountContent } from "@/content/forms";

const { help } = deleteAccountContent;

/**
 * Deletion request for people who cannot sign in.
 *
 * Sent through the same route as the Get in touch form, so it reaches the
 * support inbox and tells the people who handle it. A hidden honeypot field
 * absorbs bots.
 */
export function AccountDeletionForm() {
  const id = useId();
  const fieldId = (name: string) => `${id}-${name}`;
  const [status, setStatus] = useState<Status>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const read = (name: string) => String(data.get(name) ?? "").trim();

    if (read("company")) {
      setStatus({ tone: "neutral", message: "Request received." });
      return;
    }

    const body = [
      "SFLuv account deletion request",
      "",
      `Email: ${read("email")}`,
      `Login method: ${read("loginMethod")}`,
      `Wallet address: ${read("walletAddress") || "Not provided"}`,
      "",
      "Details:",
      read("details") || "Not provided",
      "",
      "Confirmation: User requested deletion of their SFLuv account and associated account data.",
      `Source: ${window.location.href}`
    ].join("\n");

    const form = event.currentTarget;
    setSending(true);
    setStatus(null);
    try {
      const response = await fetch("/api/support-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: read("email"),
          subject: "Account deletion request",
          subject_slug: "account-deletion",
          message: body
        })
      });
      const result = (await response.json().catch(() => null)) as
        | { reference?: string; error?: string }
        | null;
      if (!response.ok) {
        setStatus({
          tone: "error",
          message: result?.error || "We could not send that. Please try again."
        });
        return;
      }
      form.reset();
      setStatus({
        tone: "success",
        message: `Thank you — your reference is ${result?.reference ?? ""}. We have emailed you a copy and we may follow up to verify account ownership.`
      });
    } catch {
      setStatus({
        tone: "error",
        message: "We could not send that. Please check your connection and try again."
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="hidden" aria-hidden="true">
        <label htmlFor={fieldId("company")}>Leave this field empty</label>
        <input id={fieldId("company")} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field label="Email associated with your SFLuv account" htmlFor={fieldId("email")} required>
        <TextInput id={fieldId("email")} name="email" type="email" autoComplete="email" required />
      </Field>

      <Field label="How do you usually sign in?" htmlFor={fieldId("loginMethod")} required>
        <Select id={fieldId("loginMethod")} name="loginMethod" defaultValue="" required>
          <option value="">Choose one</option>
          {help.loginMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Wallet address, if known" htmlFor={fieldId("walletAddress")}>
        <TextInput id={fieldId("walletAddress")} name="walletAddress" type="text" placeholder="0x..." />
      </Field>

      <Field label="Anything else we should know?" htmlFor={fieldId("details")}>
        <TextArea
          id={fieldId("details")}
          name="details"
          placeholder="Example: I cannot access my Google login anymore."
        />
      </Field>

      <Checkbox name="confirm" required>
        {help.confirmation}
      </Checkbox>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={sending}>
          {sending ? "Sending…" : "Send deletion request"}
        </Button>
        <Button
          variant="secondary"
          href={help.supportLink}
        >
          Contact support directly
        </Button>
      </div>

      <StatusMessage status={status} className="mt-4" />

      <noscript>
        <p className="mt-4 text-sm text-ink-subtle">
          JavaScript is disabled. Please email support@sfluv.org to request deletion.
        </p>
      </noscript>
    </form>
  );
}
