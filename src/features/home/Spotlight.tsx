import Image from "next/image";
import { RichInline } from "@/components/content/RichDocument";
import { spotlightSlides, type SpotlightSlide } from "@/content/spotlight";
import { EventTime } from "@/features/volunteers/EventTime";
import { cn } from "@/lib/cn";
import { emptyFilters, listEvents } from "@/lib/volunteer-events/client";
import { formatReward } from "@/lib/volunteer-events/format";
import { eventPath } from "@/lib/volunteer-events/map";
import type { VolunteerEvent } from "@/lib/volunteer-events/types";
import { SpotlightButton } from "./SpotlightButton";
import { SpotlightCarousel } from "./SpotlightCarousel";

const IMAGE_SIZES = "(min-width: 1536px) 40rem, (min-width: 1024px) 35rem, (min-width: 640px) 32rem, 100vw";

function Pill({ children, tone }: { children: React.ReactNode; tone: "brand" | "neutral" }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "brand" ? "bg-brand-tint text-brand-deep" : "bg-surface-muted text-ink-muted"
      )}
    >
      {children}
    </span>
  );
}

function Slide({
  slide,
  event,
  priority
}: {
  slide: SpotlightSlide;
  event: VolunteerEvent | undefined;
  priority: boolean;
}) {
  const reward = event ? formatReward(event.rewardAmountSfluv) : null;
  const action = event ? { ...slide.action, href: eventPath(event) } : slide.action;

  return (
    <>
      {/* Its height is the carousel's to decide; see `SpotlightCarousel`. */}
      <div className="relative overflow-hidden">
        <Image
          className="size-full object-cover"
          style={slide.imagePosition ? { objectPosition: slide.imagePosition } : undefined}
          src={slide.image.src}
          alt={slide.image.alt}
          width={slide.image.width}
          height={slide.image.height}
          sizes={IMAGE_SIZES}
          priority={priority}
        />
      </div>

      <div className="flex flex-col p-4 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <Pill tone="brand">{event?.recurrenceSummary ?? slide.label}</Pill>
          {reward ? <Pill tone="neutral">{reward}</Pill> : null}
        </div>

        <h2 className="mt-2.5 text-lg leading-tight font-semibold sm:mt-3 sm:text-title">{slide.title}</h2>

        {event ? (
          <p className="mt-1.5 text-xs text-ink-subtle sm:text-sm">
            Next:{" "}
            <EventTime startAt={event.startAt} endAt={event.endAt} eventTimeZone={event.timeZone} variant="short" />
          </p>
        ) : null}

        {/* Phones keep the card to a photo, a title and a button. */}
        <p className="mt-2 hidden text-sm text-ink-muted short:hidden sm:block [&_a]:font-medium [&_a]:text-brand-deep [&_a]:underline [&_a]:underline-offset-2">
          <RichInline nodes={slide.body} />
        </p>

        {/* Right padding keeps the button clear of the carousel controls on this row. */}
        <div className="mt-auto pt-3 pr-24 sm:pt-4">
          <SpotlightButton action={action} />
        </div>
      </div>
    </>
  );
}

/**
 * The rotating card beside the homepage title, driven by `src/content/spotlight.ts`.
 *
 * Renders nothing when every slide is switched off.
 */
export async function Spotlight({ className }: { className?: string }) {
  const slides = spotlightSlides.filter((slide) => slide.enabled);
  if (slides.length === 0) return null;

  // The same request the events section further down the page makes, so it is
  // deduplicated rather than sent twice.
  const upcoming = slides.some((slide) => slide.liveEvent)
    ? (await listEvents({ ...emptyFilters, page: 1 })).events.filter((event) => event.status !== "cancelled")
    : [];

  return (
    <SpotlightCarousel
      label="Highlights"
      className={className}
      titles={slides.map((slide) => slide.title)}
      slides={slides.map((slide, index) => (
        <Slide
          key={slide.id}
          slide={slide}
          event={slide.liveEvent ? upcoming.find((event) => slide.liveEvent?.titleMatch.test(event.title)) : undefined}
          priority={index === 0}
        />
      ))}
    />
  );
}
