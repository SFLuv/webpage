import { Section } from "@/components/ui/Section";
import { AudienceIntro } from "@/features/get-involved/AudienceIntro";
import { MerchantGrid } from "@/features/merchants/MerchantGrid";
import { MerchantMapSection } from "@/features/merchants/MerchantMapSection";
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
      {/* The map leads: someone landing here wants to see who already takes
          SFLuv before reading the pitch for joining. */}
      <MerchantMapSection spacing="sm" />

      <AudienceIntro page={merchantsContent} />

      <Section title="Our Merchants" spacing="md" width="wide">
        <MerchantGrid merchants={merchants} />
      </Section>
    </>
  );
}
