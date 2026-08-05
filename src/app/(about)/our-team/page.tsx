import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { TeamMemberCard } from "@/features/team/TeamMemberCard";
import { teamMembers } from "@/content/team";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "Our Team",
  description: "The people building SFLuv: leadership, advisors, and engineering.",
  path: routes.ourTeam
});

export default function OurTeamPage() {
  return (
    <>
      <PageHeader title="Our Team" />

      <section className="py-10">
        <Container>
          <div className="flex flex-col gap-6">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
