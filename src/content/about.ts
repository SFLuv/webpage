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

type FlywheelStep = {
  title: string;
  body: string;
};

export const howItWorksContent = {
  title: "SFLuv’s Flywheel Effect",
  metaDescription:
    "How the SFLuv flywheel works: donors fund a community treasury, merchants vote on proposals, and improvers earn tokens they spend locally.",
  graphic: {
    src: "/assets/wp-content/uploads/2024/08/SFLuv-How-it-Works-Graphic.png",
    alt: "Diagram of the SFLuv flywheel: donors donate, merchants vote, improvers improve and transact, and the community collects",
    width: 2480,
    height: 2480
  } satisfies ImageAsset,
  steps: [
    {
      title: "Donors Donate",
      body: "Donors and grantors multiply their impact by supporting community improvement and economic development through SFLuv. Their donations are placed into a community treasury to be voted on by participating merchants."
    },
    {
      title: "Merchants Vote",
      body: "Participating merchants vote on allocation of the community treasury towards community improvement proposals (CIP). These proposals can be put forth by both merchants and participating improvers."
    },
    {
      title: "Improvers Improve",
      body: "Local service providers and individual community members who improve their neighborhoods by accepting, completing, and validating CIPs are rewarded with SFLuv tokens."
    },
    {
      title: "Improvers Transact",
      body: "Rewarded improvers use SFLuv tokens to pay for goods and services provided by local merchants."
    },
    {
      title: "Community Collects",
      body: "A small portion of each transaction in SFLuv is sent back to the community treasury, keeping the momentum going for future proposals."
    },
    {
      title: "Merchants Exchange",
      body: "Merchants may convert SFLuv tokens to USD, or continue to reinvest in their community by making purchases in SFLuv at other local businesses."
    }
  ] satisfies FlywheelStep[],
  outcome: {
    title: "The Flywheel Effect",
    body: "Each dollar donated to the SFLuv treasury yields double the economic impact: first, by strengthening the community infrastructure when an improvement is completed, and second, by driving economic development when an improver redeems SFLuv with a local merchant."
  }
};
