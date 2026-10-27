"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * A select built from our own parts rather than the browser's.
 *
 * A native `<select>` cannot be styled past its border: the option list is
 * drawn by the operating system, so on the contact form it arrived in Chrome's
 * grey while everything around it was ours. This renders the list itself, which
 * is the only way to make it match.
 *
 * Replacing a native control means taking on what it gave us for free, so the
 * keyboard and screen-reader behaviour here is deliberate rather than
 * incidental: roving focus through the options, type-ahead on letters, Escape
 * to close without changing the value, and the real value carried in a hidden
 * input so the surrounding form still works exactly as a form.
 */

export type ListboxOption = {
  value: string;
  label: string;
  /** Optional second line, for options that need explaining. */
  hint?: string;
};

type ListboxProps = {
  id: string;
  name: string;
  options: ListboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function Listbox({
  id,
  name,
  options,
  value,
  onChange,
  placeholder = "Choose one",
  className
}: ListboxProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.findIndex((o) => o.value === value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const typeAhead = useRef<{ text: string; at: number }>({ text: "", at: 0 });

  const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);

  const close = useCallback(
    (returnFocus: boolean) => {
      setOpen(false);
      if (returnFocus) buttonRef.current?.focus();
    },
    []
  );

  // Clicking away closes without choosing, which is what a native select does.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Focus the list when it opens, so the arrow keys go to it rather than to the
  // page. Once, on open — a ref callback would re-run on every render and fight
  // anything else that wanted focus.
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  // Keep the focused option in view when moving through a long list.
  useEffect(() => {
    if (!open) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const commit = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    close(true);
  };

  const openAt = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, options.length - 1)));
    setOpen(true);
  };

  const onButtonKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
      case "Enter":
      case " ":
        event.preventDefault();
        openAt(Math.max(0, options.findIndex((o) => o.value === value)));
        break;
      case "ArrowUp":
        event.preventDefault();
        openAt(options.length - 1);
        break;
    }
  };

  const onListKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, options.length - 1));
        return;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        return;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        return;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(activeIndex);
        return;
      case "Escape":
        event.preventDefault();
        close(true);
        return;
      case "Tab":
        // Tabbing out of an open list accepts nothing and moves on.
        setOpen(false);
        return;
    }

    // Type-ahead: consecutive letters within a second build a prefix, so
    // "vol" reaches Volunteering rather than cycling V, O, L.
    if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey) return;
    const now = Date.now();
    const text = (now - typeAhead.current.at < 1000 ? typeAhead.current.text : "") + event.key.toLowerCase();
    typeAhead.current = { text, at: now };
    const match = options.findIndex((option) => option.label.toLowerCase().startsWith(text));
    if (match >= 0) setActiveIndex(match);
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {/* The value the form submits. Keeping a real input means the page works
          the same whether this control is ours or the browser's. */}
      <input type="hidden" name={name} value={value} />

      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? close(false) : openAt(Math.max(0, options.findIndex((o) => o.value === value))))}
        onKeyDown={onButtonKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-lg border border-line bg-surface",
          "px-3.5 py-3 text-left text-ink",
          "focus:border-brand focus:outline-3 focus:outline-brand-tint"
        )}
      >
        <span className={cn(!selected && "text-ink-subtle/70")}>{selected?.label ?? placeholder}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={cn("size-4 shrink-0 text-ink-muted transition-transform", open && "rotate-180")}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={id}
          aria-activedescendant={`${listId}-${activeIndex}`}
          tabIndex={-1}
          ref={listRef}
          onKeyDown={onListKeyDown}
          className={cn(
            "absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-line",
            "bg-surface py-1 shadow-lg focus:outline-none"
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                role="option"
                aria-selected={isSelected}
                onClick={() => commit(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "cursor-pointer px-3.5 py-2.5",
                  isActive && "bg-brand-tint",
                  isSelected && "font-medium text-brand-deep"
                )}
              >
                <span className="block">{option.label}</span>
                {option.hint ? <span className="mt-0.5 block text-sm text-ink-subtle">{option.hint}</span> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
