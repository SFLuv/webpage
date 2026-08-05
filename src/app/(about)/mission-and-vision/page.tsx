import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { Section } from "@/components/ui/Section";
import { missionContent } from "@/content/about";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Mission and Vision",
  description: missionContent.metaDescription,
  path: routes.missionAndVision
});

export default function MissionAndVisionPage() {
  const { mission, vision } = missionContent;

  return (
    <>
      <Section spacing="lg">
        <Panel padding="lg">
          <h1 className="text-headline">{mission.title}</h1>
          {mission.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-5 text-ink-muted">
              {paragraph}
            </p>
          ))}
        </Panel>
      </Section>

      <section className="pb-20">
        <Container>
          <h2 className="text-headline">{vision.title}</h2>
          <p className="mt-3 text-ink-muted">{vision.lead}</p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {vision.statements.map((statement) => (
              <li key={statement}>
                <Panel padding="md" className="flex h-full items-start gap-4">
                  <Image
                    className="size-9 shrink-0"
                    src={siteConfig.icon}
                    alt=""
                    width={512}
                    height={512}
                  />
                  <p className="text-ink-muted">{statement}</p>
                </Panel>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
