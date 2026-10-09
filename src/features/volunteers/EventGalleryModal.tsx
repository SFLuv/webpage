"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDownIcon, CloseIcon, DownloadIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { ImageAsset } from "@/content/types";

type EventGalleryModalProps = {
  title: string;
  date?: string;
  href?: string;
  images: ImageAsset[];
  onClose: () => void;
};

/** The file name a download lands under: the event, not `IMG_5413.jpg`. */
function downloadName(title: string, image: ImageAsset, index: number, total: number) {
  const slug = title
    .toLowerCase()
    .replace(/[’'"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const extension = image.src.split(".").pop()?.split("?")[0] ?? "jpg";
  const suffix = total > 1 ? `-${String(index + 1).padStart(2, "0")}` : "";
  return `sfluv-${slug}${suffix}.${extension}`;
}

/**
 * An archived event's photos, full size, with every one downloadable.
 *
 * Downloads point at the ORIGINAL file in `public/`, not at the `next/image`
 * URL the page renders: that one serves a resized webp, so saving it would hand
 * someone a thumbnail of their own event photo.
 */
export function EventGalleryModal({ title, date, href, images, onClose }: EventGalleryModalProps) {
  const [index, setIndex] = useState(0);
  const headingId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const total = images.length;
  const multiple = total > 1;
  const current = images[Math.min(index, total - 1)];

  const step = useCallback(
    (delta: number) => setIndex((value) => (value + delta + total) % total),
    [total]
  );

  // Escape closes; arrows page through. Bound to the document so the keys work
  // wherever focus happens to be inside the dialog.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (!multiple) return;
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [multiple, onClose, step]);

  // Hold the page still behind the dialog, and give focus somewhere useful.
  // The previously focused element gets it back on close, so a keyboard visitor
  // returns to the card they opened rather than the top of the page.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  // Keep Tab inside the dialog.
  const onKeyDownTrap = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 sm:p-6"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        onKeyDown={onKeyDownTrap}
        className="flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-panel bg-surface shadow-panel"
      >
        <header className="flex items-start justify-between gap-4 border-b border-ink/10 px-5 py-4">
          <div>
            <h2 id={headingId} className="text-title font-medium text-ink">
              {title}
            </h2>
            <p className="mt-1 text-sm text-ink-subtle">
              {date ? <span>{date}</span> : null}
              {date && multiple ? <span aria-hidden="true"> · </span> : null}
              {multiple ? <span>{total} photos</span> : null}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
          >
            <CloseIcon className="size-5 fill-current" />
          </button>
        </header>

        <div className="relative flex min-h-0 flex-1 items-center justify-center bg-ink/5 p-3">
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            sizes="(max-width: 1024px) 100vw, 896px"
            className="max-h-[60vh] w-auto rounded-xl object-contain"
          />

          {multiple ? (
            <>
              <NavButton side="left" label="Previous photo" onClick={() => step(-1)} />
              <NavButton side="right" label="Next photo" onClick={() => step(1)} />
            </>
          ) : null}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 px-5 py-4">
          {multiple ? (
            <div className="flex flex-wrap gap-2">
              {images.map((image, dot) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setIndex(dot)}
                  aria-label={`Show photo ${dot + 1}`}
                  aria-current={dot === index}
                  className={cn(
                    "size-12 overflow-hidden rounded-lg border-2 transition-colors",
                    dot === index ? "border-brand" : "border-transparent hover:border-brand-soft"
                  )}
                >
                  <Image
                    src={image.src}
                    alt=""
                    width={image.width}
                    height={image.height}
                    sizes="48px"
                    className="size-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : (
            <span aria-hidden="true" />
          )}

          <div className="flex flex-wrap items-center gap-2">
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full px-3 py-2 text-sm font-medium text-ink-muted underline-offset-4 hover:underline"
              >
                Event details
              </a>
            ) : null}

            <a
              href={current.src}
              download={downloadName(title, current, index, total)}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
            >
              <DownloadIcon className="size-4 fill-current" />
              {multiple ? "Download this photo" : "Download photo"}
            </a>

            {multiple ? <DownloadAll title={title} images={images} /> : null}
          </div>
        </footer>
      </div>
    </div>
  );
}

/**
 * Saves every photo in the gallery.
 *
 * One anchor click per file, spaced out. Browsers rate-limit a burst of
 * programmatic downloads from one gesture — Firefox in particular — so they go
 * one at a time with a gap, and the button reports progress rather than looking
 * broken while it works. Zipping them would be cleaner but needs a client-side
 * zip library, which is a lot of bytes for galleries this size.
 */
function DownloadAll({ title, images }: { title: string; images: ImageAsset[] }) {
  const [saving, setSaving] = useState(false);

  const saveAll = async () => {
    setSaving(true);
    for (const [position, image] of images.entries()) {
      const link = document.createElement("a");
      link.href = image.src;
      link.download = downloadName(title, image, position, images.length);
      document.body.append(link);
      link.click();
      link.remove();
      if (position < images.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
    setSaving(false);
  };

  return (
    <button
      type="button"
      onClick={() => void saveAll()}
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-70"
    >
      <DownloadIcon className="size-4 fill-current" />
      {saving ? "Saving…" : `Download all ${images.length}`}
    </button>
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
        side === "left" ? "left-4" : "right-4"
      )}
    >
      <ChevronDownIcon
        className={cn("size-5 fill-current", side === "left" ? "rotate-90" : "-rotate-90")}
      />
    </button>
  );
}
