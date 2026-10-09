"use client";

import Image from "next/image";
import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
import type { ArchivedEvent } from "@/content/volunteers";
import { EventGalleryModal } from "./EventGalleryModal";

/**
 * One archived event.
 *
 * The card shows the title picture only, cropped to a common ratio so the grid
 * rows stay level whatever shape the photo is. It used to tile every photo in a
 * two-column grid, which made an event with several pictures look like a
 * different kind of card from one with a single picture; now the extra photos
 * live in the gallery instead, where they can be seen full size and saved.
 */
export function ArchiveEventCard({ event }: { event: ArchivedEvent }) {
  const [galleryOpen, setGalleryOpen] = useState(false);

  const cover = event.images[0];
  const total = event.images.length;

  return (
    <>
      <Panel padding="sm" as="article" className="flex h-full flex-col gap-4">
        <div>
          <h3 className="font-medium text-ink">{event.title}</h3>
          {event.date ? <p className="text-sm text-ink-subtle">{event.date}</p> : null}
        </div>

        <div className="mt-auto">
          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            aria-label={
              total > 1
                ? `${event.title} — open gallery, ${total} photos`
                : `${event.title} — open photo`
            }
            className="group relative block w-full overflow-hidden rounded-xl"
          >
            <Image
              className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              src={cover.src}
              alt={cover.alt}
              width={cover.width}
              height={cover.height}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
            />

            {/* A photo count only where there is more than one to find. */}
            {total > 1 ? (
              <span className="absolute right-2 bottom-2 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-medium text-white">
                {total} photos
              </span>
            ) : null}
          </button>
        </div>
      </Panel>

      {galleryOpen ? (
        <EventGalleryModal
          title={event.title}
          date={event.date}
          href={event.href}
          images={event.images}
          onClose={() => setGalleryOpen(false)}
        />
      ) : null}
    </>
  );
}
