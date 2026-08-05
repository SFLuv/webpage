export type QuizOption = {
  /** Answer key as published (A, B, C, …). */
  value: string;
  label: string;
};

export type QuizQuestion = {
  number: number;
  prompt: string;
  /** "multiple" renders checkboxes and requires an exact set match. */
  answerType: "single" | "multiple";
  correct: string[];
  options: QuizOption[];
};

export type QuizFact = {
  summary: string;
  body: string;
};

export type QuizSection = {
  id: string;
  title: string;
  lead: string;
  facts: QuizFact[];
  questions: QuizQuestion[];
};

export const quizContent = {
  title: "SFLuv Community Currency Quiz",
  subtitle: "Grow the Luv Edition",
  finish: {
    title: "Congratulations, you’ve finished the “About SFLUV” quiz!",
    body: "Please present this to your SFLUV representative to recieve your Gratitude Perks.",
    logo: {
      src: "/assets/wp-content/uploads/2024/06/cropped-SFLUV-Currency-Symbol-Logo-1.png",
      alt: "SFLUV logo",
      width: 512,
      height: 512
    }
  }
};

export const quizSections: QuizSection[] = [
  {
    id: "tenderloin",
    title: "Section 1: The Tenderloin",
    lead: "Before You Begin: A Quick Look at the Tenderloin",
    facts: [
      {
        summary: "What Is the Tenderloin?",
        body: "The Tenderloin is one of San Francisco’s most misunderstood neighborhoods. It is first and foremost a residential community. Roughly 30 percent of its residents are children, one of the highest concentrations of children in the city. That means thousands of families call this neighborhood home."
      },
      {
        summary: "History of Activism and Cultural Leadership",
        body: "The Tenderloin has a long history of activism and cultural leadership. It was the site of the Compton’s Cafeteria uprising in 1966, one of the earliest acts of organized LGBTQ resistance in the United States. It has long been home to immigrant communities, working class families, artists, and community organizers."
      },
      {
        summary: "Why Small Businesses Matter",
        body: "Small businesses are essential here. The neighborhood is filled with family owned restaurants, markets, salons, repair shops, cafés, and cultural venues. Across San Francisco, small businesses make up more than 95 percent of all businesses and account for a significant portion of local employment."
      },
      {
        summary: "Geography and Economic Connection",
        body: "Geographically, the Tenderloin is strategically located. It borders Civic Center and connects directly to Market Street. It sits within walking distance of Union Square, the Financial District, and the Theatre District."
      }
    ],
    questions: [
      {
        number: 1,
        prompt: "Which San Francisco neighborhood has the greatest concentration of children?",
        answerType: "single",
        correct: ["C"],
        options: [
          { value: "A", label: "Noe Valley" },
          { value: "B", label: "The Sunset" },
          { value: "C", label: "The Tenderloin" },
          { value: "D", label: "Pacific Heights" }
        ]
      },
      {
        number: 2,
        prompt: "Approximately what proportion of Tenderloin residents are children?",
        answerType: "single",
        correct: ["C"],
        options: [
          { value: "A", label: "About 5 percent" },
          { value: "B", label: "About 15 percent" },
          { value: "C", label: "About 30 percent" },
          { value: "D", label: "About 50 percent" }
        ]
      },
      {
        number: 3,
        prompt: "The Tenderloin is known for:",
        answerType: "single",
        correct: ["D"],
        options: [
          { value: "A", label: "A rich history of activism and social justice" },
          { value: "B", label: "A vibrant small business and immigrant community" },
          { value: "C", label: "Historic LGBTQ organizing and cultural leadership" },
          { value: "D", label: "All of the above" }
        ]
      },
      {
        number: 4,
        prompt: "Why is supporting small businesses in the Tenderloin especially important?",
        answerType: "single",
        correct: ["C"],
        options: [
          { value: "A", label: "Because it increases property values faster than the rest of the city" },
          { value: "B", label: "Because it mainly benefits tourists and convention traffic" },
          {
            value: "C",
            label:
              "Because small businesses create local jobs, keep everyday services nearby for families, and help strengthen a safer, more stable neighborhood economy"
          },
          { value: "D", label: "Because it lowers the cost of rent citywide" },
          { value: "E", label: "Because it replaces the need for public services and nonprofits" }
        ]
      },
      {
        number: 5,
        prompt: "Why is the Tenderloin especially important to the San Francisco economy?",
        answerType: "single",
        correct: ["E"],
        options: [
          { value: "A", label: "It borders Civic Center" },
          { value: "B", label: "It connects to Market Street" },
          { value: "C", label: "It sits near Union Square, the Financial District, and the Theatre District" },
          { value: "D", label: "It links several major economic and cultural hubs" },
          { value: "E", label: "All of the above" }
        ]
      }
    ]
  },
  {
    id: "community-finance",
    title: "Section 2: Community Finance",
    lead: "Before You Begin: How Communities Rethink Money",
    facts: [
      {
        summary: "Free Banking Era in the United States",
        body: "In the 1800s during the United States Free Banking Era thousands of locally chartered banks issued their own banknotes."
      },
      {
        summary: "Wörgl’s Depression-Era Local Currency",
        body: "In 1932 the town of Wörgl Austria issued a stamp scrip currency during the Great Depression. Within one year unemployment reportedly dropped by about 25 percent before the program was shut down by Austria’s central bank."
      },
      {
        summary: "Sardex in Sardinia",
        body: "In 2009 Sardex was founded in Sardinia Italy after the global financial crisis of 2008. It is a mutual credit network that has facilitated more than 50 million euros in annual transactions in recent years."
      },
      {
        summary: "Bitcoin and the 2008 Financial Crisis",
        body: "Bitcoin was also launched in 2009 after the financial crisis of 2008. Designed as a decentralized digital currency that could operate without banks or central authorities, the timing of its launch reflected a broader response to the crisis, when many people lost trust in traditional financial institutions and government-managed fiat systems. Cryptocurrencies emerged in part as an attempt to build financial networks that are transparent, rule-based, and independent of the failures that can occur in conventional monetary systems."
      },
      {
        summary: "What Stablecoins Are",
        body: "Stablecoins are digital tokens designed to maintain a stable value. Large financial technology companies such as PayPal or Circle issue stablecoins backed one for one by United States dollars or short term United States Treasury securities."
      },
      {
        summary: "Stablecoins in Crisis Response",
        body: "In 2022 millions of dollars in stablecoin donations were sent to Ukraine when traditional banking systems were disrupted."
      },
      {
        summary: "Government Uses of Blockchain Tools",
        body: "California has piloted blockchain tools for vehicle title systems. British Columbia has explored blockchain supported digital identity systems. Estonia uses blockchain inspired technology to secure government records."
      }
    ],
    questions: [
      {
        number: 6,
        prompt: "Which of the following are real examples of local or community currencies?",
        answerType: "single",
        correct: ["E"],
        options: [
          { value: "A", label: "Wörgl stamp scrip" },
          { value: "B", label: "Sardex" },
          { value: "C", label: "Privately issued United States banknotes" },
          { value: "D", label: "Monopoly Money" },
          { value: "E", label: "All except D" }
        ]
      },
      {
        number: 7,
        prompt: "A stablecoin is:",
        answerType: "single",
        correct: ["B"],
        options: [
          { value: "A", label: "A coin made of steel" },
          { value: "B", label: "A cryptocurrency designed to maintain a stable value and backed by reserves" },
          { value: "C", label: "A volatile cryptocurrency similar to Bitcoin" },
          { value: "D", label: "A museum artifact" }
        ]
      },
      {
        number: 8,
        prompt: "Blockchain technology can be used for which of the following?",
        answerType: "single",
        correct: ["D"],
        options: [
          { value: "A", label: "Cryptocurrency" },
          { value: "B", label: "Secure digital identity systems" },
          { value: "C", label: "Transparent public records and registries" },
          { value: "D", label: "All of the above" }
        ]
      },
      {
        number: 9,
        prompt: "Which governments are already using or exploring blockchain technology? Choose all that apply.",
        answerType: "multiple",
        correct: ["A", "B", "C"],
        options: [
          { value: "A", label: "California" },
          { value: "B", label: "The Province of British Columbia" },
          { value: "C", label: "Estonia" },
          { value: "D", label: "None of the above" }
        ]
      },
      {
        number: 10,
        prompt:
          "Blockchain and stablecoins were used to send aid to Ukraine because they allow organizations to:",
        answerType: "multiple",
        correct: ["A", "B"],
        options: [
          { value: "A", label: "Enable fast, transparent cross-border transfers" },
          { value: "B", label: "Reduce reliance on traditional banking intermediaries" },
          {
            value: "C",
            label: "Send aid in the form of an appreciating asset, since stablecoins often increase in value"
          },
          { value: "D", label: "Eliminate the need for internet access" }
        ]
      }
    ]
  },
  {
    id: "sfluv",
    title: "Section 3: SFLuv",
    lead: "Before You Begin: What Is SFLuv?",
    facts: [
      {
        summary: "Community Finance, Applied Locally",
        body: "SFLuv builds on the long history of community finance but applies it locally using modern tools."
      },
      {
        summary: "SFLuv’s Mission and Focus",
        body: "SFLuv is a 501(c)(3) charity that relies on a digital community currency to support its dual missions of placemaking (small improvements like murals and landscaping) and economic development in under-resourced communities. It is currently focused solely in the Tenderloin."
      },
      {
        summary: "How People Earn SFLuv",
        body: "Muralists and other neighborhood “Improvers,” such as landscapers, artists, and small contractors earn SFLuv for their work. Volunteers are offered small amounts of SFLuv as gratitude perks."
      },
      {
        summary: "Wrapped Stablecoin Basics",
        body: "Technically, SFLuv is a wrapped stablecoin meaning it uses stablecoins issued by large institutions then programs them with additional permissions and rules."
      },
      {
        summary: "Where SFLuv Can Be Used",
        body: "SFLuv can only be spent at participating local merchants and only approved merchants are given the tools to unwrap the token back into United States dollars."
      },
      {
        summary: "Long Term Governance Goal",
        body: "Over time SFLuv aims to provide tools that allow merchants and residents to propose and vote on projects that benefit their neighborhood using the community treasury."
      }
    ],
    questions: [
      {
        number: 11,
        prompt: "What is SFLuv? Choose all that apply.",
        answerType: "multiple",
        correct: ["B", "C"],
        options: [
          { value: "A", label: "A neighborhood art festival" },
          { value: "B", label: "A digital community currency" },
          { value: "C", label: "A 501(c)(3) charity focused on placemaking and economic development" },
          { value: "D", label: "A city tax credit" },
          { value: "E", label: "A loyalty card" }
        ]
      },
      {
        number: 12,
        prompt: "What does it mean that SFLuv is a wrapped stablecoin?",
        answerType: "single",
        correct: ["B"],
        options: [
          { value: "A", label: "It creates money from nothing" },
          {
            value: "B",
            label:
              "It uses stablecoins issued by large institutions and programs them with permissions so they can only be spent locally"
          },
          { value: "C", label: "It is more volatile than Bitcoin" },
          { value: "D", label: "It is not backed by real assets" }
        ]
      },
      {
        number: 13,
        prompt: "How do people earn SFLuv?",
        answerType: "single",
        correct: ["C"],
        options: [
          { value: "A", label: "Buying it on a crypto exchange" },
          { value: "B", label: "Winning trivia contests" },
          { value: "C", label: "Volunteering and improving the neighborhood" },
          { value: "D", label: "Paying parking tickets" }
        ]
      },
      {
        number: 14,
        prompt: "Where can SFLuv be spent?",
        answerType: "single",
        correct: ["B"],
        options: [
          { value: "A", label: "Anywhere in the world" },
          { value: "B", label: "At participating local merchants" },
          { value: "C", label: "On Amazon" },
          { value: "D", label: "At City Hall" }
        ]
      },
      {
        number: 15,
        prompt: "What makes SFLuv different from typical loyalty programs?",
        answerType: "single",
        correct: ["D"],
        options: [
          { value: "A", label: "It is earned through community action" },
          { value: "B", label: "It strengthens neighborhood businesses" },
          { value: "C", label: "It supports placemaking projects" },
          { value: "D", label: "All of the above" }
        ]
      },
      {
        number: 16,
        prompt: "What is one long term goal of SFLuv?",
        answerType: "single",
        correct: ["C"],
        options: [
          { value: "A", label: "Replace the United States dollar" },
          { value: "B", label: "Launch a hedge fund" },
          {
            value: "C",
            label: "Provide tools that allow residents and merchants to propose and vote on neighborhood projects"
          },
          { value: "D", label: "Eliminate volunteer work" }
        ]
      }
    ]
  }
];
