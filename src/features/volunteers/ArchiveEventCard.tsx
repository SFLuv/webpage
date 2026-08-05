import Image from "next/image";
import { Panel } from "@/components/ui/Panel";
import type { ArchivedEvent } from "@/content/volunteers";
import type { ImageAsset } from "@/content/types";

/**
 * Event photos range from wide banners to portrait phone shots, so they are
 * cropped to a common ratio — otherwise the grid rows come out ragged.
 */
function EventImage({ image }: { image: ImageAsset }) {
  return (
    <Image
      className="aspect-[16/10] w-full rounded-xl object-cover"
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
    />
  );
}

export function ArchiveEventCard({ event }: { event: ArchivedEvent }) {
  const media =
    event.images.length > 1 ? (
      <div className="grid grid-cols-2 gap-2">
        {event.images.map((image) => (
          <EventImage key={image.src} image={image} />
        ))}
      </div>
    ) : (
      <EventImage image={event.images[0]} />
    );

  return (
    <Panel padding="sm" as="article" className="flex h-full flex-col gap-4">
      <div>
        <h3 className="font-medium text-ink">{event.title}</h3>
        {event.date ? <p className="text-sm text-ink-subtle">{event.date}</p> : null}
      </div>

      <div className="mt-auto">
        {event.href ? (
          <a
            className="block rounded-xl transition-opacity hover:opacity-90"
            href={event.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${event.title} — event details`}
          >
            {media}
          </a>
        ) : (
          media
        )}
      </div>
    </Panel>
  );
}
