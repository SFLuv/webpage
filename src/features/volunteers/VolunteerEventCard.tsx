import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import { formatCapacity, formatReward, formatSpots } from "@/lib/volunteer-events/format";
import { eventPath } from "@/lib/volunteer-events/map";
import type { VolunteerEvent } from "@/lib/volunteer-events/types";
import { EventImagePlaceholder } from "./EventImagePlaceholder";
import { EventTime } from "./EventTime";
import { OrganizerBadge } from "./OrganizerBadge";
import { RemoteImage } from "./RemoteImage";

function Pill({
  children,
  tone = "neutral"
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "danger";
}) {
  const tones = {
    neutral: "bg-surface-muted text-ink-muted",
    brand: "bg-brand-tint text-brand-deep",
    danger: "bg-danger/10 text-danger"
  } as const;

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>
  );
}

/**
 * Event summary card.
 *
 * Every card is the same height regardless of title length or whether the event
 * has a photo: the media box is a fixed ratio, the title is clamped to two
 * lines, and the meta row is pushed to the bottom. A ragged grid is what you
 * get otherwise.
 */
export function VolunteerEventCard({
  event,
  showPastBadge = false
}: {
  event: VolunteerEvent;
  /**
   * Marks the card as a past event. Opt-in rather than derived from `status`,
   * because on the /volunteers "Past" filter every card is past and the badge
   * would be noise — it earns its place only in a mixed list.
   */
  showPastBadge?: boolean;
}) {
  // Only the first photo appears on a card; the rest live on the detail page.
  const cover = event.coverPhotos[0];
  const reward = formatReward(event.rewardAmountSfluv);
  const spots = formatSpots(event) ?? formatCapacity(event);
  const cancelled = event.status === "cancelled";

  return (
    /*
     * Whole-card click via a stretched link rather than wrapping everything in
     * one anchor. The `<a>` stays on the title, so its accessible name is the
     * event name rather than every pill, date and badge read out in sequence —
     * while `after:absolute after:inset-0` makes the whole card the hit area,
     * and middle-click / open-in-new-tab keep working.
     */
    <Panel
      padding="none"
      as="article"
      className="group relative flex h-full w-full flex-col overflow-hidden"
    >
      {cover ? (
        <RemoteImage
          src={cover.url}
          alt=""
          width={cover.width}
          height={cover.height}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="aspect-[16/9] w-full shrink-0 object-cover"
        />
      ) : (
        <EventImagePlaceholder className="aspect-[16/9] w-full shrink-0" />
      )}

      <div className="flex grow flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {showPastBadge ? <Pill>Past event</Pill> : null}
          {cancelled ? <Pill tone="danger">Cancelled</Pill> : null}
          {event.recurrenceSummary ? <Pill>{event.recurrenceSummary}</Pill> : null}
          {reward ? <Pill tone="brand">{reward}</Pill> : null}
        </div>

        <h3 className={`text-lg font-medium text-ink ${cancelled ? "line-through" : ""}`}>
          <Link
            href={eventPath(event)}
            className="line-clamp-2 no-underline transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-brand-deep"
          >
            {event.title}
          </Link>
        </h3>

        <p className="text-sm text-ink-muted">
          <EventTime
            startAt={event.startAt}
            endAt={event.endAt}
            eventTimeZone={event.timeZone}
            variant="short"
          />
        </p>

        {event.location?.name ? (
          <p className="line-clamp-1 text-sm text-ink-subtle">{event.location.name}</p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <OrganizerBadge organizer={event.organizer} />
          {spots ? <span className="shrink-0 text-sm text-ink-subtle">{spots}</span> : null}
        </div>
      </div>
    </Panel>
  );
}
