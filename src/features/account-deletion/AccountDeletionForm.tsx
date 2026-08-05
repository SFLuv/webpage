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
 * There is no backend endpoint yet, so the request is handed to the visitor's
 * mail client. A hidden honeypot field absorbs bots.
 */
export function AccountDeletionForm() {
  const id = useId();
  const fieldId = (name: string) => `${id}-${name}`;
  const [status, setStatus] = useState<Status>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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

    window.location.href =
      `mailto:${encodeURIComponent(help.supportEmail)}` +
      `?subject=${encodeURIComponent("SFLuv account deletion request")}` +
      `&body=${encodeURIComponent(body)}`;

    setStatus({
      tone: "neutral",
      message:
        "Your email app should open with a prefilled deletion request. Please send that email to complete the request."
    });
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
        <Button type="submit">Send deletion request</Button>
        <Button
          variant="secondary"
          href={`mailto:${help.supportEmail}?subject=SFLuv account deletion request`}
        >
          Contact support directly
        </Button>
      </div>

      <StatusMessage status={status} className="mt-4" />

      <noscript>
        <p className="mt-4 text-sm text-ink-subtle">
          JavaScript is disabled. Please use the Contact support directly button above.
        </p>
      </noscript>
    </form>
  );
}
