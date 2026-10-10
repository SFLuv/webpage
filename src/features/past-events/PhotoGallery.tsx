"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RemoteImage } from "@/features/volunteers/RemoteImage";
import type { PublicGalleryPhoto } from "@/lib/site-content/types";

/**
 * An event's photos as a grid, each with its caption if it has one; clicking a
 * photo opens it full size, with previous and next. Built on the native `<dialog>`, so focus is trapped and Escape
 * closes it without extra code. Arrow keys move between photos.
 */
export function PhotoGallery({ photos, title }: { photos: PublicGalleryPhoto[]; title: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  const show = useCallback((index: number) => {
    setOpen(index);
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  const step = useCallback(
    (delta: number) => setOpen((index) => (index === null ? index : (index + delta + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    const onClose = () => setOpen(null);
    dialog.addEventListener("keydown", onKey);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("keydown", onKey);
      dialog.removeEventListener("close", onClose);
    };
  }, [step]);

  const current = open === null ? null : photos[open];

  return (
    <>
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((photo, index) => (
          <li key={`${photo.url}-${index}`} className="mb-5 break-inside-avoid">
            <figure>
              <button
                type="button"
                onClick={() => show(index)}
                className="block w-full overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                aria-label={`Open photo ${index + 1} of ${photos.length}: ${photo.alt}`}
              >
                <RemoteImage
                  className="h-auto w-full transition-transform duration-300 hover:scale-[1.02]"
                  src={photo.url}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                />
              </button>
              {photo.caption ? <figcaption className="mt-2 text-sm text-ink-muted">{photo.caption}</figcaption> : null}
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={`${title}: photos`}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/85"
        onClick={(event) => {
          // A click on the dark backdrop (the dialog itself, not its contents) closes it.
          if (event.target === event.currentTarget) close();
        }}
      >
        {current ? (
          <figure className="flex max-h-[92vh] max-w-[94vw] flex-col items-center gap-3">
            <RemoteImage
              className="max-h-[80vh] w-auto max-w-[94vw] rounded-lg object-contain"
              src={current.url}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="94vw"
              priority
            />
            {current.caption ? <p className="max-w-2xl text-center text-sm text-white">{current.caption}</p> : null}
            <figcaption className="flex items-center gap-4 text-sm text-white">
              {photos.length > 1 ? (
                <button type="button" onClick={() => step(-1)} className="rounded-full bg-white/15 px-3 py-1.5 hover:bg-white/25">
                  ← Previous
                </button>
              ) : null}
              <span aria-live="polite">
                {open! + 1} of {photos.length}
              </span>
              {photos.length > 1 ? (
                <button type="button" onClick={() => step(1)} className="rounded-full bg-white/15 px-3 py-1.5 hover:bg-white/25">
                  Next →
                </button>
              ) : null}
              <button type="button" onClick={close} className="rounded-full bg-white/15 px-3 py-1.5 hover:bg-white/25">
                Close
              </button>
            </figcaption>
          </figure>
        ) : null}
      </dialog>
    </>
  );
}
