import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import type { AudiencePage } from "@/content/get-involved";

/** The shared intro panel used by the donors/community/merchants/improvers pages. */
export function AudienceIntro({ page }: { page: AudiencePage }) {
  return (
    <section className="pt-10 pb-4 sm:pt-16">
      <Container>
        <Panel padding="lg" className="text-center">
          <h1 className="text-headline">{page.title}</h1>
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
