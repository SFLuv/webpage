"use client";

import { useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Select, TextInput } from "@/components/ui/Field";
import { organizerKey } from "@/lib/volunteer-events/client";
import type { EventFilters as Filters, Organizer } from "@/lib/volunteer-events/types";

type EventFiltersProps = {
  filters: Filters;
  organizers: Organizer[];
};

/**
 * Filter bar for the event list.
 *
 * A real GET form, so it works with JavaScript disabled and every filtered view
 * has a shareable URL. With JS it submits on change instead of needing "Apply".
 * Submitting always drops `page`, which resets pagination to the first page.
 */
export function EventFilters({ filters, organizers }: EventFiltersProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const submit = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const params = new URLSearchParams();

    for (const [key, value] of data.entries()) {
      const text = String(value).trim();
      if (text) params.set(key, text);
    }

    const query = params.toString();
    router.push(query ? `/volunteers?${query}` : "/volunteers", { scroll: false });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(event.currentTarget);
  };

  const submitSoon = (delay: number) => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      if (formRef.current) submit(formRef.current);
    }, delay);
  };

  return (
    <form
      ref={formRef}
      method="get"
      action="/volunteers"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="min-w-0 grow">
        <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="event-search">
          Search events
        </label>
        <TextInput
          id="event-search"
          name="search"
          type="search"
          defaultValue={filters.search}
          placeholder="Cleanup, mural, dining room…"
          onChange={() => submitSoon(400)}
        />
      </div>

      <div className="sm:w-52">
        <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="event-organizer">
          Organizer
        </label>
        <Select
          id="event-organizer"
          name="organizer"
          defaultValue={filters.organizer}
          onChange={() => submitSoon(0)}
        >
          <option value="">All organizers</option>
          {organizers.map((organizer) => (
            <option key={organizerKey(organizer)} value={organizerKey(organizer)}>
              {organizer.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="sm:w-40">
        <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="event-when">
          When
        </label>
        <Select id="event-when" name="when" defaultValue={filters.when} onChange={() => submitSoon(0)}>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </Select>
      </div>

      <label className="flex items-center gap-2.5 text-ink-muted sm:mb-3">
        <input
          type="checkbox"
          name="open"
          value="1"
          defaultChecked={filters.openSpotsOnly}
          onChange={() => submitSoon(0)}
          className="size-4 shrink-0 accent-brand"
        />
        <span className="text-sm">Open spots only</span>
      </label>

      {/* Without JS this is how filters get applied; with JS it is redundant but harmless. */}
      <noscript>
        <Button type="submit" size="sm">
          Apply
        </Button>
      </noscript>
    </form>
  );
}
