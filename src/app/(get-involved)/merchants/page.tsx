import { Section } from "@/components/ui/Section";
import { AudienceIntro } from "@/features/get-involved/AudienceIntro";
import { MerchantGrid } from "@/features/merchants/MerchantGrid";
import { merchants, merchantsContent } from "@/content/get-involved";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: merchantsContent.title,
  description: merchantsContent.metaDescription,
  path: routes.merchants
});

export default function MerchantsPage() {
  return (
    <>
      <AudienceIntro page={merchantsContent} />

      <Section title="Our Merchants" spacing="md" width="wide">
        <MerchantGrid merchants={merchants} />
      </Section>
    </>
  );
}
