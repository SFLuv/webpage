"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { CoverPhoto } from "@/lib/volunteer-events/types";
import { EventImagePlaceholder } from "./EventImagePlaceholder";
import { RemoteImage } from "./RemoteImage";

type CoverPhotoGalleryProps = {
  photos: CoverPhoto[];
  title: string;
};

/**
 * Cover photos for an event.
 *
 * One photo renders on its own; several become a click-through carousel rather
 * than a grid, so the first image keeps the same prominence either way. Events
 * with no photo get the styled placeholder at the same size, so the page never
 * reflows depending on whether an organizer uploaded anything.
 */
export function CoverPhotoGallery({ photos, title }: CoverPhotoGalleryProps) {
  const [index, setIndex] = useState(0);

  if (photos.length === 0) {
    return <EventImagePlaceholder className="aspect-[16/9] w-full rounded-panel" />;
  }

  const current = photos[Math.min(index, photos.length - 1)];
  const multiple = photos.length > 1;

  const step = (delta: number) =>
    setIndex((value) => (value + delta + photos.length) % photos.length);

  return (
    <div className="relative">
      <RemoteImage
        src={current.url}
        alt={`${title} — photo ${index + 1} of ${photos.length}`}
        width={current.width}
        height={current.height}
        sizes="(max-width: 1024px) 100vw, 900px"
        priority
        className="aspect-[16/9] w-full rounded-panel object-cover"
      />

      {multiple ? (
        <>
          <NavButton side="left" label="Previous photo" onClick={() => step(-1)} />
          <NavButton side="right" label="Next photo" onClick={() => step(1)} />

          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
            {photos.map((photo, dot) => (
              <button
                key={photo.url}
                type="button"
                onClick={() => setIndex(dot)}
                aria-label={`Show photo ${dot + 1}`}
                aria-current={dot === index}
                className={cn(
                  "size-2.5 rounded-full transition-colors",
                  dot === index ? "bg-white" : "bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function NavButton({
  side,
  label,
  onClick
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full",
        "bg-surface/90 text-ink shadow-panel transition-colors hover:bg-surface",
        side === "left" ? "left-3" : "right-3"
      )}
    >
      {/* One chevron asset, rotated to point either way. */}
      <ChevronDownIcon
        className={cn("size-5 fill-current", side === "left" ? "rotate-90" : "-rotate-90")}
      />
    </button>
  );
}
