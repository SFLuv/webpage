import { getEvent } from "@/lib/volunteer-events/client";
import { buildEventIcs, icsFilename } from "@/lib/volunteer-events/ics";
import { parseEventId } from "@/lib/volunteer-events/map";

/**
 * Downloads a single event as an iCalendar file.
 *
 * Served from the event's own URL (`/volunteers/{slug}-{id}/calendar`) so the
 * link is shareable and obviously related to the page it came from.
 */
export async function GET(request: Request, { params }: { params: Promise<{ eventSlug: string }> }) {
  const { eventSlug } = await params;
  const event = await getEvent(parseEventId(eventSlug));

  if (!event) {
    return new Response("Event not found", { status: 404 });
  }

  const body = buildEventIcs(event, new Date());

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${icsFilename(event)}"`,
      // Times and cancellation status can change; never serve a stale invite.
      "Cache-Control": "public, max-age=60"
    }
  });
}
