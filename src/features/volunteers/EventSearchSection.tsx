"use client";

import { useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { EventFilters as Filters, Organizer } from "@/lib/volunteer-events/types";
import { EventFilters } from "./EventFilters";

const PANEL_ID = "event-search-panel";

type EventSearchSectionProps = {
  title: string;
  filters: Filters;
  organizers: Organizer[];
};

/**
 * Page title with a search toggle, and the filter panel it reveals.
 *
 * The title lives here rather than in the page so the heading and the toggle
 * can share one flex row while the panel drops below it.
 */
export function EventSearchSection({ title, filters, organizers }: EventSearchSectionProps) {
  const filtersActive = Boolean(filters.search || filters.organizer || filters.openSpotsOnly);

  /*
   * Closed by default — but opened when the visitor arrives with filters
   * already applied (a shared or bookmarked URL), so active filters are never
   * hidden behind a toggle that looks untouched.
   */
  const [open, setOpen] = useState(filtersActive);

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-headline">{title}</h1>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={PANEL_ID}
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl border transition-colors",
            open
              ? "border-brand bg-brand text-white"
              : "border-line bg-surface text-ink hover:bg-brand-tint"
          )}
        >
          {open ? (
            <CloseIcon className="size-5 fill-current" />
          ) : (
            <SearchIcon className="size-5 fill-current" />
          )}
          {/*
            Constant accessible name — `aria-expanded` carries the state. A name
            that flipped to "Hide…" would make the control unfindable for anyone
            addressing it by name, e.g. voice control saying "click search".
          */}
          <span className="sr-only">Search and filter events</span>
        </button>
      </div>

      {/*
        Hidden via an inline style rather than the `hidden` attribute or a
        `hidden` utility class, specifically so the noscript rule below can
        override it. Tailwind's preflight declares
        `[hidden]{display:none!important}` inside a cascade layer, and for
        important declarations layered styles beat unlayered ones — an unlayered
        `!important` override could never win. An `!important` rule does beat a
        normal inline style, so this combination works. Do not "tidy" this back
        to `hidden`.
      */}
      <div id={PANEL_ID} style={open ? undefined : { display: "none" }} className="mt-5">
        <EventFilters filters={filters} organizers={organizers} />
      </div>

      {/* Without JavaScript the toggle can never run, so keep search usable. */}
      <noscript>
        <style>{`#${PANEL_ID}{display:block!important}`}</style>
      </noscript>
    </>
  );
}
