import { LegalPage } from "@/features/legal/LegalPage";
import { privacyPolicy } from "@/content/legal/privacy-policy";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: privacyPolicy.title,
  description: privacyPolicy.summary,
  path: routes.privacyPolicy
});

export default function PrivacyPolicyPage() {
  return <LegalPage document={privacyPolicy} />;
}
