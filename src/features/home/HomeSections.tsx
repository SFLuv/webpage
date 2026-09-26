import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { homeContent, homeSplits } from "@/content/home";
import { getPartners } from "@/lib/partners";
import { emptyFilters, listEvents } from "@/lib/volunteer-events/client";
import { EventCarousel, type CarouselEvent } from "./EventCarousel";
import { PartnerCarousel } from "./PartnerCarousel";
import { Spotlight } from "./Spotlight";
import { SpotlightFitScript } from "./SpotlightCarousel";

export async function Hero() {
  const { hero, partners } = homeContent;
  const partnerLogos = await getPartners();

  // The stacked layout's flexible gaps between title, card and partners.
  const gap = "min-h-[clamp(1rem,2.5svh,1.5rem)] sm:min-h-[clamp(1.25rem,3.5svh,2.5rem)] lg:hidden";

  return (
    /*
     * Exactly one screen below the header, so the title, the spotlight card and
     * the partner strip all land in the first view and the next section waits
     * below the fold.
     *
     * Side by side (lg), they sit together as one centred group, so on a tall
     * screen the spare room goes above and below it rather than opening a gap
     * between the card and the partners. Stacked, the spare room goes mostly
     * between them instead — a share above the title for every four between
     * each of them — so a tall phone neither crowds them together nor leaves
     * wide margins at the top and bottom.
     *
     * It is also the `hero` container the short/compact/roomy variants query.
     * The floors are for screens too short to fit it at all, like a phone on
     * its side: there it stops shrinking and the page simply scrolls.
     */
    <section
      className={cn(
        "flex flex-col justify-center-safe [container:hero/size]",
        "pt-[clamp(0.25rem,1svh,0.75rem)] pb-[clamp(0.75rem,2svh,1.5rem)]",
        "h-[max(calc(100svh-var(--header-height)),26rem)] sm:h-[max(calc(100svh-var(--header-height)),38rem)]",
        "lg:h-[max(calc(100svh-var(--header-height)),31rem)]"
      )}
    >
      <Container width="wide" className="flex min-h-0 flex-col max-lg:grow">
        {/*
          A column below lg, with the card taking whatever height is left and
          scaling itself to fit it; a two-column grid from lg. On tablets the
          column is the card's width and centred, so title and card share a
          left edge in the middle of the screen.
        */}
        <div
          className={cn(
            "flex min-h-0 grow flex-col sm:mx-auto sm:w-full sm:max-w-lg",
            "lg:grid lg:max-w-none lg:grid-cols-[minmax(0,1fr)_clamp(26rem,32vw+6rem,40rem)] lg:grid-rows-[minmax(0,1fr)]",
            "lg:items-center lg:gap-12 xl:gap-16"
          )}
        >
          <div aria-hidden className="grow lg:hidden" />

          {/*
            One word to a line: a phrase to a line would need "Empowering
            Communities", about 13.7em wide in Sora, to fit a phone, which
            leaves the title tiny. Each size is also capped by the viewport's
            height so the card below still has room, and the shortest phones
            fall back to a phrase a line after all. From lg the title sits
            beside the card, where the longest word, about 7em, sets the limit.
          */}
          <h1
            className={cn(
              "shrink-0 text-[clamp(1.75rem,min(10vw,4.7svh),2.6rem)] leading-[1.1] font-semibold",
              "sm:text-[clamp(2.5rem,min(8.5vw,6.5svh),4.5rem)]",
              "compact:text-[min(2.25rem,calc((100vw-2.5rem)/14))] compact:leading-[1.15]",
              "lg:text-[clamp(3rem,min(3.9vw+1.25rem,11svh),5.4rem)]"
            )}
          >
            {hero.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <div aria-hidden className={cn(gap, "grow-[4]")} />

          <Spotlight className="max-h-full w-full" />

          <div aria-hidden className={cn(gap, "grow-[4]")} />
        </div>
      </Container>

      <div className="shrink-0 lg:mt-[clamp(1.25rem,5svh,3rem)]">
        <Container width="wide">
          <p className="text-center text-sm font-medium compact:sr-only sm:text-base">{partners.title}</p>
        </Container>

        {/* Full-bleed: the strip should run edge to edge, not inside the gutters. */}
        <div className="mt-1 sm:mt-3">
          <PartnerCarousel partners={partnerLogos} label={partners.title} />
        </div>
      </div>

      {/* Last, so the whole hero is laid out by the time it measures. */}
      <SpotlightFitScript />
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
