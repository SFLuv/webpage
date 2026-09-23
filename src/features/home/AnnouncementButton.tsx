"use client";

import { ArrowRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import type { AnnouncementAction } from "@/content/announcement";

/** A banner button. Client-side only so `alsoOpen` can open its second tab on the click. */
export function AnnouncementButton({ action, primary }: { action: AnnouncementAction; primary: boolean }) {
  const { alsoOpen } = action;

  return (
    <Button
      href={action.href}
      external={action.newTab}
      variant={primary ? "primary" : "secondary"}
      size="lg"
      onClick={alsoOpen ? () => window.open(alsoOpen, "_blank", "noopener,noreferrer") : undefined}
    >
      {action.label}
      {primary ? <ArrowRightIcon className="size-4 fill-current" /> : null}
    </Button>
  );
}
