import type { HowItWorksStep } from "@/content/about";

const NODE = 30;

/*
 * Two layouts. Wide screens get the labels around the ring; on a phone those
 * would shrink to a few pixels, so the compact one fills the width with a
 * bigger ring and just the numbers, which match the step cards below it.
 */
const LAYOUTS = {
  wide: { width: 680, height: 490, cx: 340, cy: 230, r: 150, labels: true },
  compact: { width: 360, height: 340, cx: 180, cy: 170, r: 128, labels: false }
} as const;

type Layout = (typeof LAYOUTS)[keyof typeof LAYOUTS];

/** A point on the ring, `deg` degrees clockwise from the top. */
function onRing(layout: Layout, deg: number) {
  const t = (deg * Math.PI) / 180;
  return { x: layout.cx + layout.r * Math.sin(t), y: layout.cy - layout.r * Math.cos(t) };
}

/** The ring as a path from the top, clockwise: the route the travelling dot follows. */
function ringPath({ cx, cy, r }: Layout) {
  return `M${cx},${cy - r} a${r},${r} 0 1,1 0,${2 * r} a${r},${r} 0 1,1 0,${-2 * r}`;
}

/** Where each step's label sits relative to its stop: above, right, below, left. */
const LABELS = [
  { dx: 0, dy: -NODE - 30, anchor: "middle" },
  { dx: NODE + 12, dy: -6, anchor: "start" },
  { dx: 0, dy: NODE + 26, anchor: "middle" },
  { dx: -NODE - 12, dy: -6, anchor: "end" }
] as const;

/**
 * The four steps as a loop, after the Amplification Wheel in the annual
 * report. A dot travels the ring to show money moving through the
 * neighborhood; it is hidden for visitors who ask for reduced motion.
 */
export function AmplificationLoop({ steps }: { steps: HowItWorksStep[] }) {
  const description = steps.map((step, i) => `${i + 1}. ${step.title}`).join(", then ");
  const label = `A loop of four steps: ${description}, and back to the start.`;

  return (
    <>
      <Loop steps={steps} layout={LAYOUTS.wide} label={label} className="hidden max-w-3xl sm:block" />
      <Loop steps={steps} layout={LAYOUTS.compact} label={label} className="max-w-sm sm:hidden" />
    </>
  );
}

function Loop({ steps, layout, label, className }: { steps: HowItWorksStep[]; layout: Layout; label: string; className: string }) {
  const ring = ringPath(layout);
  const { cx: CX, cy: CY } = layout;

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className={`mx-auto h-auto w-full ${className}`}
      role="img"
      aria-label={label}
    >
      <path d={ring} className="fill-none stroke-brand-soft" strokeWidth={10} />

      {/* Arrows between the stops, pointing the way money moves. */}
      {[45, 135, 225, 315].map((deg) => {
        const { x, y } = onRing(layout, deg);
        return (
          <path
            key={deg}
            d="M-7,-9 L7,0 L-7,9"
            transform={`translate(${x} ${y}) rotate(${deg})`}
            className="fill-none stroke-brand"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}

      <g className="motion-reduce:hidden">
        <circle r={8} className="fill-brand">
          <animateMotion dur="9s" repeatCount="indefinite" path={ring} />
        </circle>
      </g>

      {steps.slice(0, 4).map((step, i) => {
        const { x, y } = onRing(layout, i * 90);
        const placement = LABELS[i];
        return (
          <g key={step.title}>
            <circle cx={x} cy={y} r={NODE} className="fill-surface stroke-brand" strokeWidth={3} />
            <text x={x} y={y + 7} textAnchor="middle" className="fill-brand-deep text-[22px] font-semibold">
              {i + 1}
            </text>
            {layout.labels ? (
              <text x={x + placement.dx} y={y + placement.dy} textAnchor={placement.anchor} className="fill-ink text-[17px] font-medium">
                <tspan x={x + placement.dx}>{step.loopLabel[0]}</tspan>
                <tspan x={x + placement.dx} dy={21}>
                  {step.loopLabel[1]}
                </tspan>
              </text>
            ) : null}
            {layout.labels && step.impact ? (
              <text
                x={x + placement.dx}
                y={y + placement.dy + 44}
                textAnchor={placement.anchor}
                className="fill-brand-deep text-[12px] font-semibold tracking-wider uppercase"
              >
                {step.impact}
              </text>
            ) : null}
          </g>
        );
      })}

      <text x={CX} y={CY - 4} textAnchor="middle" className="fill-ink text-[18px] font-medium">
        One contribution,
      </text>
      <text x={CX} y={CY + 22} textAnchor="middle" className="fill-brand-deep text-[18px] font-semibold">
        two impacts
      </text>
    </svg>
  );
}
