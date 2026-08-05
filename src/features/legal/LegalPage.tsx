import { RichDocument } from "@/components/content/RichDocument";
import type { LegalDocument } from "@/components/content/document";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { Prose } from "@/components/ui/Prose";

/** Shared shell for the policy pages. */
export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <Panel padding="lg">
          <h1 className="text-headline">{document.title}</h1>
          {document.updated ? (
            <p className="mt-2 text-sm text-ink-subtle">Last updated: {document.updated}</p>
          ) : null}

          <Prose className="mt-8">
            <RichDocument blocks={document.blocks} />
          </Prose>
        </Panel>
      </Container>
    </section>
  );
}
