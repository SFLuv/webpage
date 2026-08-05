import { cn } from "@/lib/cn";

type RemoteImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Image served from the events API.
 *
 * Deliberately a plain `<img>` rather than `next/image`: image optimization is
 * already disabled project-wide, so `next/image` would add nothing here except
 * a hard dependency on declaring the API's image hosts in `next.config.mjs` —
 * which would turn a backend CDN change into a build failure on the public
 * marketing site. Dimensions are still passed so the box is reserved and
 * nothing shifts on load.
 *
 * If image optimization is ever switched on, this is the one file to change.
 */
export function RemoteImage({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  priority
}: RemoteImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("bg-surface-muted", className)}
    />
  );
}
