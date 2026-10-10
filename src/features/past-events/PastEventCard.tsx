import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import { EventImagePlaceholder } from "@/features/volunteers/EventImagePlaceholder";
import { RemoteImage } from "@/features/volunteers/RemoteImage";
import type { PublicPastEvent } from "@/lib/site-content/types";
import { pastEventPath } from "@/lib/routes";
import { formatPastEventDate } from "./format";

/**
 * A tile in the Past events section. The whole card is one link to the
 * event's photo gallery. Photos range from wide banners to portrait phone
 * shots, so they are cropped to a common ratio, otherwise the grid rows come
 * out ragged.
 */
export function PastEventCard({ event }: { event: PublicPastEvent }) {
  const date = formatPastEventDate(event.date);
  const photos = event.photo_count === 1 ? "1 photo" : `${event.photo_count} photos`;

  return (
    <Link
      href={pastEventPath(event.slug)}
      className="group block h-full rounded-panel text-ink no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <Panel padding="sm" as="article" className="flex h-full flex-col gap-4 transition-shadow group-hover:shadow-md">
        <div>
          <h3 className="font-medium text-ink group-hover:text-brand-deep">{event.title}</h3>
          <p className="text-sm text-ink-subtle">
            {date}
            {event.photo_count > 0 ? <span> · {photos}</span> : null}
          </p>
        </div>

        <div className="mt-auto overflow-hidden rounded-xl">
          {event.cover ? (
            <RemoteImage
              className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              src={event.cover.url}
              alt={event.cover.alt}
              width={event.cover.width}
              height={event.cover.height}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
            />
          ) : (
            <EventImagePlaceholder className="aspect-[16/10] w-full" />
          )}
        </div>
      </Panel>
    </Link>
  );
}
