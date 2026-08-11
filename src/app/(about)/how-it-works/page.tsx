import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { howItWorksContent } from "@/content/about";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: howItWorksContent.title,
  description: howItWorksContent.metaDescription,
  path: routes.howItWorks,
  image: howItWorksContent.graphic.src
});

export default function HowItWorksPage() {
  const { title, graphic, steps, outcome } = howItWorksContent;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <h1 className="text-center text-headline">{title}</h1>

        {/* Rounded to match the panels below it — a square-cornered graphic in
            among the site's rounded cards reads as an unstyled asset. */}
        <Image
          className="mx-auto mt-10 h-auto w-full max-w-2xl rounded-panel"
          src={graphic.src}
          alt={graphic.alt}
          width={graphic.width}
          height={graphic.height}
          sizes="(max-width: 768px) 100vw, 672px"
          priority
        />

        <ol className="mt-12 grid gap-5 sm:grid-cols-2">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Panel padding="md" className="flex h-full flex-col gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand-tint font-medium text-brand-deep">
                  {index + 1}
                </span>
                <h2 className="text-title font-medium">{step.title}</h2>
                <p className="text-ink-muted">{step.body}</p>
              </Panel>
            </li>
          ))}
        </ol>

        <Panel tone="brand" padding="lg" className="mt-10">
          <h2 className="text-title font-medium text-white">{outcome.title}</h2>
          <p className="mt-3 text-white/90">{outcome.body}</p>
        </Panel>
      </Container>
    </section>
  );
}
