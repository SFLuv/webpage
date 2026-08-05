import { AudienceIntro } from "@/features/get-involved/AudienceIntro";
import { communityContent } from "@/content/get-involved";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: communityContent.title,
  description: communityContent.metaDescription,
  path: routes.community
});

export default function CommunityPage() {
  return <AudienceIntro page={communityContent} />;
}
