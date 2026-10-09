"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";
import type { AmplificationChart } from "@/content/about";
import { cn } from "@/lib/cn";

/*
 * Geometry, in a 240-unit square. The inner ring is the program dollar. The
 * outer one, dotted, is the second dollar the goal asks for, so the arc drawn
 * along it is how much of that second dollar is reached so far.
 */
const CENTRE = 120;
const INNER = 82;
const OUTER = 108;

/** Rings use `pathLength={100}`, so dash lengths and offsets are percentages. */
const FULL = 100;

const multiple = (value: number) => `${value.toFixed(2)}x`;

/** Lighter end of the coral, for the program dollar's gradient. */
const CORAL_LIGHT = "color-mix(in srgb, var(--color-brand) 65%, white)";
/** Brighter end of the deep red, for the gradient of what the dollar adds. */
const DEEP_LIGHT = "color-mix(in srgb, var(--color-brand-deep) 70%, var(--color-brand))";

/** How far along a ring's draw-on is, 0 to 1, from where its dash has got to. */
function drawn(circle: SVGCircleElement, length: number) {
  const offset = parseFloat(getComputedStyle(circle).strokeDashoffset) || 0;
  return Math.min(1, Math.max(0, (FULL - offset) / length));
}

function LegendRow({
  swatch,
  title,
  detail,
  delay
}: {
  swatch: string;
  title: string;
  detail: string;
  delay: string;
}) {
  return (
    <li className="amp-anim amp-rise flex gap-3.5" style={{ animationDelay: delay }}>
      {/* Level with the first line of the title. */}
      <span aria-hidden className={cn("mt-[0.45em] size-3 shrink-0 rounded-full", swatch)} />
      <span>
        <span className="block font-medium text-ink">{title}</span>
        <span className="mt-0.5 block text-sm text-ink-muted">{detail}</span>
      </span>
    </li>
  );
}

/**
 * How far a dollar goes, after the expanding pie in the annual report.
 *
 * A dollar fills the ring, then what it adds spills past it onto the goal ring
 * while the amplification factor in the middle counts up from 1.00x. It plays once it is in view, and
 * again each time it comes back. The rings are CSS animations — the timings
 * live with the keyframes in `globals.css` — and the figure is read off the
 * outer arc frame by frame, so the two can never drift apart.
 *
 * It renders on its first frame and waits for this component to start it. Its
 * resting state is the finished picture, which is what visitors who prefer
 * reduced motion, or who have scripts off, see instead.
 */
