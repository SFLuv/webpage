import Image from "next/image";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site";

/**
 * Stand-in for an event with no cover photo.
 *
 * Occupies exactly the same box as a real image so a photo-less event never
 * makes its card shorter than its neighbours. Styled rather than blank — a
 * plain grey box reads as a failed image, which is worse than an obviously
 * deliberate placeholder.
 */
export function EventImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center overflow-hidden",
        "bg-[linear-gradient(135deg,var(--color-brand)_0%,var(--color-brand-soft)_55%,var(--color-surface-muted)_100%)]",
        className
      )}
    >
      {/* The SFLuv mark, already served on every page, so it is warm in cache. */}
      <Image
        src={siteConfig.logo}
        alt=""
        width={512}
        height={512}
        className="h-1/2 w-auto opacity-60 mix-blend-luminosity"
      />
    </div>
  );
}
