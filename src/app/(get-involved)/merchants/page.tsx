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
        The map sits inside the intro panel, directly under its heading, and
        does the job the prose used to: someone landing here wants to see who
        already takes SFLuv, not read the pitch for joining. It carries no
        title of its own — the page's heading already introduces it — and a
        border to separate it from the white panel behind it.
      */}
      <AudienceIntro page={merchantsContent} showBody={false}>
        <MerchantMapPanel heightClassName="h-[22rem] sm:h-[26rem]" className="border border-line" />
      </AudienceIntro>

      <Section title="Our Merchants" spacing="md" width="wide">
        <MerchantGrid merchants={merchants} />
      </Section>
    </>
  );
}
