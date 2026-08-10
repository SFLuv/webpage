import { Section } from "@/components/ui/Section";
import { getMerchants } from "@/lib/merchants/client";
import { mapConfigured } from "@/lib/merchants/config";
import { MerchantMap } from "./MerchantMap";

type MerchantMapSectionProps = {
  title?: string;
  lead?: string;
  spacing?: "sm" | "md" | "lg";
  heightClassName?: string;
};

/**
 * The merchant map as a page section, with its own data fetch.
 *
 * A server component so the merchant list is fetched and cached on the server —
 * the browser gets the pins, not the round trip. Renders nothing when there is
 * no map to show (Maps unconfigured, or the API returned nothing), because a
 * heading over an empty box tells visitors there are no merchants, which is
 * never true.
 */
export async function MerchantMapSection({
  title = "Where you can spend SFLuv",
  lead = "Every business on this map accepts SFLuv. Pins turn grey while a merchant is closed.",
  spacing = "md",
  heightClassName
}: MerchantMapSectionProps) {
  if (!mapConfigured()) return null;

  const merchants = await getMerchants();
  if (merchants.length === 0) return null;

  return (
    <Section title={title} lead={lead} spacing={spacing} width="wide">
      <MerchantMap merchants={merchants} heightClassName={heightClassName} />
    </Section>
  );
}
