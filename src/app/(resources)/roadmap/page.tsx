import { PageHeader } from "@/components/ui/PageHeader";
import { roadmapContent } from "@/content/forms";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: roadmapContent.title,
  description: "What is next for SFLuv.",
  path: routes.roadmap
});

export default function RoadmapPage() {
  return <PageHeader title={roadmapContent.title} lead={roadmapContent.body} />;
}
