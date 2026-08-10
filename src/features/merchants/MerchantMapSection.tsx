import { Section } from "@/components/ui/Section";
import { getMerchants } from "@/lib/merchants/client";
import { mapConfigured } from "@/lib/merchants/config";
import { MerchantMap } from "./MerchantMap";

type MerchantMapPanelProps = {
  heightClassName?: string;
  className?: string;
};

/**
 * The merchant map with its own data fetch, and nothing around it.
 *
 * A server component so the merchant list is fetched and cached on the server —
 * the browser gets the pins, not the round trip. Renders nothing when there is
 * no map to show (Maps unconfigured, or the API returned nothing), so a caller
 * can drop it into a layout without leaving a hole when it has nothing to say.
 */
export async function MerchantMapPanel({ heightClassName, className }: MerchantMapPanelProps) {
  if (!mapConfigured()) return null;

  const merchants = await getMerchants();
  if (merchants.length === 0) return null;

  return <MerchantMap merchants={merchants} heightClassName={heightClassName} className={className} />;
}

type MerchantMapSectionProps = MerchantMapPanelProps & {
  title?: string;
  lead?: string;
  spacing?: "sm" | "md" | "lg";
};

/**
 * The map as a titled band of its own, for pages with no surrounding copy to
 * introduce it. Where a page already has a heading — the merchants page —
 * use MerchantMapPanel inside it instead of stacking two titles.
 */
export async function MerchantMapSection({
  title = "Where you can spend SFLuv",
  spacing = "md",
  heightClassName
}: MerchantMapSectionProps) {
  const map = await MerchantMapPanel({ heightClassName });
  if (map === null) return null;

  return (
    <Section title={title} spacing={spacing} width="wide">
      {map}
    </Section>
  );
}
