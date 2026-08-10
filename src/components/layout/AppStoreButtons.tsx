import Image from "next/image";
import { cn } from "@/lib/cn";
import { externalLinks } from "@/lib/site";

/** Both badges share a 3.375:1 artwork ratio, so one height fits both. */
const BADGE_HEIGHT = 44;
const BADGE_WIDTH = Math.round(BADGE_HEIGHT * 3.375);

const STORES = [
  {
    href: externalLinks.appStore.ios,
    badge: "/assets/app-store/apple-app-store.svg",
    label: "Download SFLuv on the App Store"
  },
  {
    href: externalLinks.appStore.android,
    badge: "/assets/app-store/google-play.svg",
    label: "Get SFLuv on Google Play"
  }
] as const;

/**
 * Official store badges linking to the SFLuv wallet app.
 *
 * The badges carry their own "Download on the App Store" / "Get it on Google
 * Play" wordmarks, so no adjacent text is added — that would duplicate what the
 * artwork already says. The accessible name conveys it for screen readers.
 *
 * `fit` shrinks both badges to share one row inside a narrow container. At
 * their natural width the pair overflows the mobile menu, and stacking them
 * wastes the height a drawer has least of — so they scale instead.
 */
export function AppStoreButtons({ className, fit = false }: { className?: string; fit?: boolean }) {
  return (
    <ul className={cn("flex gap-3", fit ? "flex-nowrap" : "flex-wrap", className)}>
      {STORES.map((store) => (
        <li key={store.href} className={cn("flex", fit && "min-w-0 flex-1")}>
          <a
            href={store.href}
            target="_blank"
            rel="noreferrer"
            aria-label={store.label}
            className={cn(
              "inline-flex rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-3 focus-visible:outline-brand-tint",
              fit && "w-full"
            )}
          >
            <Image
              src={store.badge}
              alt=""
              width={BADGE_WIDTH}
              height={BADGE_HEIGHT}
              className={cn(fit ? "h-auto w-full" : "h-11 w-auto")}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
