import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { homeContent, homeSplits } from "@/content/home";
import { getPartners } from "@/lib/partners";
import { emptyFilters, listEvents } from "@/lib/volunteer-events/client";
import { EventCarousel, type CarouselEvent } from "./EventCarousel";
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

/** Total cards in the homepage carousel, including the past-event slot. */
const SLOTS = 5;

/**
 * Upcoming volunteer events on the homepage.
 *
 * Renders nothing when there are no upcoming events or the API is unreachable —
 * an empty carousel on the front page is worse than no section at all.
 */
export async function UpcomingEvents() {
  const { upcomingEvents } = homeContent;

  const [upcoming, past] = await Promise.all([
    listEvents({ ...emptyFilters, page: 1 }),
    listEvents({ ...emptyFilters, when: "past", page: 1 })
  ]);

  /*
   * Cancelled events stay on /volunteers, where someone who signed up needs to
   * find out. This section exists to recruit, so an event nobody can attend is
   * just noise.
   */
  const attendable = upcoming.events.filter((event) => event.status !== "cancelled");
  const recentPast = past.events[0];

  /*
   * Five slots, one of them reserved for a past event — a look at what actually
   * happened is the strongest argument for turning up. If there is no past
   * event to show, upcoming events take the whole strip rather than leaving a
   * gap.
   */
  const events: CarouselEvent[] = attendable
    .slice(0, recentPast ? SLOTS - 1 : SLOTS)
    .map((event) => ({ event }));

  if (recentPast) events.push({ event: recentPast, past: true });

  if (events.length === 0) return null;

  return (
    <section className="py-14">
      <Container width="wide">
        <div className="mb-8 text-center">
          <h2 className="text-headline font-semibold">{upcomingEvents.title}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-muted">{upcomingEvents.lead}</p>
        </div>
      </Container>

      {/*
        Outside the container: the track runs the full width so the previous and
        next cards can peek in from the screen edges.
      */}
      <EventCarousel events={events} />

      <div className="mt-8 flex justify-center">
        <Button href={upcomingEvents.cta.href} size="lg">
          {upcomingEvents.cta.label}
        </Button>
      </div>
    </section>
  );
}
