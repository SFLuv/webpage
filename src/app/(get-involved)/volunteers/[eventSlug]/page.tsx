import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { CoverPhotoGallery } from "@/features/volunteers/CoverPhotoGallery";
import { EventJsonLd } from "@/features/volunteers/EventJsonLd";
import { EventTime } from "@/features/volunteers/EventTime";
import { OrganizerBadge } from "@/features/volunteers/OrganizerBadge";
import { SignupPanel } from "@/features/volunteers/SignupPanel";
import { getEvent } from "@/lib/volunteer-events/client";
import { formatCapacity, formatReward, formatSpots } from "@/lib/volunteer-events/format";
import { eventPath, parseEventId } from "@/lib/volunteer-events/map";
import { siteConfig } from "@/lib/site";

/** Upstream event data is cached for 60s; see comms.md [5] D2. */
export const revalidate = 60;

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
  // Availability where we manage signups, otherwise the honest capacity figure.
  const spots = formatSpots(event) ?? formatCapacity(event);

  return (
    <article className="py-8 sm:py-12">
      <EventJsonLd event={event} />
      <Container>
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <Link className="text-ink-muted no-underline hover:text-brand" href="/volunteers">
            ← All volunteer events
          </Link>
        </nav>

        <CoverPhotoGallery photos={event.coverPhotos} title={event.title} />

        <header className={event.coverPhotos.length ? "mt-8" : undefined}>
          {event.status === "cancelled" ? (
            <p className="mb-3 inline-block rounded-full bg-danger/10 px-3 py-1 text-sm font-medium text-danger">
              Cancelled
            </p>
          ) : null}

          <h1 className="text-headline">{event.title}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <OrganizerBadge organizer={event.organizer} size="md" />
            {reward ? (
              <span className="rounded-full bg-brand-tint px-3 py-1 text-sm font-medium text-brand-deep">
                {reward} reward
              </span>
            ) : null}
          </div>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            {event.description ? (
              <div className="text-ink-muted">
                {event.description
                  .split(/\n{2,}/)
                  .map((paragraph) => paragraph.trim())
                  .filter(Boolean)
                  .map((paragraph) => (
                    <p key={paragraph} className="mt-4 leading-relaxed whitespace-pre-line first:mt-0">
                      {paragraph}
                    </p>
                  ))}
              </div>
            ) : null}

            <Panel padding="md" tone="muted" className="mt-8">
              <h2 className="mb-3 font-medium text-ink">Event details</h2>
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
                {spots ? <DetailRow label="Capacity">{spots}</DetailRow> : null}
                {reward ? <DetailRow label="Volunteer reward">{reward}</DetailRow> : null}
              </dl>
            </Panel>
          </div>

          <div className="lg:sticky lg:top-6">
            <SignupPanel event={event} />
          </div>
        </div>
      </Container>
    </article>
  );
}
