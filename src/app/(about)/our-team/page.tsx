import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { TeamMemberCard } from "@/features/team/TeamMemberCard";
import { teamSections } from "@/content/team";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "Our Team",
  description: "The people behind SFLuv: our staff, board, and advisors.",
  path: routes.ourTeam
});

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
              <div className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {section.members.map((member) => (
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
