import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

const spacings = {
  sm: "py-8",
  md: "py-12 sm:py-16",
  lg: "py-16 sm:py-24"
} as const;

type SectionProps = {
  children: ReactNode;
  /** Rendered as a centered h2 above the section body. */
  title?: string;
  /** Supporting line under the title. */
  lead?: string;
  spacing?: keyof typeof spacings;
  width?: "narrow" | "content" | "wide";
  id?: string;
  className?: string;
};

/** A titled band of page content at consistent vertical rhythm. */
export function Section({
  children,
  title,
  lead,
  spacing = "md",
  width = "content",
  id,
  className
}: SectionProps) {
  return (
    <section id={id} className={cn(spacings[spacing], className)}>
      <Container width={width}>
        {title ? (
          <header className="mb-8 text-center">
            <h2 className="text-headline">{title}</h2>
            {lead ? <p className="mt-3 text-ink-muted">{lead}</p> : null}
          </header>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
