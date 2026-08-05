import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ProseProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Typographic defaults for long-form copy.
 *
 * Replaces the WordPress block stylesheets: everything rendered inside is plain
 * semantic HTML, styled here rather than by classes baked into the content.
 */
export function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={cn(
        "text-ink-muted",
        "[&_p]:my-4 [&_p]:leading-relaxed",
        "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-title [&_h2]:font-medium",
        "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-medium",
        "[&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-base [&_h4]:font-medium",
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:my-1.5 [&_li]:leading-relaxed",
        "[&_strong]:font-semibold [&_strong]:text-ink",
        "[&_a]:font-medium [&_a]:text-brand-deep [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand",
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
    >
      {children}
    </div>
  );
}
