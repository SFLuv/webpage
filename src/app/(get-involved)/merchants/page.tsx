import { Section } from "@/components/ui/Section";
import { AudienceIntro } from "@/features/get-involved/AudienceIntro";
import { MerchantGrid } from "@/features/merchants/MerchantGrid";
import { MerchantMapPanel } from "@/features/merchants/MerchantMapSection";
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
      {/*
        The map sits inside the intro panel, under its heading and above the
        copy: someone landing here wants to see who already takes SFLuv before
        reading the pitch for joining. It carries no title of its own — the
        page's own heading already introduces it.
      */}
      <AudienceIntro page={merchantsContent}>
        <MerchantMapPanel heightClassName="h-[22rem] sm:h-[26rem]" />
      </AudienceIntro>

      <Section title="Our Merchants" spacing="md" width="wide">
        <MerchantGrid merchants={merchants} />
      </Section>
    </>
  );
}
