"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { PauseIcon, PlayIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { fitSpotlight, SPOTLIGHT_SLOT_ID } from "./heroLayout";

/** How long each slide stays up while the carousel is rotating. */
const ROTATE_MS = 7000;

/** How long the track has to sit still before a scroll counts as finished. */
const SETTLE_MS = 120;

/** Sideways travel, in pixels, before a touch counts as a swipe. */
const SWIPE_PX = 10;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * One card that rotates through its slides, round and round.
 *
 * Built on native scroll-snap, like `EventCarousel`, so swiping works on touch
 * and it degrades to a scrollable row without JavaScript. A copy of the first
 * slide sits after the last: rotation scrolls on into it, then swaps the real
 * first slide back in, so the loop always moves forwards instead of rewinding.
 *
 * Rotation starts on its own and gives way to the visitor:
 *
 *  - hovering holds the current slide, and moving away lets it carry on;
 *  - swiping sideways, picking a dot, or tabbing in stops it for good — they
 *    have taken over, and a slide changing under them would be hostile;
 *  - it idles while the card is scrolled out of view or the tab is hidden;
 *  - with reduced motion preferred, slides change in place instead of sliding.
 *
 * The pause button covers everyone else (WCAG 2.2.2). The active dot fills as
 * the slide's time runs out, so it is clear the card is going to move.
 *
 * Size: the track is a two-row grid, photo over text, that every slide shares
 * through subgrid. The photo is always the same shape, a fixed share of the
 * card's width; the text row is as tall as the longest slide's text, so the
 * buttons line up from slide to slide. When the hero leaves less height than
 * that, the whole card scales down evenly — see `fitSpotlight`.
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
  /** For the slot the card is fitted into. */
  className?: string;
}) {
  const slotRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const settleRef = useRef<number | undefined>(undefined);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const count = slides.length;
  const loops = count > 1;

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(loops);
  const [hovered, setHovered] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  // Bumped to restart the active dot's timer from zero.
  const [cycle, setCycle] = useState(0);

  const running = playing && !hovered && onScreen;

  // Before paint, so a client-side visit to the homepage is fitted up front
  // just as the server-rendered one is by the inline script.
  useLayoutEffect(() => {
    const slot = slotRef.current;
    const card = rootRef.current;
    if (!slot || !card) return;

    const fit = () => fitSpotlight(slot);
    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(slot);
    observer.observe(card);
    // The web font can land after the first fit and reflow the text.
    document.fonts.ready.then(fit);

    return () => observer.disconnect();
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
      window.clearTimeout(settleRef.current);
    };
  }, []);

  const goTo = (position: number) => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollTo({
      left: position * track.clientWidth,
      behavior: prefersReducedMotion() ? "instant" : "smooth"
    });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;

    const position = Math.round(track.scrollLeft / track.clientWidth);
    setActive(position % count);

    // Once the track settles on the copy of the first slide, jump back to the
    // real one. They look identical, so nobody sees it happen. Not while a
    // finger is still down: the jump would fight it.
    window.clearTimeout(settleRef.current);
    if (loops && position === count) {
      settleRef.current = window.setTimeout(() => {
        if (!touchRef.current) track.scrollTo({ left: 0, behavior: "instant" });
      }, SETTLE_MS);
    }
  };

  const takeOver = () => setPlaying(false);

  const endTouch = () => {
    touchRef.current = null;
    onScroll();
  };

  if (count === 0) return null;

  const slideClass = "row-span-2 grid grid-rows-subgrid snap-start snap-always";

  return (
    <div
      id={SPOTLIGHT_SLOT_ID}
      ref={slotRef}
      className={cn("min-h-0", className)}
      // The inline script sets `--spotlight-scale` here before React loads.
      suppressHydrationWarning
    >
      <section
        ref={rootRef}
        aria-roledescription="carousel"
        aria-label={label}
        className={cn(
          "@container panel relative overflow-hidden",
          // Scaled from the corner nearest the rest of the layout: the title's
          // left edge when stacked, the page's right-hand gutter beside it.
          "origin-top-left [scale:var(--spotlight-scale,1)] lg:origin-top-right"
        )}
        onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={(event) => event.pointerType === "mouse" && setHovered(false)}
        onFocus={(event) => {
          if (event.target.matches(":focus-visible")) takeOver();
        }}
      >
        <div
          ref={trackRef}
          onScroll={onScroll}
          // A touch that starts on the card is usually someone scrolling the
          // page, so only a sideways swipe takes over.
          onTouchStart={(event) => {
            const touch = event.touches[0];
            touchRef.current = { x: touch.clientX, y: touch.clientY };
          }}
          onTouchMove={(event) => {
            const start = touchRef.current;
            const touch = event.touches[0];
            if (!start) return;

            const across = Math.abs(touch.clientX - start.x);
            if (across > SWIPE_PX && across > Math.abs(touch.clientY - start.y)) takeOver();
          }}
          onTouchEnd={endTouch}
          onTouchCancel={endTouch}
          onWheel={(event) => Math.abs(event.deltaX) > Math.abs(event.deltaY) && takeOver()}
          aria-live={running ? "off" : "polite"}
          className={cn(
            "grid auto-cols-[100%] grid-flow-col grid-rows-[36cqw_auto] snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          )}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}: ${titles[index]}`}
              // Off-screen slides are skipped by keyboard and screen readers;
              // the dots are the way to reach them.
              inert={index !== active}
              className={slideClass}
            >
              {slide}
            </div>
          ))}

          {loops ? (
            <div aria-hidden inert className={slideClass}>
              {slides[0]}
            </div>
          ) : null}
        </div>

        {loops ? (
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
                      // From the last slide this is the copy of the first.
                      onAnimationEnd={() => goTo(active + 1)}
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
    </div>
  );
}

