import type { ReactNode } from "react";
import { Container } from "./Container";

type PageHeaderProps = {
  title: string;
  lead?: string;
  /** Buttons or links rendered under the lead. */
  actions?: ReactNode;
  align?: "left" | "center";
};

/** The h1 block every interior page opens with. */
export function PageHeader({ title, lead, actions, align = "center" }: PageHeaderProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <header className="pt-4 pb-2 sm:pt-8">
      <Container>
        <div className={`flex flex-col ${alignment}`}>
          <h1 className="text-headline">{title}</h1>
          {lead ? <p className="mt-4 max-w-2xl text-ink-muted">{lead}</p> : null}
          {actions ? <div className="mt-7 flex flex-wrap justify-center gap-3">{actions}</div> : null}
        </div>
      </Container>
    </header>
  );
}
