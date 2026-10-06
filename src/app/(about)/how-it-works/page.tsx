import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { howItWorksContent } from "@/content/about";
import { AmplificationLoop } from "@/features/how-it-works/AmplificationLoop";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: howItWorksContent.title,
  description: howItWorksContent.metaDescription,
  path: routes.howItWorks,
  image: howItWorksContent.image
});

export default function HowItWorksPage() {
  const { title, eyebrow, intro, steps, amplification, numbers } = howItWorksContent;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <header className="text-center">
          <p className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">{eyebrow}</p>
          <h1 className="mt-3 text-headline">{title}</h1>
          <p className="mx-auto mt-5 max-w-3xl text-ink-muted">{intro}</p>
        </header>

        <Panel padding="md" className="mt-10">
          <AmplificationLoop steps={steps} />
        </Panel>

        <ol className="mt-8 grid gap-5 sm:grid-cols-2">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Panel padding="md" className="flex h-full flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand-tint font-medium text-brand-deep">
                    {index + 1}
                  </span>
                  {step.impact ? (
                    <span className="rounded-full bg-brand-tint px-2.5 py-1 text-xs font-medium text-brand-deep">
                      {step.impact}
                    </span>
                  ) : null}
                </div>
                <h2 className="text-title font-medium">{step.title}</h2>
                <p className="text-ink-muted">{step.body}</p>
              </Panel>
            </li>
          ))}
        </ol>

        <Panel tone="brand" padding="lg" className="mt-10">
          <h2 className="text-title font-medium text-white">{amplification.title}</h2>
          {amplification.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-white/90">
              {paragraph}
            </p>
          ))}
        </Panel>

        <div className="mt-10">
          <h2 className="text-center text-title font-medium">{numbers.title}</h2>
          <dl className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {numbers.items.map((item) => (
              <Panel key={item.label} padding="sm" className="text-center">
                <dt className="sr-only">{item.label}</dt>
                <dd className="text-headline font-semibold text-brand-deep">{item.value}</dd>
                <dd className="mt-1 text-sm text-ink-muted">{item.label}</dd>
              </Panel>
            ))}
          </dl>
          <div className="mt-6 text-center">
            <Button href={numbers.cta.href} variant="secondary">
              {numbers.cta.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
