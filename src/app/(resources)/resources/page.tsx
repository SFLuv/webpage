import Image from "next/image";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { Section } from "@/components/ui/Section";
import { books, podcasts, resourcesContent, technicalLinks } from "@/content/resources";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: resourcesContent.title,
  description: "Books, podcasts, and technical references behind the SFLuv approach.",
  path: routes.resources
});

export default function ResourcesPage() {
  return (
    <>
      <PageHeader title={resourcesContent.title} />

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
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </Panel>
          ))}
        </div>
      </Section>

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
    </>
  );
}
