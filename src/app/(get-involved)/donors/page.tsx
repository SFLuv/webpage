import { AudienceIntro } from "@/features/get-involved/AudienceIntro";
import { donorsContent } from "@/content/get-involved";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: donorsContent.title,
  description: donorsContent.metaDescription,
  path: routes.donors
});

export default function DonorsPage() {
  return <AudienceIntro page={donorsContent} />;
}
