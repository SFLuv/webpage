import { AudienceIntro } from "@/features/get-involved/AudienceIntro";
import { improversContent } from "@/content/get-involved";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: improversContent.title,
  description: improversContent.metaDescription,
  path: routes.improvers
});

export default function ImproversPage() {
  return <AudienceIntro page={improversContent} />;
}
