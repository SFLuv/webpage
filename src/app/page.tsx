import { Hero, SplitSections, UpcomingEvents } from "@/features/home/HomeSections";
import { MerchantMapSection } from "@/features/merchants/MerchantMapSection";

/** Highlight edits made in the admin panel appear within this many seconds. */
export const revalidate = 30;

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* The map replaces the old "Why SFLuv" explainer cards: showing the
          merchants who already take SFLuv answers the same question faster than
          three paragraphs about trapped capital did. */}
      <MerchantMapSection />
      <SplitSections />
      <UpcomingEvents />
    </>
  );
}
