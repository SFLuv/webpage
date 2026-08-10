import { cn } from "@/lib/cn";
import type { OpenState } from "@/lib/merchants/hours";
import { merchantGradient, merchantInitials, pinColor } from "@/lib/merchants/icon";

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
  /** Pin width in pixels; the height follows the silhouette's ratio. */
  size?: number;
};

/**
 * The map pin: a teardrop in the merchant's state colour with their mark inset
 * at the top. Brand red while open, muted slate while shut, so the map answers
 * "can I go there now?" before anything is clicked.
 */
export function MerchantPin({ name, iconUrl, state, size = 40 }: MerchantPinProps) {
  const color = pinColor(state);
  const height = Math.round(size * 1.2);
  const iconSize = Math.round(size * 0.68);

  return (
    <div className="relative" style={{ width: size, height }}>
      <svg
        viewBox="0 0 38 46"
        width={size}
        height={height}
        className="absolute inset-0"
        style={{ filter: "drop-shadow(0 2px 3px rgb(11 48 59 / 0.35))" }}
        aria-hidden
      >
        <path
          d="M19 45.5C19 45.5 3.5 27.6 3.5 17.5a15.5 15.5 0 1 1 31 0C34.5 27.6 19 45.5 19 45.5Z"
          fill={color}
          stroke="#ffffff"
          strokeWidth="2"
        />
      </svg>
      <div
        className="absolute overflow-hidden rounded-full bg-surface"
        style={{
          width: iconSize,
          height: iconSize,
          left: "50%",
          top: size * 0.1,
          transform: "translateX(-50%)"
        }}
      >
        <MerchantIcon name={name} iconUrl={iconUrl} size={iconSize} muted={state === "closed"} />
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
