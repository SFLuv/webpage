import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { TeamMemberCard } from "@/features/team/TeamMemberCard";
import { teamSections, type TeamMember } from "@/content/team";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "Our Team",
  description: "The people behind SFLuv: our staff, board, and advisors.",
  path: routes.ourTeam
});

/**
 * "Beth O’Leary, CPA/MPA" → sorts as "oleary beth": last name, then first,
 * ignoring credentials after the comma and apostrophes.
 */
function sortKey(member: TeamMember): string {
  const name = member.name.split(",")[0].trim();
  if (member.sortSurname) {
    const first = name.replace(member.sortSurname, "").trim();
    return `${member.sortSurname} ${first}`.toLowerCase().replace(/[’'.]/g, "");
  }
  const words = name.split(/\s+/);
  const last = words[words.length - 1];
  return `${last} ${words.slice(0, -1).join(" ")}`.toLowerCase().replace(/[’'.]/g, "");
}

/** A member marked `leadsSection` comes first; everyone else by last name. */
const byLastName = (a: TeamMember, b: TeamMember) =>
  Number(Boolean(b.leadsSection)) - Number(Boolean(a.leadsSection)) || sortKey(a).localeCompare(sortKey(b));

export default function OurTeamPage() {
  return (
    <>
      <PageHeader title="Our Team" />

      {teamSections.map((section) => {
        const headingId = `team-${section.title.toLowerCase().replace(/\s+/g, "-")}`;
        return (
          <section key={section.title} className="py-8" aria-labelledby={headingId}>
            <Container width="wide">
              <h2 id={headingId} className="mb-6 text-headline">
                {section.title}
              </h2>
              {/* Every row the height of the tallest tile, so a long name or title never makes one tile bigger than the rest. */}
              <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...section.members].sort(byLastName).map((member) => (
                  <TeamMemberCard key={member.name} member={member} />
                ))}
              </div>
            </Container>
          </section>
        );
      })}
    </>
  );
}
