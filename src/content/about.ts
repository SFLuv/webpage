import type { ImageAsset } from "./types";

export const missionContent = {
  metaDescription:
    "SFLuv supports local merchants and small businesses in underserved San Francisco neighborhoods through community improvements and civic engagement.",
  mission: {
    title: "Our Mission",
    paragraphs: [
      "At SFLuv, our mission is to support local merchants and small businesses in underserved neighborhoods through community improvements, civic engagement, and purposeful development of local economies.",
      "By harnessing blockchain technology, we are developing a community project management platform that enables small businesses and merchants to identify community needs, cultivate consensus, and direct improvement funds effectively.",
      "We further boost economic development by rewarding laborers and others who address these needs with SFLuv tokens, encouraging them to redeem their rewards at participating merchants."
    ]
  },
  vision: {
    title: "Our Vision",
    lead: "At SFLuv, we envision:",
    statements: [
      "A world where civic improvements and services are easily accessible and efficiently executed.",
      "A world where community members actively participate in allocating funds for the improvements they collectively determine are best for their communities.",
      "A world where civic transactions are transparent and instantly viewable by all community members.",
      "A world where community members and workers make the majority of their purchases at local businesses, fostering vibrant, robust, and healthy neighborhoods."
    ]
  }
};

export type HowItWorksStep = {
  /** Two short lines for the loop diagram. */
  loopLabel: [string, string];
  title: string;
  /** "First impact" / "Second impact", where the step is one. */
  impact?: string;
  body: string;
};

/*
 * Drawn from the 2025–2026 Annual Impact Report ("One Contribution. Two
 * impacts.") and the Boundless SF application. Figures are the report's own.
 * Resident voting is left out until it exists.
 */
export const howItWorksContent = {
  title: "How SFLuv Works",
  eyebrow: "One contribution. Two impacts.",
  metaDescription:
    "How SFLuv works: donations become SFLUV, which thanks the people improving the neighborhood and is then spent at local merchants, so each dollar has an amplified effect.",
  image: "/assets/announcements/impact-report-2025-2026-photo.jpg",
  intro:
    "In most neighborhoods, donations, volunteer energy, and local businesses operate separately: donations fund projects, volunteers give their time, and merchants work on their own to attract customers. SFLuv connects them using SFLUV, a local currency backed one-to-one by U.S. dollars, so that a single donation first improves the neighborhood and then becomes revenue for the businesses in it.",
  steps: [
    {
      loopLabel: ["Supporters", "donate"],
      title: "Supporters donate",
      body: "Supporters donate funds to SFLuv, and we convert those dollars into SFLUV, which is backed one-to-one by U.S. dollars. On top of that, every SFLUV transaction is recorded publicly, so donors can see exactly where their money went."
    },
    {
      loopLabel: ["Neighbors", "improve"],
      title: "Neighbors improve the neighborhood",
      impact: "First impact",
      body: "SFLUV is then distributed to the people doing the work. Volunteers at our cleanups, tree plantings, and other community events receive it as a thank you for their time, and Improvers (neighborhood residents we pay for skilled or ongoing work) receive part of their pay in SFLUV. This is the first impact: the neighborhood itself is improved."
    },
    {
      loopLabel: ["Spent at local", "merchants"],
      title: "SFLUV is spent at local merchants",
      impact: "Second impact",
      body: "Volunteers and Improvers then spend their SFLUV at our partner small businesses, which accept it on their phones in seconds. This is the second impact: the same dollar that improved the block becomes revenue for a local business, and often brings it a new customer. At SFOrganiCA, a Tenderloin grocery and deli, an estimated 90 percent of SFLUV spending came from volunteers who had never shopped there before."
    },
    {
      loopLabel: ["Merchants spend", "or cash out"],
      title: "Merchants spend it or cash it out",
      body: "Merchants can spend the SFLUV they receive at other participating businesses, which keeps the money circulating in the neighborhood, or convert it back into U.S. dollars. Since every SFLUV is backed by a real dollar, a merchant never has to hold onto it longer than they want to."
    }
  ] satisfies HowItWorksStep[],
  amplification: {
    title: "The amplification effect",
    paragraphs: [
      "Consider a $100 donation to a neighborhood cleanup. In a traditional model, that $100 might pay for supplies and a crew, and once it is spent, its job is done. With SFLUV, the $100 goes to the volunteers and Improvers who do the cleanup, and they then spend it at a local grocery or cafe, so the same $100 is counted twice: once as a cleaner block, and once as revenue for a neighborhood business.",
      "We measure this directly. In our first year, counting the SFLUV spent at local merchants alongside our regular program spending, our amplification factor was 1.43x, which means each dollar of program spending produced about $1.43 of combined neighborhood and local business impact. It is below 2x because not all of our program spending is distributed as SFLUV yet."
    ]
  },
  numbers: {
    title: "Our first year, 2025–2026",
    items: [
      { value: "1.43x", label: "amplification factor" },
      { value: "$17,000", label: "SFLUV spent at local merchants" },
      { value: "8", label: "merchant partners" },
      { value: "1,038", label: "volunteer hours" }
    ],
    cta: { label: "Read the Annual Impact Report", href: "/financials-and-reports#annual-impact-reports" }
  }
};
