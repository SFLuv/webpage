import Image from "next/image";
import { RichDocument } from "@/components/content/RichDocument";
import { Panel } from "@/components/ui/Panel";
import { Prose } from "@/components/ui/Prose";
import type { TeamMember } from "@/content/team";

export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Panel padding="lg" as="article" className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <Image
        className="mx-auto size-40 shrink-0 rounded-2xl object-cover sm:mx-0"
        src={member.photo.src}
        alt={member.photo.alt}
        width={member.photo.width}
        height={member.photo.height}
      />

      <div className="min-w-0">
        <h2 className="text-title font-medium">
          {member.name}
          <span className="text-ink-subtle"> — {member.role}</span>
        </h2>

        <Prose className="mt-2">
          <RichDocument blocks={member.bio} />
        </Prose>

        {member.links?.length ? (
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
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
