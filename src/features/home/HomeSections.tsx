import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { cn } from "@/lib/cn";
import { homeContent, homeSplits } from "@/content/home";
import { getPartners } from "@/lib/partners";
import { emptyFilters, listEvents } from "@/lib/volunteer-events/client";
import { EventCarousel } from "./EventCarousel";
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
      {homeSplits.map((split) => (
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

/**
 * Upcoming volunteer events on the homepage.
 *
 * Renders nothing when there are no upcoming events or the API is unreachable —
 * an empty carousel on the front page is worse than no section at all.
 */
export async function UpcomingEvents() {
  const { upcomingEvents } = homeContent;
  const result = await listEvents({ ...emptyFilters, page: 1 });

  /*
   * Cancelled events are deliberately kept on /volunteers, where someone who
   * signed up needs to find out. Here the section exists to recruit, so an
   * event nobody can attend is just noise.
   */
  const events = result.events.filter((event) => event.status !== "cancelled").slice(0, 9);

  if (events.length === 0) return null;

  return (
    <section className="py-14">
      <Container width="wide">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-headline font-semibold">{upcomingEvents.title}</h2>
            <p className="mt-3 max-w-2xl text-ink-muted">{upcomingEvents.lead}</p>
          </div>

          <Button href={upcomingEvents.cta.href} variant="secondary">
            {upcomingEvents.cta.label}
          </Button>
        </div>

        <EventCarousel events={events} />
      </Container>
    </section>
  );
}
