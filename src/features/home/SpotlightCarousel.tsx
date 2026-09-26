"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { PauseIcon, PlayIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/** How long each slide stays up while the carousel is rotating. */
const ROTATE_MS = 7000;

/**
 * One card that rotates through its slides.
 *
 * Built on native scroll-snap, like `EventCarousel`, so swiping works on touch
 * and it degrades to a scrollable row without JavaScript. Rotation is layered
 * on top and gives way to the visitor:
 *
 *  - hovering holds the current slide, and moving away lets it carry on;
 *  - swiping, picking a dot, or tabbing in stops rotation for good — they have
 *    taken over, and a slide changing under them would be hostile;
 *  - it does not start at all for visitors who prefer reduced motion, and it
 *    idles while the card is scrolled out of view or the tab is hidden.
 *
 * The pause button covers everyone else (WCAG 2.2.2). The active dot fills as
 * the slide's time runs out, so it is clear the card is going to move.
 *
 * Height: the card never grows taller than the space it is given
 * (`max-h-full` against a hero sized to the viewport). The track is a two-row
 * grid, media over text, that every slide shares through subgrid. The text row
 * is as tall as the longest slide's text, so buttons line up from slide to
 * slide. The media row is capped at a fixed share of the card's width, so the
 * crop is the same at every size, and is the one that gives way when the card
 * is squeezed — the same height on every slide, so nothing jumps as they change.
 */
export function SpotlightCarousel({
  slides,
  titles,
  label,
  className
}: {
  slides: ReactNode[];
  /** One per slide, for the dot labels. */
  titles: string[];
  label: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(slides.length > 1);
  const [hovered, setHovered] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  // Bumped to restart the active dot's timer from zero.
  const [cycle, setCycle] = useState(0);

  const running = playing && !hovered && onScreen;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let intersecting = true;
    const update = () => setOnScreen(intersecting && document.visibilityState === "visible");

    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        update();
      },
      { threshold: 0.5 }
    );
    observer.observe(root);
    document.addEventListener("visibilitychange", update);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  const syncActive = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActive(Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
  }, [slides.length]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: index * track.clientWidth, behavior: reduced ? "auto" : "smooth" });
  };

  const takeOver = () => setPlaying(false);

  if (slides.length === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label={label}
      className={cn("@container panel relative flex min-h-0 flex-col overflow-hidden", className)}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setHovered(false)}
      onFocus={(event) => {
        if (event.target.matches(":focus-visible")) takeOver();
      }}
    >
      <div
        ref={trackRef}
        onScroll={syncActive}
        onPointerDown={(event) => event.pointerType !== "mouse" && takeOver()}
        onWheel={(event) => Math.abs(event.deltaX) > Math.abs(event.deltaY) && takeOver()}
        aria-live={running ? "off" : "polite"}
        className={cn(
          "grid min-h-0 grow auto-cols-[100%] grid-flow-col snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
          // Phones get a deeper photo, the cleanup banner's own shape, to fill a
          // tall screen; wider cards a shallower strip.
          "grid-rows-[minmax(4.5rem,52cqw)_auto] sm:grid-rows-[minmax(5rem,36cqw)_auto] 2xl:grid-rows-[minmax(5rem,42cqw)_auto]",
          "compact:grid-rows-[minmax(4rem,36cqw)_auto]",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}: ${titles[index]}`}
            // Off-screen slides are skipped by keyboard and screen readers; the
            // dots are the way to reach them.
            inert={index !== active}
            className="row-span-2 grid grid-rows-subgrid snap-start snap-always"
          >
            {slide}
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        // Level with each slide's button, which leaves room for it on the right.
        <div className="absolute right-3 bottom-4 flex h-9 items-center sm:right-5 sm:bottom-6 sm:h-11">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                takeOver();
                goTo(index);
              }}
              aria-label={`Show slide ${index + 1}: ${titles[index]}`}
              aria-current={index === active}
              className="group grid h-8 place-items-center px-1"
            >
              <span
                className={cn(
                  "relative block h-2 overflow-hidden rounded-full transition-[width,background-color] duration-300",
                  index === active ? "w-6 bg-brand-tint" : "w-2 bg-ink/20 group-hover:bg-ink/40"
                )}
              >
                {index === active ? (
                  <span
                    key={cycle}
                    className={cn("absolute inset-0 origin-left bg-brand", playing && "spotlight-progress")}
                    style={{ animationDuration: `${ROTATE_MS}ms`, animationPlayState: running ? "running" : "paused" }}
                    onAnimationEnd={() => goTo((active + 1) % slides.length)}
                  />
                ) : null}
              </span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              if (!playing) setCycle((value) => value + 1);
              setPlaying(!playing);
            }}
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            className="ml-1 grid size-8 place-items-center rounded-full text-ink-muted transition-colors hover:bg-brand-tint hover:text-brand-deep"
          >
            {playing ? <PauseIcon className="size-4 fill-current" /> : <PlayIcon className="size-4 fill-current" />}
          </button>
        </div>
      ) : null}
    </section>
  );
}
