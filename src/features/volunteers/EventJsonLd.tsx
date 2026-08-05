import { isoWithOffset } from "@/lib/volunteer-events/format";
import { eventPath } from "@/lib/volunteer-events/map";
import type { VolunteerEvent } from "@/lib/volunteer-events/types";
import { siteConfig } from "@/lib/site";

const STATUS_URLS: Record<VolunteerEvent["status"], string> = {
  scheduled: "https://schema.org/EventScheduled",
  live: "https://schema.org/EventScheduled",
  ended: "https://schema.org/EventScheduled",
  cancelled: "https://schema.org/EventCancelled"
};

function absolute(path: string) {
  return path.startsWith("http") ? path : new URL(path, siteConfig.url).toString();
}

/**
 * Volunteering is free; `offers` conveys availability, not price.
 *
 * Availability reflects whether a spot can actually be claimed right now, not
 * merely whether spots exist. A cancelled or ended event advertising `InStock`
 * would contradict its own `eventStatus`, so those omit offers entirely and let
 * `eventStatus` carry the meaning.
 */
function availabilityFor(event: VolunteerEvent): string | null {
  const { signup } = event;

  if (signup.mode !== "internal") return null;
  if (event.status === "cancelled" || event.status === "ended") return null;
  if (event.spotsRemaining === null) return null;

  return signup.open && event.spotsRemaining > 0
    ? "https://schema.org/InStock"
    : "https://schema.org/SoldOut";
}

/**
 * schema.org Event markup for search engines.
 *
 * Only fields we actually have are emitted — no placeholder location, no
 * invented price. Structured data that misrepresents an event is worse than
 * none, since it can get a whole site demoted for rich-result spam.
 */
export function EventJsonLd({ event }: { event: VolunteerEvent }) {
  const url = absolute(eventPath(event));

  const location = event.location
    ? {
        "@type": "Place",
        ...(event.location.name ? { name: event.location.name } : {}),
        ...(event.location.street || event.location.city
          ? {
              address: {
                "@type": "PostalAddress",
                ...(event.location.street ? { streetAddress: event.location.street } : {}),
                ...(event.location.city ? { addressLocality: event.location.city } : {}),
                ...(event.location.state ? { addressRegion: event.location.state } : {}),
                ...(event.location.zip ? { postalCode: event.location.zip } : {}),
                addressCountry: "US"
              }
            }
          : {}),
        ...(event.location.lat !== null && event.location.lng !== null
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: event.location.lat,
                longitude: event.location.lng
              }
            }
          : {})
      }
    : null;

  const availability = availabilityFor(event);

  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    url,
    startDate: isoWithOffset(event.startAt, event.timeZone),
    ...(event.endAt ? { endDate: isoWithOffset(event.endAt, event.timeZone) } : {}),
    eventStatus: STATUS_URLS[event.status],
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    ...(event.description ? { description: event.description } : {}),
    ...(event.coverPhotos.length
      ? { image: event.coverPhotos.map((photo) => absolute(photo.url)) }
      : {}),
    ...(location ? { location } : {}),
    organizer: {
      "@type": "Organization",
      name: event.organizer.name,
      ...(event.organizer.type === "sfluv" ? { url: siteConfig.url } : {})
    },
    ...(event.maxParticipants ? { maximumAttendeeCapacity: event.maxParticipants } : {}),
    ...(availability
      ? {
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability,
            url,
            validFrom: isoWithOffset(new Date(), event.timeZone)
          }
        }
      : {})
  };

  return (
    <script
      type="application/ld+json"
      // Content is our own serialized object, not user-supplied markup.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
