"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import type { OpenState } from "@/lib/merchants/hours";
import type { Merchant } from "@/lib/merchants/types";
import { MerchantIcon, OpenStatusBadge } from "./MerchantPin";

/** Sort order for the list: open, then unknown, then closed. */
const openRank = (state: OpenState): number => (state === "open" ? 0 : state === "closed" ? 2 : 1);

type MerchantListPanelProps = {
  merchants: Merchant[];
  /** Resolves a merchant's open state against the map's shared clock. */
  openStateFor: (merchant: Merchant) => OpenState;
  /** Opens the merchant's card, exactly as clicking their pin does. */
  onSelect: (merchant: Merchant) => void;
  /** Moves the map to a merchant without opening anything. */
  onFocus: (merchant: Merchant) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  /**
   * Whether the list is the chosen view on small screens, where it replaces the
   * map rather than sitting beside it.
   */
  mobileVisible: boolean;
};

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M9.29 6.71 14.59 12l-5.3 5.29 1.42 1.42L17.41 12l-6.7-6.71z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14" />
    </svg>
  );
}

/**
 * The merchant list beside the map.
 *
 * Shares the map's own list rather than fetching or filtering again, so the
 * count in the panel is always the count of pins on screen. Its search narrows
 * only the list: emptying the map as someone types would hide the very pins
 * they are trying to locate.
 */
export function MerchantListPanel({
  merchants,
  openStateFor,
  onSelect,
  onFocus,
  collapsed,
  onCollapsedChange,
  mobileVisible
}: MerchantListPanelProps) {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const found =
      needle === ""
        ? merchants
        : merchants.filter((merchant) =>
            `${merchant.name} ${merchant.type} ${merchant.city} ${merchant.street}`.toLowerCase().includes(needle)
          );

    // Open merchants first, shut ones last. Someone scanning this list is
    // deciding where to go now, and a closed shop is not an answer to that.
    // Merchants whose hours we never learned sit between the two rather than
    // being sunk with the closed: we have no grounds to rule them out.
    //
    // No distance tiebreak: the site does not ask for the visitor's location,
    // and prompting for it to reorder a list nobody asked to have reordered is
    // not a trade worth making on a public page.
    return [...found].sort((left, right) => openRank(openStateFor(left)) - openRank(openStateFor(right)));
  }, [merchants, openStateFor, query]);

  return (
    <>
      {/*
        The collapsed rail is a desktop affordance only. On small screens the
        list IS the view, and the Map/List toggle above already does this job.
      */}
      <button
        type="button"
        onClick={() => onCollapsedChange(false)}
        className={cn(
          "hidden shrink-0 flex-col items-center gap-2 border-l border-line bg-surface px-2 py-3 text-ink-subtle transition-colors hover:text-ink",
          collapsed ? "lg:flex" : "lg:hidden"
        )}
        aria-label="Show merchant list"
      >
        <ChevronIcon className="size-4 rotate-180 fill-current" />
        <span className="text-xs font-medium [writing-mode:vertical-rl]">
          {merchants.length} merchant{merchants.length === 1 ? "" : "s"}
        </span>
      </button>

      <aside
        className={cn(
          "shrink-0 flex-col overflow-hidden bg-surface",
          mobileVisible ? "flex w-full" : "hidden",
          collapsed ? "lg:hidden" : "lg:flex lg:w-72 lg:border-l lg:border-line xl:w-80"
        )}
      >
        <div className="flex items-center gap-2 border-b border-line p-2.5">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 fill-ink-subtle" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search merchants"
              aria-label="Search merchants"
              className="h-9 w-full rounded-lg border border-line bg-canvas pr-2 pl-8 text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-3 focus-visible:outline-brand-tint"
            />
          </div>
          <button
            type="button"
            onClick={() => onCollapsedChange(true)}
            className="hidden shrink-0 rounded-lg p-1.5 text-ink-subtle transition-colors hover:bg-ink/5 hover:text-ink lg:block"
            aria-label="Hide merchant list"
          >
            <ChevronIcon className="size-4 fill-current" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {matches.length === 0 ? (
            <p className="p-4 text-sm text-ink-subtle">No merchants match that search.</p>
          ) : (
            <ul className="divide-y divide-line">
              {matches.map((merchant) => {
                const state = openStateFor(merchant);

                return (
                  <li key={merchant.id}>
                    <button
                      type="button"
                      // Hovering the row moves the map, clicking opens the card:
                      // browsing the list should not cost a click per merchant.
                      onMouseEnter={() => onFocus(merchant)}
                      onFocus={() => onFocus(merchant)}
                      onClick={() => onSelect(merchant)}
                      className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-brand-tint"
                    >
                      <div className="size-9 shrink-0 overflow-hidden rounded-lg shadow-panel">
                        <MerchantIcon name={merchant.name} iconUrl={merchant.iconUrl} size={36} state={state} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{merchant.name}</p>
                        <p className="truncate text-xs text-ink-subtle capitalize">
                          {[merchant.type, merchant.city].filter(Boolean).join(" • ")}
                        </p>
                        <OpenStatusBadge state={state} className="mt-1 text-xs" />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="border-t border-line px-3 py-2 text-xs text-ink-subtle">
          {matches.length} of {merchants.length} shown
        </p>
      </aside>
    </>
  );
}
