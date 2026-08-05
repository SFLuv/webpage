import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { W9NotifyForm } from "@/features/w9/W9NotifyForm";
import { w9Content } from "@/content/forms";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "Submit W9",
  description: w9Content.paragraphs[0],
  path: routes.submitW9
});

export default function SubmitW9Page() {
  return (
    <section className="py-10 sm:py-16">
      <Container width="narrow">
        <Panel padding="lg">
          <h1 className="text-title font-medium">{w9Content.title}</h1>
          {w9Content.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-ink-muted">
              {paragraph}
            </p>
          ))}

          {/* The wallet address comes from the query string, so the form reads search params. */}
          <Suspense fallback={null}>
            <W9NotifyForm />
          </Suspense>
        </Panel>
      </Container>
    </section>
  );
}
