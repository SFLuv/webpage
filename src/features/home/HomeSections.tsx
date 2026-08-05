import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { cn } from "@/lib/cn";
import { homeContent } from "@/content/home";
import { getPartners } from "@/lib/partners";
import { PartnerCarousel } from "./PartnerCarousel";

export async function Hero() {
  const { hero, partners } = homeContent;
  const partnerLogos = await getPartners();

  return (
    <section className="pt-[8vh] pb-12">
      <Container width="wide">
        <h1 className="max-w-4xl text-display font-semibold">{hero.title}</h1>

        <div className="mt-8">
          <Button href={hero.cta.href} size="lg">
            {hero.cta.label}
          </Button>
        </div>

        <div className="mt-16">
          <p className="text-center font-medium">{partners.title}</p>
        </div>
      </Container>

      {/* Full-bleed: the strip should run edge to edge, not inside the gutters. */}
      <div className="mt-6">
        <PartnerCarousel partners={partnerLogos} label={partners.title} />
      </div>
    </section>
  );
}

export function ValueCards() {
  return (
    <section className="py-14">
      <Container width="wide">
        <h2 className="text-center text-headline font-semibold">{homeContent.whyTitle}</h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {homeContent.valueCards.map((card) => (
            <Panel key={card.title} tone="muted" padding="lg" as="article" className="flex flex-col gap-5">
              <Image
                className="h-auto w-44 grayscale"
                src={card.image.src}
                alt={card.image.alt}
                width={card.image.width}
                height={card.image.height}
              />
              <h3 className="text-headline font-light">{card.title}</h3>
              <p className="text-ink-muted">{card.body}</p>
            </Panel>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function SplitSections() {
  return (
    <>
      {homeContent.splits.map((split) => (
        <section key={split.title} className="py-14">
          <Container width="wide">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <Image
                className={cn(
                  "h-auto w-full rounded-panel object-cover",
                  split.imageSide === "right" && "lg:order-last"
                )}
                src={split.image.src}
                alt={split.image.alt}
                width={split.image.width}
                height={split.image.height}
                sizes="(max-width: 1024px) 100vw, 700px"
              />

              <div>
                <h2 className="text-headline font-semibold">{split.title}</h2>
                <p className="mt-5 text-ink-muted">{split.body}</p>
                <div className="mt-7">
                  <Button href={split.cta.href}>{split.cta.label}</Button>
                </div>
              </div>
            </div>
          </Container>
        </section>
      ))}
    </>
  );
}
