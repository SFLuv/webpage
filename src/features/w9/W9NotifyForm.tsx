"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { externalLinks, contactEmails } from "@/lib/site";

const WALLET_PATTERN = /^0x[a-fA-F0-9]{40}$/;

/**
 * Points someone at the place a W-9 is actually completed.
 *
 * This used to be a form. It POSTed a wallet address and an email to an
 * unauthenticated `/w9/submit` endpoint, which then emailed an admin, who
 * followed up by hand with a form. That endpoint has been removed — it let
 * anyone file a submission against any wallet with any email, and that email
 * received the notice.
 *
 * The form is now completed by the person themselves, signed in, through the
 * tax vendor's hosted page. So there is nothing to collect here and nothing to
 * submit: the useful thing this page can do is send them to the app.
 *
 * The route is kept because links to it have already gone out by email, some
 * carrying a `?wallet=` parameter. Those links must still land somewhere that
 * explains what to do rather than a 404.
 */
export function W9NotifyForm() {
  const searchParams = useSearchParams();
  const wallet = (searchParams.get("wallet") ?? "").trim();
  const knownWallet = WALLET_PATTERN.test(wallet);

  return (
    <div className="mt-6 max-w-lg">
      <div className="flex flex-wrap gap-3">
        <Button href={externalLinks.webWallet}>Open SFLuv in your browser</Button>
      </div>

      <p className="mt-4 text-sm text-ink-muted">
        Or open the SFLuv app and go to your wallet — if a form is needed, it is waiting for you there.
      </p>

      <div className="mt-3 flex flex-wrap gap-3">
        <Button href={externalLinks.appStore.ios} variant="secondary" size="sm">
          iPhone
        </Button>
        <Button href={externalLinks.appStore.android} variant="secondary" size="sm">
          Android
        </Button>
      </div>

      {knownWallet ? (
        <p className="mt-5 text-sm text-ink-muted">
          Sign in with the account holding {wallet.slice(0, 6)}…{wallet.slice(-4)}. The form covers your whole
          account, not one wallet, so you only ever fill it in once a year.
        </p>
      ) : null}

      <p className="mt-5 text-sm text-ink-muted">
        Stuck, or not sure whether you need one? Email{" "}
        <a href={`mailto:${contactEmails.support}`}>{contactEmails.support}</a>.
      </p>
    </div>
  );
}
