import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { PhotoGallery } from "@/features/past-events/PhotoGallery";
import { formatPastEventDate } from "@/features/past-events/format";
import { getPastEvent } from "@/lib/site-content/client";
import { siteConfig } from "@/lib/site";
import { pastEventPath, pastEventsAnchor, routes } from "@/lib/routes";

/** Photo uploads made in the app appear within this many seconds. */
export const revalidate = 30;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lookup = await getPastEvent(slug);
  if (lookup.state !== "found") return { title: "Past event" };

  const { event } = lookup;
  const date = formatPastEventDate(event.date);
  const description = event.description || `Photos from ${event.title}${date ? `, ${date}` : ""}, an SFLuv community event.`;
  const path = pastEventPath(event.slug);
  return {
    title: event.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${event.title} | ${siteConfig.name}`,
      description,
      url: path,
      type: "website",
      images: event.cover ? [{ url: event.cover.url, alt: event.cover.alt }] : undefined
    }
  };
}

/** A past event's photo gallery, opened from its tile in Past events on the volunteers page. */
export default async function PastEventPage({ params }: PageProps) {
  const { slug } = await params;
  const lookup = await getPastEvent(slug);
  if (lookup.state === "missing") notFound();

  return (
    <article className="py-8 sm:py-12">
      <Container width="wide">
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <Link className="text-ink-muted no-underline hover:text-brand" href={`${routes.volunteers}#${pastEventsAnchor}`}>
            ← All past events
          </Link>
        </nav>

        {lookup.state === "unavailable" ? (
          <Panel padding="lg" className="text-center">
            <h1 className="text-title font-medium">This gallery is temporarily unavailable</h1>
            <p className="mt-2 text-ink-muted">Please try again in a few minutes.</p>
          </Panel>
        ) : (
          <>
            <header className="mb-8 max-w-3xl">
              <h1 className="text-headline font-semibold text-ink">{lookup.event.title}</h1>
              {lookup.event.date ? <p className="mt-2 text-ink-subtle">{formatPastEventDate(lookup.event.date)}</p> : null}
              {lookup.event.description ? (
                <p className="mt-4 whitespace-pre-line text-ink-muted">{lookup.event.description}</p>
              ) : null}
            </header>

            {lookup.event.photos && lookup.event.photos.length > 0 ? (
              <PhotoGallery photos={lookup.event.photos} title={lookup.event.title} />
            ) : (
              <Panel padding="lg" className="text-center">
                <p className="text-ink-muted">Photos from this event are on their way.</p>
              </Panel>
            )}
          </>
        )}
      </Container>
    </article>
  );
}
