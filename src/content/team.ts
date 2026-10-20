import type { BlockNode } from "@/components/content/document";
import type { ImageAsset } from "./types";

export type TeamMember = {
  name: string;
  /**
   * The surname to alphabetize by, when it is not simply the last word of
   * `name` (e.g. "Tijerino Gomez", which sorts under T).
   */
  sortSurname?: string;
  /**
   * Places this member ahead of the alphabetical order in their section:
   * 1 first, 2 second, and so on. Everyone without one follows, by last name.
   */
  leadOrder?: number;
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
  // Jacky's head shot is from the 2025–2026 Annual Impact Report; PJ's and Sanchez's are the
  // originals behind it, cropped square. Jamie's was sent by Beth in Oct 2026, cropped square.
  pj: {
    src: "/assets/team/pj-oleary-2026.jpg",
    alt: "PJ O’Leary",
    width: 800,
    height: 800
  },
  sanchez: {
    src: "/assets/team/sanchez-oleary-2026.jpg",
    alt: "Sanchez O’Leary",
    width: 800,
    height: 800
  },
  // Marci's is her official POPVOX Foundation head shot (popvox.org/team), cropped square.
  // Brooke's and Nimisha's are their own profile photos, saved by Sanchez (Oct 2026).
  brooke: {
    src: "/assets/team/brooke-barry.jpg",
    alt: "Brooke Barry",
    width: 400,
    height: 400
  },
  nimisha: {
    src: "/assets/team/nimisha-ganesh.jpg",
    alt: "Nimisha Ganesh",
    width: 336,
    height: 336
  },
  marci: {
    src: "/assets/team/marci-harris.jpg",
    alt: "Marci Harris",
    width: 800,
    height: 800
  },
  jamie: {
    src: "/assets/team/jamie-flanagan-2026.jpg",
    alt: "Jamie Flanagan",
    width: 800,
    height: 800
  },
  jacky: {
    src: "/assets/team/jacky-2026.jpg",
    alt: "Jaqueline Tijerino Gomez",
    width: 500,
    height: 667
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
        leadOrder: 1,
        role: "Executive Director, Board President and Co-Creator",
        photo: photos.beth,
        bio: bethBio
      },
      {
        name: "PJ O’Leary",
        role: "Lead Software Developer",
        photo: photos.pj,
        bio: [
          {
            type: "paragraph",
            children: [
              "Born and raised in San Francisco, PJ has always loved the city and its people, and he got into building technology because it seemed like a fun way to give back to his community. As SFLuv’s lead software developer, he designs and builds most of the technology behind SFLuv, from the tools our volunteers, improvers, and partner organizations use every day to the systems that keep track of every SFLUV transaction."
            ]
          }
        ]
      },
      {
        name: "Jaqueline Tijerino Gomez",
        sortSurname: "Tijerino Gomez",
        role: "Social Media & Communications Coordinator",
        photo: photos.jacky
      },
      { name: "Brooke Barry", role: "Volunteer & Affiliate Coordinator", photo: photos.brooke },
      {
        name: "Sanchez O’Leary",
        role: "Software Developer",
        photo: photos.sanchez,
        bio: [
          {
            type: "paragraph",
            children: [
              "Sanchez is a software developer at SFLuv, where he works on the tools that residents, merchants, and our staff rely on. He built the first version of the SFLuv merchant map, and he focuses on areas like cashing out SFLUV, tax reporting, and the systems that help SFLuv run day to day. He holds a Bachelor of Arts in Cognitive Systems from the University of British Columbia."
            ]
          }
        ]
      }
    ]
  },
  {
    title: "Our Board",
    members: [
      {
        name: "Beth O’Leary, CPA/MPA",
        leadOrder: 1,
        role: "President, Executive Director and Co-Creator",
        photo: photos.beth,
        bio: bethBio
      },
      {
        name: "Vipul Vyas, MBA",
        leadOrder: 2,
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
      },
      { name: "Marci Harris", photo: photos.marci },
      {
        name: "Jamie Flanagan",
        role: "Board Member",
        photo: photos.jamie,
        bio: [
          {
            type: "paragraph",
            children: [
              "Jamie Flanagan is an experienced people and operations leader in San Francisco hospitality. He served as Managing Partner of the Phoenix Hotel and its restaurant, Chambers Eat + Drink, and as Regional Director of Operations at 31 Madison Management Group. As co-founder of the Tenderloin Business Coalition, he helped organize neighborhood businesses around public safety and conditions affecting commerce. Jamie collaborates with community, civic, and police leadership in connection with San Francisco’s Drug Market Agency Coordination Center and remains active in the neighborhood business community through Alchemy Springs. His experience gives him a practical understanding of the challenges facing neighborhood businesses."
            ]
          }
        ]
      }
    ]
  },
  {
    title: "Our Advisors",
    members: [
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
      },
      { name: "Nimisha Ganesh", role: "Strategic Adviser", photo: photos.nimisha },
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
      }
    ]
  }
];