export function AmplificationRing({ chart }: { chart: AmplificationChart }) {
  const { factor, goal, heading, legend, tagline, label } = chart;
  const extra = factor - 1;
  // Share of the goal's second dollar reached, as a percentage of the outer ring.
  const reached = Math.round((extra / (goal - 1)) * FULL);

  const id = useId();
  const figureRef = useRef<HTMLElement>(null);
  const spillRef = useRef<SVGCircleElement>(null);
  const figureTextRef = useRef<HTMLSpanElement>(null);

  // Bumped to restart every animation from the top.
  const [cycle, setCycle] = useState(0);
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setWaiting(false);
      return;
    }

    // Play once it is mostly in view; rewind once it is entirely out of it.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) {
          setWaiting(false);
        } else if (!entry.isIntersecting) {
          setWaiting(true);
          setCycle((value) => value + 1);
        }
      },
      { threshold: [0, 0.5] }
    );
    observer.observe(figure);
    return () => observer.disconnect();
  }, []);

  // While it plays, keep the figure in the middle level with the outer arc:
  // 1.00x while the dollar fills its own ring, counting up as the rest spills.
  useEffect(() => {
    const spill = spillRef.current;
    // The text node React rendered, updated in place so React still owns it.
    const text = figureTextRef.current?.firstChild;
    if (waiting || !spill || !text) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const tick = () => {
      const spilled = drawn(spill, reached);
      text.nodeValue = multiple(1 + extra * spilled);
      if (spilled < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [waiting, cycle, extra, reached]);

  return (
    <figure ref={figureRef} data-amp={waiting ? "waiting" : "live"} className="flex flex-col items-center">
      <figcaption className="sr-only">{label}</figcaption>

      {/* Without scripts nothing would start it, so show the finished picture. */}
      <noscript>
        <style>{"[data-amp] .amp-anim{animation:none}[data-amp] .amp-figure{visibility:visible}"}</style>
      </noscript>

      <p className="mb-8 self-start text-xs font-semibold tracking-[0.14em] text-brand uppercase sm:mb-6">{heading}</p>

      <Fragment key={cycle}>
        <div className="flex flex-col items-center gap-10 sm:flex-row sm:gap-16">
          <div aria-hidden className="relative size-60 shrink-0 sm:size-72">
            {/* Turned a quarter so the rings start at twelve o'clock and run clockwise. */}
            <svg viewBox="0 0 240 240" className="size-full -rotate-90">
              <defs>
                <linearGradient id={`${id}-dollar`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" style={{ stopColor: CORAL_LIGHT }} />
                  <stop offset="1" style={{ stopColor: "var(--color-brand)" }} />
                </linearGradient>
                <linearGradient id={`${id}-extra`} x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" style={{ stopColor: "var(--color-brand-deep)" }} />
                  <stop offset="1" style={{ stopColor: DEEP_LIGHT }} />
                </linearGradient>
              </defs>

              {/* The goal: a second dollar's worth, dotted. */}
              <circle
                cx={CENTRE}
                cy={CENTRE}
                r={OUTER}
                pathLength={FULL}
                strokeDasharray="0.01 1.24"
                strokeLinecap="round"
                strokeWidth={3}
                className="amp-anim amp-goal fill-none stroke-ink/25"
              />

              <circle cx={CENTRE} cy={CENTRE} r={INNER} strokeWidth={18} className="fill-none stroke-brand-tint" />

              {/* The program dollar: drawn on, then swapped for a whole ring, which has no seam where the ends meet. */}
              <circle
                cx={CENTRE}
                cy={CENTRE}
                r={INNER}
                pathLength={FULL}
                strokeDasharray={FULL}
                strokeDashoffset={0}
                strokeWidth={18}
                stroke={`url(#${id}-dollar)`}
                className="amp-anim amp-fill fill-none"
              />
              <circle
                cx={CENTRE}
                cy={CENTRE}
                r={INNER}
                strokeWidth={18}
                stroke={`url(#${id}-dollar)`}
                className="amp-anim amp-whole fill-none"
              />

              {/* What it adds on the way out. */}
              <circle
                ref={spillRef}
                cx={CENTRE}
                cy={CENTRE}
                r={OUTER}
                pathLength={FULL}
                strokeDasharray={`${FULL} ${FULL}`}
                strokeDashoffset={FULL - reached}
                strokeLinecap="round"
                strokeWidth={8}
                stroke={`url(#${id}-extra)`}
                className="amp-anim amp-spill fill-none"
              />
            </svg>

            <div className="absolute inset-0 grid place-items-center">
              <span
                ref={figureTextRef}
                className="amp-figure text-[2.6rem] leading-none font-semibold tracking-tight text-brand-deep tabular-nums sm:text-5xl"
              >
                {multiple(factor)}
              </span>
            </div>
          </div>

          <ul className="grid max-w-xs gap-6">
            <LegendRow
              swatch="bg-linear-to-br from-[color-mix(in_srgb,var(--color-brand)_65%,white)] to-brand"
              title={legend.dollar.title}
              detail={legend.dollar.detail}
              delay="0.25s"
            />
            <LegendRow
              swatch="bg-brand-deep"
              title={legend.extra.title}
              detail={legend.extra.detail}
              delay="1.15s"
            />
          </ul>
        </div>

        <p
          className="amp-anim amp-rise mt-10 w-full border-t border-line pt-8 text-center text-lg font-semibold text-brand-deep sm:mt-12 sm:pt-10 sm:text-title"
          style={{ animationDelay: "1.9s" }}
        >
          {tagline}
        </p>
      </Fragment>
    </figure>
  );
}
