import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ChevronDownIcon } from "@/components/icons";

type DisclosureProps = {
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

/**
 * Native details/summary expander.
 *
 * Deliberately not a client component: it works without JavaScript, which is
 * how the original page behaved.
 */
export function Disclosure({ summary, children, defaultOpen = false, className }: DisclosureProps) {
  return (
    <details
      open={defaultOpen}
      className={cn("group rounded-lg border border-line bg-surface", className)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-medium text-ink marker:hidden [&::-webkit-details-marker]:hidden">
        {summary}
        <ChevronDownIcon className="size-4 shrink-0 fill-current transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-line px-4 py-3 text-ink-muted">{children}</div>
    </details>
  );
}
