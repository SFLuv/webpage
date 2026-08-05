import Image from "next/image";
import type { Partner } from "@/content/home";

/**
 * How many copies of the partner list make up each half of the track.
 *
 * The animation loops by sliding exactly one half-width, so a half has to be at
 * least as wide as the viewport or a gap opens at the seam. Three passes covers
 * the widest layout comfortably.
 */
const PASSES_PER_HALF = 3;

function PartnerLogo({ partner, decorative }: { partner: Partner; decorative?: boolean }) {
  return (
    <li className="shrink-0">
      <a
        className="flex items-center px-8 opacity-80 transition-opacity duration-200 hover:opacity-100"
        href={partner.href}
        target="_blank"
        rel="noreferrer"
        // Repeated passes are aria-hidden, so their links must leave the tab order.
        tabIndex={decorative ? -1 : undefined}
      >
        {/*
          A fixed box gives every logo the same footprint. Scaling by height
          alone would blow up wide wordmarks like INTN.CITY next to logos with
          tall glyphs, which is why the original banner sized them by width.
        */}
        <span className="flex h-14 w-36 items-center justify-center sm:w-44">
          <Image
            className="max-h-full w-auto max-w-full object-contain"
            src={partner.logo.src}
            alt={partner.logo.alt}
            width={partner.logo.width}
            height={partner.logo.height}
            // Repeats scroll in from offscreen, where a lazy loader would never
            // fire. Only three files back the whole strip, so eager is cheap.
            loading="eager"
          />
        </span>
      </a>
    </li>
  );
}

/**
 * Continuously scrolling strip of partner logos.
 *
 * Pure CSS — needs no JavaScript, pauses on hover or keyboard focus, and
 * collapses to a single static row when the visitor prefers reduced motion.
 * Only the first pass is exposed to assistive tech; the rest are visual filler.
 */
export function PartnerCarousel({ partners, label }: { partners: Partner[]; label: string }) {
  const passes = Array.from({ length: PASSES_PER_HALF * 2 }, (_, index) => index);

  return (
    <div className="marquee" role="region" aria-label={label}>
      <div className="marquee__track">
        {passes.map((pass) => (
          <ul key={pass} className="marquee__group" aria-hidden={pass === 0 ? undefined : true}>
            {partners.map((partner) => (
              <PartnerLogo key={partner.name} partner={partner} decorative={pass !== 0} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
