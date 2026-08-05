import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import { formatCapacity, formatReward, formatSpots } from "@/lib/volunteer-events/format";
import { eventPath } from "@/lib/volunteer-events/map";
import type { VolunteerEvent } from "@/lib/volunteer-events/types";
import { EventTime } from "./EventTime";
import { OrganizerBadge } from "./OrganizerBadge";
import { RemoteImage } from "./RemoteImage";

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "brand" | "danger" }) {
  const tones = {
    neutral: "bg-surface-muted text-ink-muted",
    brand: "bg-brand-tint text-brand-deep",
    danger: "bg-danger/10 text-danger"
  } as const;

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>
  );
}

export function VolunteerEventCard({ event }: { event: VolunteerEvent }) {
  const cover = event.coverPhotos[0];
  const reward = formatReward(event.rewardAmountSfluv);
  // Availability when we manage signups, plain capacity when we do not.
  const spots = formatSpots(event) ?? formatCapacity(event);
  const cancelled = event.status === "cancelled";

  return (
    <Panel padding="none" as="article" className="flex h-full flex-col overflow-hidden">
      <Link href={eventPath(event)} className="flex h-full flex-col no-underline">
        {cover ? (
          <RemoteImage
            src={cover.url}
            alt=""
            width={cover.width}
            height={cover.height}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="aspect-[16/9] w-full object-cover"
          />
        ) : (
          <div aria-hidden="true" className="aspect-[16/9] w-full bg-brand-tint" />
        )}

        <div className="flex grow flex-col gap-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            {cancelled ? <Pill tone="danger">Cancelled</Pill> : null}
            {event.recurrenceSummary ? <Pill>{event.recurrenceSummary}</Pill> : null}
            {reward ? <Pill tone="brand">{reward}</Pill> : null}
          </div>

          <h3 className={`text-lg font-medium text-ink ${cancelled ? "line-through" : ""}`}>
            {event.title}
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
            <p className="text-sm text-ink-subtle">{event.location.name}</p>
          ) : null}

          <div className="mt-auto flex items-end justify-between gap-3 pt-2">
            <OrganizerBadge organizer={event.organizer} />
            {spots ? <span className="shrink-0 text-sm text-ink-subtle">{spots}</span> : null}
          </div>
        </div>
      </Link>
    </Panel>
  );
}
