import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { treeStewardContent } from "@/content/tree-steward";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: treeStewardContent.title,
  description: treeStewardContent.metaDescription,
  path: routes.treeStewardProgram,
  image: treeStewardContent.banner.src
});

export default function TreeStewardProgramPage() {
  const { banner, signupHref, intro, dutiesTitle, duties, outro, ctaLabel } = treeStewardContent;

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <a href={signupHref} target="_blank" rel="noreferrer" className="block">
          <Image
            className="h-auto w-full rounded-panel"
            src={banner.src}
            alt={banner.alt}
            width={banner.width}
            height={banner.height}
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </a>

        <Panel padding="lg" className="mt-8">
          <h1 className="mb-5 text-headline">{treeStewardContent.title}</h1>

          {intro.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-ink-muted">
              {paragraph}
            </p>
          ))}

          <h2 className="mt-8 text-title font-medium">{dutiesTitle}</h2>
          <ul className="mt-3 list-disc pl-6 text-ink-muted">
            {duties.map((duty) => (
              <li key={duty} className="my-1.5">
                {duty}
              </li>
            ))}
          </ul>

          {outro.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-ink-muted">
              {paragraph}
            </p>
          ))}

          <div className="mt-8">
            <Button href={signupHref} size="lg">
              {ctaLabel}
            </Button>
          </div>
        </Panel>
      </Container>
    </section>
  );
}
