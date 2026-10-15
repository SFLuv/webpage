"use client";

import Image from "next/image";
import { useRef } from "react";
import type { BlockNode, InlineNode } from "@/components/content/document";
import { RichDocument } from "@/components/content/RichDocument";
import { Panel } from "@/components/ui/Panel";
import { Prose } from "@/components/ui/Prose";
import { cn } from "@/lib/cn";
import type { TeamMember } from "@/content/team";

/** Neutral stand-in until we have someone's photo. */
function PhotoPlaceholder({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-end justify-center overflow-hidden bg-surface-muted", className)} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="w-3/4 fill-ink-subtle/35">
        <circle cx="50" cy="36" r="20" />
        <path d="M10 100c0-24 18-40 40-40s40 16 40 40z" />
      </svg>
    </div>
  );
}

function Photo({ member, className, sizes }: { member: TeamMember; className: string; sizes: string }) {
  return member.photo ? (
    <Image
      className={cn("object-cover object-[center_20%]", className)}
      src={member.photo.src}
      alt={member.photo.alt}
      width={member.photo.width}
      height={member.photo.height}
      sizes={sizes}
    />
  ) : (
    <PhotoPlaceholder className={className} />
  );
}

/** A bio's words without its links, for the preview on the tile (a link can't sit inside the tile's button). */
function plainText(blocks: BlockNode[]): string {
  const inline = (nodes: InlineNode[]): string =>
    nodes.map((node) => (typeof node === "string" ? node : inline(node.children))).join("");
  return blocks
    .map((block) => (block.type === "list" ? block.items.map(inline).join(" ") : inline(block.children)))
    .join(" ")
    .trim();
}

/**
 * One person. The tile shows only their photo, name and title. Hovering (or
 * focusing) it lifts the tile and brings up a preview of their bio over the
 * photo; clicking opens their full card, with the whole bio and any links, in
 * a dialog. Built on the native `<dialog>`, so Escape closes it and focus is
 * kept inside while it is open. On touch screens, where there is no hover, a
 * tap goes straight to the full card.
 */
export function TeamMemberCard({ member }: { member: TeamMember }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const preview = member.bio?.length ? plainText(member.bio) : "";

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-haspopup="dialog"
        className="group block h-full w-full rounded-panel text-left transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        <Panel
          padding="sm"
          as="article"
          className="flex h-full flex-col gap-4 transition-shadow duration-200 group-hover:shadow-lg group-focus-visible:shadow-lg"
        >
          <div className="relative overflow-hidden rounded-2xl">
            <Photo
              member={member}
              className="aspect-square w-full rounded-2xl"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            />
            {preview ? (
              <div
                aria-hidden="true"
                className="absolute inset-0 flex translate-y-3 flex-col justify-end bg-surface/95 p-4 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
              >
                <p className="line-clamp-[9] text-sm text-ink-muted">{preview}</p>
                <p className="mt-2 text-sm font-medium text-brand-deep">Read more</p>
              </div>
            ) : null}
          </div>

          {/* The same room for every name and title (up to 2 lines of name, 3 of title), so tiles match across sections. */}
          <div className="min-h-[7.75rem] min-w-0">
            <h3 className="text-title font-medium text-ink">{member.name}</h3>
            {member.role ? <p className="mt-1 text-sm text-ink-subtle">{member.role}</p> : null}
          </div>
        </Panel>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={member.name}
        className="m-auto w-[min(42rem,calc(100vw-2rem))] max-w-none rounded-panel bg-surface p-0 text-ink shadow-xl backdrop:bg-black/50"
        onClick={(event) => {
          // A click on the dimmed backdrop (the dialog itself, not its contents) closes it.
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="flex max-h-[85vh] flex-col gap-5 overflow-y-auto p-5 sm:flex-row sm:p-6">
          <div className="w-40 shrink-0 sm:w-48">
            <Photo member={member} className="aspect-square w-full rounded-2xl" sizes="192px" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-title font-medium">{member.name}</h3>
                {member.role ? <p className="mt-1 text-sm text-ink-subtle">{member.role}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="shrink-0 rounded-full px-3 py-1 text-sm font-medium text-ink-muted hover:bg-surface-muted"
              >
                Close
              </button>
            </div>

            {member.bio?.length ? (
              <Prose className="mt-4 text-sm">
                <RichDocument blocks={member.bio} />
              </Prose>
            ) : null}

            {member.links?.length ? (
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {member.links.map((link) => (
                  <li key={link.href}>
                    <a
                      className="font-medium text-brand-deep underline underline-offset-2 hover:text-brand"
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
