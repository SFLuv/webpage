import type { CoverPhoto } from "@/lib/volunteer-events/types";
import { RemoteImage } from "./RemoteImage";

/**
 * Cover photos for an event. One photo fills the width; several become a grid.
 * Renders nothing when the event has no photos.
 */
export function CoverPhotoGallery({ photos, title }: { photos: CoverPhoto[]; title: string }) {
  if (photos.length === 0) return null;

  if (photos.length === 1) {
    return (
      <RemoteImage
        src={photos[0].url}
        alt={`${title} cover photo`}
        width={photos[0].width}
        height={photos[0].height}
        sizes="(max-width: 1024px) 100vw, 900px"
        priority
        className="aspect-[16/9] w-full rounded-panel object-cover"
      />
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3">
      {photos.map((photo, index) => (
        <li key={photo.url} className={index === 0 ? "col-span-2" : undefined}>
          <RemoteImage
            src={photo.url}
            alt={`${title} photo ${index + 1}`}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 1024px) 100vw, 450px"
            priority={index === 0}
            className={`w-full rounded-panel object-cover ${index === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}
          />
        </li>
      ))}
    </ul>
  );
}
