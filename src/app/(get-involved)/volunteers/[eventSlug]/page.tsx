import type { Metadata } from "next";
import { AutoRefresh } from "@/components/ui/AutoRefresh";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { CoverPhotoGallery } from "@/features/volunteers/CoverPhotoGallery";
import { EventJsonLd } from "@/features/volunteers/EventJsonLd";
import { EventSpotsProvider } from "@/features/volunteers/EventSpotsContext";
import { EventTime } from "@/features/volunteers/EventTime";
import { OrganizerBadge } from "@/features/volunteers/OrganizerBadge";
import { SignupPanel } from "@/features/volunteers/SignupPanel";
import { getEvent } from "@/lib/volunteer-events/client";
import { formatReward } from "@/lib/volunteer-events/format";
import { eventPath, parseEventId } from "@/lib/volunteer-events/map";
import { siteConfig } from "@/lib/site";

/**
 * Upstream event data is cached briefly (see comms.md [5] D2 for the original
 * shield-the-backend rationale). 10s keeps that shield — the cache is shared —
 * while letting a filled seat or edited detail show up almost immediately.
 */
export const revalidate = 10;

type PageProps = { params: Promise<{ eventSlug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { eventSlug } = await params;
  const event = await getEvent(parseEventId(eventSlug));

  if (!event) return { title: "Event not found" };

  const description =
    event.description.split("\n").find((line) => line.trim())?.slice(0, 200) ??
    `A volunteer event organized by ${event.organizer.name}.`;

  return {
    title: event.title,
    description,
    alternates: { canonical: eventPath(event) },
    openGraph: {
      title: `${event.title} | ${siteConfig.name}`,
      description,
      url: eventPath(event),
      type: "article",
      images: event.coverPhotos[0] ? [{ url: event.coverPhotos[0].url, alt: event.title }] : undefined
    }
  };
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line py-3 first:border-t-0 first:pt-0">
      <dt className="text-sm text-ink-subtle">{label}</dt>
      <dd className="mt-0.5 text-ink">{children}</dd>
    </div>
  );
}

export default async function VolunteerEventPage({ params }: PageProps) {
  const { eventSlug } = await params;
  const eventId = parseEventId(eventSlug);
  const event = await getEvent(eventId);

  if (!event) notFound();

  // Keep one canonical URL per event: redirect stale or bare-id links.
  const canonical = eventPath(event);
  if (`/volunteers/${eventSlug}` !== canonical) redirect(canonical);

  const reward = formatReward(event.rewardAmountSfluv);

  return (
    <article className="pt-2 pb-4">
      <AutoRefresh />
      <EventJsonLd event={event} />
      <Container width="wide">
        {/*
          The whole page is meant to land inside one desktop viewport, so the
          header carries only the chevron and the title. Who is hosting and what
          it pays are facts about the event, so they read better as rows in
          Event details than as badges competing with the title — and moving
          them there buys the photo the height it needs.
        */}
        <header className="mb-3">
          {event.status === "cancelled" ? (
            <p className="mb-2 inline-block rounded-full bg-danger/10 px-3 py-1 text-sm font-medium text-danger">
              Cancelled
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-3">
            <Link
              className="text-2xl leading-none text-ink-muted no-underline hover:text-brand"
              href="/volunteers"
              aria-label="All volunteer events"
            >
              &lsaquo;
            </Link>

            <h1 className="text-headline">{event.title}</h1>
          </div>
        </header>

        {/* Shared so a signup updates the count in both columns at once. */}
        <EventSpotsProvider initial={event.spotsRemaining}>
          {/* Two columns, not three: the photo stacks above the details so the
              signup form gets a column of its own. Nothing carries a fixed
              height any more — at 26rem the form was taller than its box and the
              submit button sat below the fold, reachable only by scrolling
              inside the panel. */}
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_26rem]">
            <div className="flex flex-col gap-4">
              {/* Capped rather than aspect-driven on desktop: a 16/10 photo in a
                  full-width column was tall enough on its own to push the
                  description off-screen. */}
              <CoverPhotoGallery
                photos={event.coverPhotos}
                title={event.title}
                className="aspect-[16/9] lg:aspect-auto lg:h-80"
              />

              <Panel padding="md" tone="muted" className="flex flex-col">
                {/* The organiser and the reward carry this line on their own —
                    a visible "Event details" heading only restated what the
                    panel obviously is, and cost a line the viewport needed. The
                    heading stays for screen readers, which have no such context. */}
                <h2 className="sr-only">Event details</h2>
                <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <OrganizerBadge organizer={event.organizer} size="md" />
                  {reward ? (
                    <span className="rounded-full bg-brand-tint px-3 py-1 text-sm font-medium text-brand-deep">
                      {reward}
                    </span>
                  ) : null}
                </div>

                <dl>
                <DetailRow label="When">
                  <EventTime
                    startAt={event.startAt}
                    endAt={event.endAt}
                    eventTimeZone={event.timeZone}
                  />
                </DetailRow>
                {event.recurrenceSummary ? (
                  <DetailRow label="Repeats">{event.recurrenceSummary}</DetailRow>
                ) : null}
                {event.location ? (
                  <DetailRow label="Location">
                    {event.location.name}
                    {event.location.name && event.location.addressLine ? <br /> : null}
                    {event.location.addressLine ? (
                      <span className="text-ink-muted">{event.location.addressLine}</span>
                    ) : null}
                    {event.location.lat !== null && event.location.lng !== null ? (
                      <>
                        <br />
                        <a
                          className="text-sm font-medium text-brand-deep underline underline-offset-2 hover:text-brand"
                          href={`https://www.google.com/maps/search/?api=1&query=${event.location.lat},${event.location.lng}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Get directions
                        </a>
                      </>
                    ) : null}
                  </DetailRow>
                ) : null}
                </dl>

                {event.description ? (
                  <div className="mt-4 border-t border-line pt-4 text-ink-muted">
                    {event.description
                      .split(/\n{2,}/)
                      .map((paragraph) => paragraph.trim())
                      .filter(Boolean)
                      .map((paragraph) => (
                        <p key={paragraph} className="mt-3 leading-relaxed whitespace-pre-line first:mt-0">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                ) : null}
              </Panel>
            </div>

            {/* Sticky so the form stays in view as a long description scrolls
                past it, rather than being left behind at the top. */}
            <div className="lg:sticky lg:top-6">
              <SignupPanel event={event} />
            </div>
          </div>
        </EventSpotsProvider>
      </Container>
    </article>
  );
}
