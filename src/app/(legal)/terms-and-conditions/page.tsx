import { LegalPage } from "@/features/legal/LegalPage";
import { termsAndConditions } from "@/content/legal/terms-and-conditions";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: termsAndConditions.title,
  description: termsAndConditions.summary,
  path: routes.termsAndConditions
});

export default function TermsAndConditionsPage() {
  return <LegalPage document={termsAndConditions} />;
}
