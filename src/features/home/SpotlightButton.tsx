"use client";

import { ArrowRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import type { SpotlightAction } from "@/content/spotlight";

/** A slide's button. Client-side only so `alsoOpen` can open its second tab on the click. */
export function SpotlightButton({ action }: { action: SpotlightAction }) {
  const { alsoOpen } = action;

  return (
    <Button
      href={action.href}
      external={action.newTab}
      // Small beside the carousel controls on phones, the standard size above.
      size="sm"
      className="whitespace-nowrap sm:min-h-11 sm:px-5 sm:text-[0.95rem]"
      onClick={alsoOpen ? () => window.open(alsoOpen, "_blank", "noopener,noreferrer") : undefined}
    >
      {action.label}
      <ArrowRightIcon className="size-3.5 fill-current" />
    </Button>
  );
}
