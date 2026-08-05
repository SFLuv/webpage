"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { StatusMessage, type Status } from "@/components/ui/StatusMessage";

const API_BASE_URL = "https://api.sfluv.org";
const SUBMIT_PATH = "/w9/submit";

const WALLET_PATTERN = /^0x[a-fA-F0-9]{40}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Notifies SFLuv that a wallet holder is ready to receive a W9.
 *
 * The wallet address arrives as a `?wallet=` query parameter; without a valid
 * one there is nothing to submit against, so the form stays disabled.
 */
export function W9NotifyForm() {
  const id = useId();
  const searchParams = useSearchParams();
  const wallet = (searchParams.get("wallet") ?? "").trim();
  const emailParam = (searchParams.get("email") ?? "").trim();

  const [email, setEmail] = useState(emailParam);
  const [status, setStatus] = useState<Status>(null);
  const [submitting, setSubmitting] = useState(false);

  const walletValid = WALLET_PATTERN.test(wallet);

  useEffect(() => {
    if (!walletValid) {
      setStatus({ tone: "error", message: "Missing or invalid wallet address in the URL." });
    }
  }, [walletValid]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus({ tone: "error", message: "Please enter a valid email address." });
      return;
    }

    setSubmitting(true);
    setStatus({ tone: "neutral", message: "Submitting..." });

    try {
      const response = await fetch(`${API_BASE_URL}${SUBMIT_PATH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: wallet,
          email: email.trim(),
          year: new Date().getUTCFullYear()
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        if (response.status === 409 && data?.error === "w9_pending") {
          setStatus({ tone: "error", message: "This wallet already has a W9 submission pending approval." });
          return;
        }

        if (response.status === 409 && data?.error === "w9_approved") {
          setStatus({ tone: "error", message: "This wallet already has an approved W9 for this year." });
          return;
        }

        throw new Error("W9 submit request failed");
      }

      setEmail("");
      setStatus({
        tone: "success",
        message: "Thanks! Your submission has been recorded and admin has been notified."
      });
    } catch {
      setStatus({ tone: "error", message: "Submission failed. Please try again or contact support." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="mt-4 max-w-lg" onSubmit={handleSubmit}>
      <Field label="Email" htmlFor={`${id}-email`}>
        <TextInput
          id={`${id}-email`}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={!walletValid}
        />
      </Field>

      <Button type="submit" disabled={!walletValid || submitting}>
        Notify
      </Button>

      <StatusMessage status={status} className="mt-3" />
    </form>
  );
}
