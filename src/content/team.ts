import type { BlockNode } from "@/components/content/document";
import type { ImageAsset } from "./types";

export type TeamMember = {
  name: string;
  /** Title(s). Optional: some board members are listed by name only. */
  role?: string;
  /** Head shot. Without one the card shows a neutral silhouette. */
  photo?: ImageAsset;
  /** Without one the card shows the name and role only. */
  bio?: BlockNode[];
  links?: { label: string; href: string }[];
};

export type TeamSection = {
  title: string;
  members: TeamMember[];
};

/*
 * Copy follows the "Website Revision Copy Deck" (Oct 2026). People without a
 * photo or bio yet are listed by name; add them here as they come in.
 */

const photos = {
  beth: {
    src: "/assets/wp-content/uploads/2024/08/Beth-OLeary-Head-Shot-1.jpg",
    alt: "Beth O’Leary",
    width: 1067,
    height: 1600
  },
  vipul: {
    src: "/assets/wp-content/uploads/2024/08/Vipul-Vyas-Head-Shot.jpg",
    alt: "Vipul Vyas",
    width: 200,
    height: 200
  },
  billy: {
    src: "/assets/wp-content/uploads/2024/08/Billy-Riggs-Head-Shot.jpg",
    alt: "Billy Riggs",
    width: 218,
    height: 218
  },
  paul: {
    src: "/assets/wp-content/uploads/2024/08/Paul-OLeary-Head-Shot.jpg",
    alt: "Paul O’Leary",
    width: 860,
    height: 999
  },
  // PJ's and Sanchez's head shots are from the 2025–2026 Annual Impact Report.
  pj: {
    src: "/assets/team/pj-oleary-2026.jpg",
    alt: "PJ O’Leary",
    width: 500,
    height: 500
  },
  sanchez: {
    src: "/assets/team/sanchez-oleary-2026.jpg",
    alt: "Sanchez O’Leary",
    width: 500,
    height: 500
  }
} satisfies Record<string, ImageAsset>;

const bethBio: BlockNode[] = [
  {
    type: "paragraph",
    children: [
      "Beth has lived in San Francisco for 30 years, raising 3 sons together with her husband, Paul while working for small and medium sized businesses. As a result, she holds a deep loyalty to the City and the local business community that lends San Francisco its unique sense of place. Committed to responsive governance and equity, Beth is grateful for the opportunity to collaborate with local business owners, to improve their communities and expand their economic opportunities."
    ]
  }
];

export const teamSections: TeamSection[] = [
  {
    title: "Our Staff",
    members: [
      {
        name: "Beth O’Leary, CPA/MPA",
        role: "Executive Director, Board President and Co-Creator",
        photo: photos.beth,
        bio: bethBio
      },
      { name: "Brooke Barry", role: "Volunteer & Affiliate Coordinator" },
      { name: "Jacky Gomez-Tijerino", role: "Social Media & Communications Coordinator" },
      {
        name: "PJ O’Leary",
        role: "Lead Software Developer",
        photo: photos.pj,
        bio: [
          {
            type: "paragraph",
            children: [
              "Born and raised in San Francisco, PJ has an intimate connection with the city and its culture. As a native San Franciscan, he has seen firsthand both the challenges that the city faces, and the resilience of communities that take them on. Alongside his love of innovation and wonder at the possibilities that blockchain unlocks, this understanding led him to the logical conclusion that brought him to work on SFLUV today: We must utilize new technologies to aid our communities and bring about social good for all."
            ]
          }
        ]
      },
      { name: "Sanchez O’Leary", role: "Software Developer", photo: photos.sanchez }
    ]
  },
  {
    title: "Our Board",
    members: [
      {
        name: "Beth O’Leary, CPA/MPA",
        role: "President, Executive Director and Co-Creator",
        photo: photos.beth,
        bio: bethBio
      },
      { name: "Jamie Flanagan" },
      { name: "Marci Harris" },
      {
        name: "Vipul Vyas, MBA",
        role: "Treasurer and Co-Creator",
        photo: photos.vipul,
        bio: [
          {
            type: "paragraph",
            children: [
              "Vipul has a passion for city planning, urban beautification, and public transportation. He also has over 20 years of experience in technology, blockchain, and artificial intelligence. Vipul hopes to leverage this experience to improve city life through compelling projects that beautify our civic surroundings. He is particularly passionate about empowering communities to determine for themselves what their needs are and ease the process of realizing their aspirations."
            ]
          }
        ],
        links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/vipulnvyas" }]
      }
    ]
  },
  {
    title: "Our Advisors",
    members: [
      {
        name: "Billy Riggs, PhD",
        role: "Co-Creator and Strategic Adviser",
        photo: photos.billy,
        bio: [
          {
            type: "paragraph",
            children: [
              "William (Billy) Riggs, is a San Francisco resident as well as a professor and consultant in urban technology and sustainability development. He teaches and leads research at the University of San Francisco, and is co-director of the ",
              {
                type: "link",
                href: "https://www.usfca.edu/arts-sciences/research/centers-institutes/autonomous-vehicles-city-initiative",
                children: ["Autonomous Vehicles and the City Initiative"]
              },
              "."
            ]
          }
        ],
        links: [
          { label: "LinkedIn", href: "https://www.linkedin.com/in/billyriggs" },
          { label: "Twitter", href: "https://twitter.com/billyriggs" }
        ]
      },
      { name: "Nimisha Ganesh", role: "Strategic Adviser" },
      {
        name: "Paul O’Leary",
        role: "Co-Creator and Technical Adviser",
        photo: photos.paul,
        bio: [
          {
            type: "paragraph",
            children: [
              "Paul has lived in San Francisco for over 30 years and raised three sons in The City with his wife Beth. Paul is a Silicon Valley veteran having worked as an engineer, technical leader, founder and CEO of multiple successful software startups. His passion for innovation and transformational technology has recently led him to focus on blockchain and applied cryptographic applications that have the potential to radically improve the way that value is created and distributed in local and global communities."
            ]
          }
        ]
      }
    ]
  }
];
