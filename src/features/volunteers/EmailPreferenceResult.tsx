import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { routes } from "@/lib/routes";

type EmailPreferenceResultProps = {
  title: string;
  body: string;
  tone?: "success" | "error";
  children?: React.ReactNode;
};

/** Branded landing panel for volunteer email-list confirm / unsubscribe links. */
export function EmailPreferenceResult({
  title,
  body,
  tone = "success",
  children
}: EmailPreferenceResultProps) {
  return (
    <section className="py-16 sm:py-24">
      <Container width="narrow">
        <Panel padding="lg" className="text-center">
          <h1 className="text-title font-medium">{title}</h1>
          <p className={`mt-3 ${tone === "error" ? "text-danger" : "text-ink-muted"}`}>{body}</p>

          {children ? <div className="mt-7">{children}</div> : null}

          <div className="mt-7">
            <Button variant="secondary" href={routes.volunteers}>
              Browse volunteer events
            </Button>
          </div>
        </Panel>
      </Container>
    </section>
  );
}
