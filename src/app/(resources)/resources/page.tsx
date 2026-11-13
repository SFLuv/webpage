import Image from "next/image";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { Section } from "@/components/ui/Section";
import { resourcesContent } from "@/content/resources";
import { getResources } from "@/lib/site-content/client";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: resourcesContent.title,
  description: "How-to videos, books, podcasts, and technical references behind the SFLuv approach.",
  path: routes.resources
});

const youtubeAllow =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

/** Edited in the admin panel (Website → Resources & how-to); each section shows only when it has something in it. */
export default async function ResourcesPage() {
  const { howTo, books, podcasts, technicalLinks } = await getResources();

  return (
    <>
      <PageHeader title={resourcesContent.title} />

      {howTo.length > 0 && (
        <Section title={resourcesContent.howToTitle}>
          <div className="grid gap-6 lg:grid-cols-2">
            {howTo.map((video) => (
              <Panel key={video.embedUrl} padding="md" className="flex flex-col gap-3">
                <h3 className="font-medium text-ink">{video.title}</h3>
                {video.description && <p className="text-sm whitespace-pre-line text-ink/80">{video.description}</p>}
                <div className="aspect-video overflow-hidden rounded-xl">
                  <iframe
                    className="size-full"
                    src={video.embedUrl}
                    title={video.title}
                    loading="lazy"
                    allow={youtubeAllow}
                    allowFullScreen
                  />
                </div>
                <a
                  className="text-sm text-brand-deep underline underline-offset-2 hover:text-brand"
                  href={video.watchUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch on YouTube
                </a>
              </Panel>
            ))}
          </div>
        </Section>
      )}

      {books.length > 0 && (
        <Section title={resourcesContent.readingTitle} width="wide">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <li key={book.href} className="flex">
                <Card href={book.href} className="items-center gap-4 p-6 text-center">
                  <Image
                    className="h-56 w-auto rounded-lg object-contain"
                    src={book.cover.src}
                    alt={book.cover.alt}
                    width={book.cover.width}
                    height={book.cover.height}
                  />
                  <div>
                    <CardTitle>{book.title}</CardTitle>
                    <CardBody>by {book.author}</CardBody>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {podcasts.length > 0 && (
        <Section title={resourcesContent.podcastsTitle}>
          <div className="grid gap-6 lg:grid-cols-2">
            {podcasts.map((podcast) => (
              <Panel key={podcast.href} padding="md" className="flex flex-col gap-3">
                <h3 className="font-medium text-ink">{podcast.name}</h3>
                <a
                  className="text-sm break-all text-brand-deep underline underline-offset-2 hover:text-brand"
                  href={podcast.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {podcast.href}
                </a>
                <div className="aspect-video overflow-hidden rounded-xl">
                  <iframe
                    className="size-full"
                    src={podcast.embedUrl}
                    title={`${podcast.name} — featured episode`}
                    loading="lazy"
                    allow={youtubeAllow}
                    allowFullScreen
                  />
                </div>
              </Panel>
            ))}
          </div>
        </Section>
      )}

      {technicalLinks.length > 0 && (
        <Section title={resourcesContent.technicalTitle} spacing="lg">
          <Panel padding="md">
            <ul className="flex flex-col gap-2">
              {technicalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    className="text-brand-deep underline underline-offset-2 hover:text-brand"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
        </Section>
      )}
    </>
  );
}
