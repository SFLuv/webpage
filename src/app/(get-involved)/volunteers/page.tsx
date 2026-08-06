import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { Section } from "@/components/ui/Section";
import { EventSearchSection } from "@/features/volunteers/EventSearchSection";
import { EventPagination } from "@/features/volunteers/EventPagination";
import { VolunteerEventCard } from "@/features/volunteers/VolunteerEventCard";
import { ArchiveEventCard } from "@/features/volunteers/ArchiveEventCard";
import { listEvents } from "@/lib/volunteer-events/client";
import type { EventFilters as Filters } from "@/lib/volunteer-events/types";
import { archivedEvents, volunteersContent } from "@/content/volunteers";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: volunteersContent.title,
  description: volunteersContent.description,
  path: routes.volunteers
});

/** Upstream event data is cached for 60s; see comms.md [5] D2. */
export const revalidate = 60;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function parseFilters(params: Record<string, string | string[] | undefined>): Filters {
  const page = Number.parseInt(first(params.page), 10);

  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    search: first(params.search),
    organizer: first(params.organizer),
    when: first(params.when) === "past" ? "past" : "upcoming",
    openSpotsOnly: first(params.open) === "1"
  };
}

export default async function VolunteersPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseFilters(await searchParams);
  const result = await listEvents(filters);

  const hasFilters = Boolean(filters.search || filters.organizer || filters.openSpotsOnly);

  return (
    <>
      <section className="pt-4 pb-8 sm:pt-8">
        <Container width="wide">
          <EventSearchSection
            title={volunteersContent.title}
            filters={filters}
            organizers={result.organizers}
          />

          <div className="mt-8">
            {result.degraded ? (
              <Panel padding="lg" className="text-center">
                <h2 className="text-title font-medium">Events are temporarily unavailable</h2>
                <p className="mt-2 text-ink-muted">
                  We could not load the event calendar just now. Please try again shortly — or browse our
                  past events below to see the kind of work we do.
                </p>
              </Panel>
            ) : result.events.length === 0 ? (
              <Panel padding="lg" className="text-center">
                <h2 className="text-title font-medium">
                  {hasFilters ? "No events match those filters" : "No upcoming events right now"}
                </h2>
                <p className="mt-2 text-ink-muted">
                  {hasFilters
                    ? "Try clearing a filter or searching for something broader."
                    : "New volunteer events are posted regularly. Check back soon, or take a look at our past events below."}
                </p>
              </Panel>
            ) : (
              <>
                {/* auto-rows-fr keeps every row the same height, not just every card in a row. */}
                <ul className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {result.events.map((event) => (
                    <li key={event.id} className="flex">
                      <VolunteerEventCard event={event} />
                    </li>
                  ))}
                </ul>

                <EventPagination
                  filters={filters}
                  page={result.page}
                  totalPages={result.totalPages}
                  total={result.total}
                />
              </>
            )}
          </div>
        </Container>
      </section>

      {/*
        Community history from before the events system existed. Kept as a static
        archive so a year of photos does not vanish when live events take over
        this page — see comms.md [6].
      */}
      <Section title={volunteersContent.archiveTitle} lead={volunteersContent.archiveLead} width="wide" spacing="lg">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {archivedEvents.map((event) => (
            <ArchiveEventCard key={event.title} event={event} />
          ))}
        </div>
      </Section>
    </>
  );
}
