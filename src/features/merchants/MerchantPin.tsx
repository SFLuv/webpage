import { cn } from "@/lib/cn";
import type { OpenState } from "@/lib/merchants/hours";
import {
  ICON_TEXT_COLOR,
  PIN_GLYPH_INSET_RATIO,
  PIN_GLYPH_RATIO,
  PIN_HEAD_CENTRE,
  PIN_PATH,
  PIN_VIEWBOX_HEIGHT,
  PIN_VIEWBOX_WIDTH,
  PIN_WIDTH,
  iconFaceColor,
  merchantInitials,
  pinColor
} from "@/lib/merchants/icon";

type MerchantIconProps = {
  name: string;
  iconUrl?: string;
  /** Rendered edge length in pixels. */
  size?: number;
  className?: string;
  /** Open state, which decides the face colour behind a generated mark. */
  state?: OpenState;
};

/**
 * A merchant's square mark: their upload when they have one, otherwise a
 * generated initials tile.
 *
 * The generated tile is not a placeholder awaiting a real logo — most merchants
 * will never upload one, and a map of identical grey dots is worse than a map
 * of distinct initials on a clean white face.
 */
export function MerchantIcon({ name, iconUrl, size = 40, className, state = "open" }: MerchantIconProps) {
  const trimmed = (iconUrl ?? "").trim();
  const closed = state === "closed";

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
        className={cn("h-full w-full object-cover", closed && "opacity-90 grayscale-[0.65]", className)}
      />
    );
  }

  const initials = merchantInitials(name);

  return (
    <div
      aria-hidden
      className={cn("flex h-full w-full items-center justify-center leading-none font-bold", className)}
      style={{
        backgroundColor: iconFaceColor(state),
        color: ICON_TEXT_COLOR,
        // Two characters need to fit inside a circle that is mostly padding.
        fontSize: Math.max(8, Math.round(size * (initials.length > 1 ? 0.4 : 0.5))),
        letterSpacing: "-0.01em"
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
  /** Rendered pin width in pixels; height follows the silhouette's ratio. */
  width?: number;
};

/**
 * The map pin.
 *
 * A teardrop in the merchant's state colour with their mark set into the head.
 * Drawn here rather than with Google's PinElement because that shape is fixed:
 * it cannot be made shorter, and it finishes on a needle point that reads badly
 * at this size against a busy street map.
 */
export function MerchantPin({ name, iconUrl, state, width = PIN_WIDTH }: MerchantPinProps) {
  const height = Math.round((width * PIN_VIEWBOX_HEIGHT) / PIN_VIEWBOX_WIDTH);
  const unit = width / PIN_VIEWBOX_WIDTH;
  const glyphSize = Math.round(width * PIN_GLYPH_RATIO);
  const inset = Math.max(1, Math.round(glyphSize * PIN_GLYPH_INSET_RATIO));

  return (
    <div className="relative" style={{ width, height }}>
      <svg
        viewBox={`0 0 ${PIN_VIEWBOX_WIDTH} ${PIN_VIEWBOX_HEIGHT}`}
        width={width}
        height={height}
        className="absolute inset-0"
        style={{ filter: "drop-shadow(0 1px 2px rgb(11 48 59 / 0.35))" }}
        aria-hidden
      >
        <path d={PIN_PATH} fill={pinColor(state)} stroke="#ffffff" strokeWidth={1.2} />
      </svg>
      <div
        className="absolute overflow-hidden rounded-full"
        style={{
          width: glyphSize,
          height: glyphSize,
          left: PIN_HEAD_CENTRE.x * unit - glyphSize / 2,
          top: PIN_HEAD_CENTRE.y * unit - glyphSize / 2,
          backgroundColor: iconFaceColor(state),
          // The inset keeps the pin's white rim visible around the artwork,
          // which is what separates the mark from the map behind it.
          padding: inset
        }}
      >
        <div className="h-full w-full overflow-hidden rounded-full">
          <MerchantIcon name={name} iconUrl={iconUrl} size={glyphSize - inset * 2} state={state} />
        </div>
      </div>
    </div>
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
