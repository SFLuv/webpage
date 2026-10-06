import Image from "next/image";
import { RichDocument } from "@/components/content/RichDocument";
import { Panel } from "@/components/ui/Panel";
import { Prose } from "@/components/ui/Prose";
import type { TeamMember } from "@/content/team";

const PHOTO_CLASSES = "aspect-square w-full rounded-2xl";

/** Neutral stand-in until we have someone's photo. */
function PhotoPlaceholder() {
  return (
    <div className={`${PHOTO_CLASSES} flex items-end justify-center overflow-hidden bg-surface-muted`} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="w-3/4 fill-ink-subtle/35">
        <circle cx="50" cy="36" r="20" />
        <path d="M10 100c0-24 18-40 40-40s40 16 40 40z" />
      </svg>
    </div>
  );
}

/**
 * One person: photo on top, words below (the layout the copy deck asks for).
 * The photo, bio and role are each optional; the card simply leaves out what
 * we do not have yet.
 */
export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Panel padding="sm" as="article" className="flex flex-col gap-4">
      {member.photo ? (
        <Image
          className={`${PHOTO_CLASSES} object-cover object-[center_20%]`}
          src={member.photo.src}
          alt={member.photo.alt}
          width={member.photo.width}
          height={member.photo.height}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
        />
      ) : (
        <PhotoPlaceholder />
      )}

      <div className="min-w-0">
        <h3 className="text-title font-medium">{member.name}</h3>
        {member.role ? <p className="mt-1 text-sm text-ink-subtle">{member.role}</p> : null}

        {member.bio?.length ? (
          <Prose className="mt-3 text-sm">
            <RichDocument blocks={member.bio} />
          </Prose>
        ) : null}

        {member.links?.length ? (
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
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
    </Panel>
  );
}
