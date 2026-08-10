import { Pin } from "@vis.gl/react-google-maps";

import { cn } from "@/lib/cn";
import type { OpenState } from "@/lib/merchants/hours";
import { merchantGradient, merchantInitials, pinColor } from "@/lib/merchants/icon";

/**
 * Default pin scale.
 *
 * Google's pin at scale 1 leaves a glyph slot too small to read a logo in. 1.5
 * is the smallest that gives the mark room without the pins colliding on a
 * dense block. Matches the wallet app so the same merchant looks the same on
 * both maps.
 */
const PIN_SCALE = 1.5;

/** Glyph diameter in CSS pixels, sized to sit inside the pin head. */
const GLYPH_SIZE = 22;

type MerchantIconProps = {
  name: string;
  iconUrl?: string;
  /** Rendered edge length in pixels. */
  size?: number;
  className?: string;
  /** Drains the colour out of a mark for a closed merchant. */
  muted?: boolean;
};

/**
 * A merchant's square mark: their upload when they have one, otherwise a
 * generated initials tile.
 *
 * The generated tile is not a placeholder awaiting a real logo — most merchants
 * will never upload one, and a map of identical grey dots is worse than a map
 * of distinct, on-brand initials.
 */
export function MerchantIcon({ name, iconUrl, size = 40, className, muted = false }: MerchantIconProps) {
  const trimmed = (iconUrl ?? "").trim();

  if (trimmed !== "") {
    return (
      // Plain <img>: these are merchant uploads served from the API origin,
      // which next/image would need allow-listed per host.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={trimmed}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className={cn("h-full w-full object-cover", muted && "opacity-90 grayscale-[0.65]", className)}
      />
    );
  }

  const [from, to] = merchantGradient(name);
  const initials = merchantInitials(name);

  return (
    <div
      aria-hidden
      className={cn(
        "flex h-full w-full items-center justify-center leading-none font-semibold text-white",
        muted && "grayscale-[0.7]",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        // Two characters need to fit inside a circle that is mostly padding.
        fontSize: Math.max(9, Math.round(size * (initials.length > 1 ? 0.38 : 0.48)))
      }}
    >
      {initials}
    </div>
  );
}

type MerchantPinProps = {
  name: string;
  iconUrl?: string;
  state: OpenState;
  scale?: number;
};

/**
 * The map pin.
 *
 * Google's own PinElement carries the silhouette, shadow, anchor point and
 * z-ordering; we supply the colour and the glyph. Hand-drawing the teardrop is
 * possible but pointless — the proportions and the way it scales are exactly
 * the part a designed component gets right and a hand-rolled SVG does not.
 *
 * Must be rendered inside an AdvancedMarker: Pin reaches for that context.
 */
export function MerchantPin({ name, iconUrl, state, scale = PIN_SCALE }: MerchantPinProps) {
  return (
    <Pin background={pinColor(state)} borderColor="#ffffff" glyphColor="#ffffff" scale={scale}>
      <div className="overflow-hidden rounded-full bg-surface" style={{ width: GLYPH_SIZE, height: GLYPH_SIZE }}>
        <MerchantIcon name={name} iconUrl={iconUrl} size={GLYPH_SIZE} muted={state === "closed"} />
      </div>
    </Pin>
  );
}

/**
 * The open/closed line on a merchant card.
 *
 * The dot pulses only while open. A steady dot beside "Open now" reads as a
 * status light that might be stale; a pulsing one reads as live, which it is —
 * recomputed against the clock every minute.
 */
export function OpenStatusBadge({ state, className }: { state: OpenState; className?: string }) {
  if (state === "unknown") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-sm text-ink-subtle", className)}>
        <span className="size-2 rounded-full bg-ink-subtle/40" />
        Hours not available
      </span>
    );
  }

  const open = state === "open";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium",
        open ? "text-brand-deep" : "text-ink-subtle",
        className
      )}
    >
      <span className="relative flex size-2">
        {open ? <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75" /> : null}
        <span className={cn("relative inline-flex size-2 rounded-full", open ? "bg-brand" : "bg-ink-subtle/50")} />
      </span>
      {open ? "Open now" : "Closed"}
    </span>
  );
}
