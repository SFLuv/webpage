import { Hero, SplitSections, UpcomingEvents, ValueCards } from "@/features/home/HomeSections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueCards />
      <SplitSections />
      <UpcomingEvents />
    </>
  );
}
