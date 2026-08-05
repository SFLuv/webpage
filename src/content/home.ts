import { routes } from "@/lib/routes";
import { externalLinks } from "@/lib/site";
import type { Cta, ImageAsset } from "./types";

export type Partner = {
  name: string;
  href: string;
  logo: ImageAsset;
};

type ValueCard = {
  image: ImageAsset;
  title: string;
  body: string;
};

type SplitSection = {
  title: string;
  body: string;
  cta: Cta;
  image: ImageAsset;
  /** Which side the image sits on at desktop widths. */
  imageSide: "left" | "right";
};

export const homeContent = {
  hero: {
    title: "Empowering Merchants, Empowering Communities",
    cta: { href: routes.howItWorks, label: "How it Works" } satisfies Cta
  },

  partners: {
    title: "Our Partners",
    logos: [
      {
        name: "INTN.CITY",
        href: externalLinks.partners.intnCity,
        logo: {
          src: "/assets/partners/intn-city.png",
          alt: "INTN.CITY",
          width: 421,
          height: 66
        }
      },
      {
        name: "Citizen Wallet",
        href: externalLinks.partners.citizenWallet,
        logo: {
          src: "/assets/partners/citizen-wallet.png",
          alt: "Citizen Wallet",
          width: 515,
          height: 134
        }
      },
      {
        name: "Celo",
        href: externalLinks.partners.celo,
        logo: {
          src: "/assets/partners/celo.png",
          alt: "Celo",
          width: 680,
          height: 166
        }
      }
    ] satisfies Partner[]
  },

  whyTitle: "Why SFLuv",

  valueCards: [
    {
      image: {
        src: "/assets/wp-content/themes/lativ/assets/images/image-2.webp",
        alt: "",
        width: 964,
        height: 508
      },
      title: "Problem Statement",
      body: "Municipalities today grapple with significant challenges in delivering essential services like maintaining clean streets, ensuring safe living conditions, and streamlining various city services and approvals. Merchants and small business owners in underserved communities are among the hardest hit by these inefficiencies. As potential customers avoid their neighborhoods, these business owners face the dual burden of working harder to sustain their operations while having less capital and time to navigate the outdated systems their livelihoods depend on."
    },
    {
      image: {
        src: "/assets/wp-content/themes/lativ/assets/images/image-1.webp",
        alt: "",
        width: 964,
        height: 508
      },
      title: "The Trapped Capital Challenge",
      body: "Our cities are brimming with financial, human, and infrastructural capital, ready to be fully utilized. Yet, there remain barriers of distrust and inefficient organizational structures that hinder the effective use of these resources. By addressing these challenges, we can unlock this trapped capital and create more vibrant, livable urban environments."
    },
    {
      image: {
        src: "/assets/wp-content/themes/lativ/assets/images/image-3.webp",
        alt: "",
        width: 964,
        height: 508
      },
      title: "Our Solution",
      body: "We propose leveraging a blockchain-based community project management platform to deliver the structure, clarity, and predictability essential for efficient capital deployment. Local stable tokens will minimize capital leakage and enhance the velocity of money within the community. Decentralized ledgers will ensure transparency in asset allocation, while smart contracts will streamline workflows. Together these technologies will empower merchants to efficiently allocate funds and make community-driven decisions that directly address the needs they observe in their neighborhoods, fueling the flywheel of economic development."
    }
  ] satisfies ValueCard[],

  splits: [
    {
      title: "Our Mission",
      body: "At SFLuv, our mission is to support local merchants and small businesses in underserved neighborhoods through community improvements, civic engagement, and purposeful development of local economies. By harnessing blockchain technology, we are developing a community project management platform that enables small businesses and merchants to identify community needs, cultivate consensus, and direct improvement funds effectively. We further boost economic development by rewarding laborers and others who address these needs with SFLuv tokens, encouraging them to redeem their rewards at participating merchants.",
      cta: { href: routes.community, label: "Get Involved" },
      image: {
        src: "/assets/wp-content/uploads/2024/06/AdobeStock_599890447-resize.jpg",
        alt: "",
        width: 5800,
        height: 3869
      },
      imageSide: "left"
    },
    {
      title: "Why Blockchain?",
      body: "Blockchain technology is open and standards-based, ensuring interoperability and reusability. This transparency creates enormous technical leverage, as code written once can be used by all. Moreover, blockchain’s community-defined rules ensure that the system remains fair and incorruptible, promoting trust and engagement.",
      cta: { href: routes.resources, label: "Learn More" },
      image: {
        src: "/assets/wp-content/uploads/2024/06/AdobeStock_528499316-resize.jpg",
        alt: "",
        width: 4655,
        height: 3103
      },
      imageSide: "right"
    }
  ] satisfies SplitSection[]
};
