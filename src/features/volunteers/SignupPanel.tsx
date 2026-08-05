import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { formatCapacity, formatSpots, signupClosedMessage } from "@/lib/volunteer-events/format";
import type { VolunteerEvent } from "@/lib/volunteer-events/types";
import { eventPath } from "@/lib/volunteer-events/map";
import { InternalSignupForm } from "./InternalSignupForm";

/**
 * "Add to calendar" download.
 *
 * The web-native counterpart to the app's push reminder — anonymous visitors
 * have no account and can never receive one. See comms.md [25].
 */
function AddToCalendar({ event }: { event: VolunteerEvent }) {
  if (event.status === "ended" || event.status === "cancelled") return null;

  return (
    <p className="mt-4">
      <a
        className="text-sm font-medium text-brand-deep underline underline-offset-2 hover:text-brand"
        href={`${eventPath(event)}/calendar`}
      >
        Add to calendar
      </a>
    </p>
  );
}

/** Renders whichever signup path the event was configured with. */
export function SignupPanel({ event }: { event: VolunteerEvent }) {
  const spots = formatSpots(event);
  const capacity = formatCapacity(event);

  if (event.status === "cancelled") {
    return (
      <Panel padding="lg" bordered>
        <h2 className="text-title font-medium">This event was cancelled</h2>
        <p className="mt-2 text-ink-muted">
          Keep an eye on this page — we often reschedule. You can also browse other upcoming events.
        </p>
        <div className="mt-5">
          <Button variant="secondary" href="/volunteers">
            See other events
          </Button>
        </div>
      </Panel>
    );
  }

  if (event.status === "ended") {
    return (
      <Panel padding="lg" bordered>
        <h2 className="text-title font-medium">This event has already happened</h2>
        <p className="mt-2 text-ink-muted">Thank you to everyone who came out.</p>
        <div className="mt-5">
          <Button variant="secondary" href="/volunteers">
            See upcoming events
          </Button>
        </div>
      </Panel>
    );
  }

  if (event.signup.mode === "external") {
    return (
      <Panel padding="lg" bordered>
        <h2 className="text-title font-medium">Sign up</h2>
        <p className="mt-2 text-ink-muted">
          Signups for this event are handled by {event.organizer.name}.
        </p>
        {capacity ? <p className="mt-1 text-sm text-ink-subtle">{capacity}</p> : null}
        <div className="mt-5">
          <Button href={event.signup.url} size="lg">
            Sign up for this event
          </Button>
        </div>
        <AddToCalendar event={event} />
      </Panel>
    );
  }

  if (event.signup.mode === "internal") {
    if (!event.signup.open) {
      return (
        <Panel padding="lg" bordered>
          <h2 className="text-title font-medium">Signups are closed</h2>
          <p className="mt-2 text-ink-muted">{signupClosedMessage(event.signup.closedReason)}</p>
          <div className="mt-5">
            <Button variant="secondary" href="/volunteers">
              See other events
            </Button>
          </div>
        </Panel>
      );
    }

    return (
      <Panel padding="lg" bordered>
        <h2 className="text-title font-medium">Sign up</h2>
        <p className="mt-2 mb-6 text-ink-muted">
          Tell us who you are and we&rsquo;ll save you a spot.
          {spots ? ` ${spots}.` : ""}
        </p>
        <InternalSignupForm eventId={event.id} eventTitle={event.title} />
        <AddToCalendar event={event} />
      </Panel>
    );
  }

  return (
    <Panel padding="lg" bordered>
      <h2 className="text-title font-medium">Just show up</h2>
      <p className="mt-2 text-ink-muted">
        No signup is needed for this event. Come along at the start time and find the SFLuv team.
      </p>
      <AddToCalendar event={event} />
    </Panel>
  );
}
