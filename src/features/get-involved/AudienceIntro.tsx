import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import type { AudiencePage } from "@/content/get-involved";

/** The shared intro panel used by the donors/community/merchants/improvers pages. */
export function AudienceIntro({ page, children }: { page: AudiencePage; children?: ReactNode }) {
  return (
    <section className="pt-4 pb-4 sm:pt-8">
      <Container>
        <Panel padding="lg" className="text-center">
          <h1 className="text-headline">{page.title}</h1>

          {/*
            Sits between the heading and the copy so a page can lead with
            something concrete — the merchants page puts its map here — rather
            than making people read the pitch before they see the thing.
          */}
          {children ? <div className="mt-6 text-left">{children}</div> : null}

          <p className="mx-auto mt-5 max-w-2xl text-ink-muted">{page.body}</p>
          <div className="mt-8">
            <Button href={page.cta.href} size="lg">
              {page.cta.label}
            </Button>
          </div>
        </Panel>
      </Container>
    </section>
  );
}
