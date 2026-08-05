import Link from "next/link";
import { cn } from "@/lib/cn";
import type { EventFilters } from "@/lib/volunteer-events/types";

type EventPaginationProps = {
  filters: EventFilters;
  page: number;
  totalPages: number;
  total: number;
};

/** Builds a `/volunteers` URL preserving the active filters. */
export function volunteersHref(filters: EventFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.organizer) params.set("organizer", filters.organizer);
  if (filters.when !== "upcoming") params.set("when", filters.when);
  if (filters.openSpotsOnly) params.set("open", "1");
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `/volunteers?${query}` : "/volunteers";
}

/** Real links, so pages are crawlable and open-in-new-tab works. */
export function EventPagination({ filters, page, totalPages, total }: EventPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (candidate) =>
      candidate === 1 ||
      candidate === totalPages ||
      Math.abs(candidate - page) <= 1
  );

  const linkClass =
    "flex min-w-10 items-center justify-center rounded-lg border border-line px-3 py-2 text-sm no-underline transition-colors";

  return (
    <nav className="mt-10 flex flex-col items-center gap-3" aria-label="Event list pages">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {page > 1 ? (
            <Link className={cn(linkClass, "text-ink hover:bg-brand-tint")} href={volunteersHref(filters, page - 1)} rel="prev">
              Previous
            </Link>
          ) : (
            <span className={cn(linkClass, "cursor-default text-ink-subtle/60")} aria-disabled="true">
              Previous
            </span>
          )}
        </li>

        {pages.map((candidate, index) => {
          const previous = pages[index - 1];
          const gap = previous !== undefined && candidate - previous > 1;

          return (
            <li key={candidate} className="flex items-center gap-2">
              {gap ? <span className="text-ink-subtle">…</span> : null}
              {candidate === page ? (
                <span className={cn(linkClass, "border-brand bg-brand text-white")} aria-current="page">
                  {candidate}
                </span>
              ) : (
                <Link className={cn(linkClass, "text-ink hover:bg-brand-tint")} href={volunteersHref(filters, candidate)}>
                  {candidate}
                </Link>
              )}
            </li>
          );
        })}

        <li>
          {page < totalPages ? (
            <Link className={cn(linkClass, "text-ink hover:bg-brand-tint")} href={volunteersHref(filters, page + 1)} rel="next">
              Next
            </Link>
          ) : (
            <span className={cn(linkClass, "cursor-default text-ink-subtle/60")} aria-disabled="true">
              Next
            </span>
          )}
        </li>
      </ul>

      <p className="text-sm text-ink-subtle">
        Page {page} of {totalPages} · {total} {total === 1 ? "event" : "events"}
      </p>
    </nav>
  );
}
