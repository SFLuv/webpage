import { externalLinks } from "@/lib/site";
import type { ImageAsset } from "./types";

export const treeStewardContent = {
  title: "Tree Steward Program",
  metaDescription:
    "Become a Tenderloin Tree Steward with SFLuv and help 18 new street trees thrive through daily check-ins and simple care.",
  banner: {
    src: "/assets/wp-content/uploads/2026/03/tenderloin_tree_steward_banner.png",
    alt: "Tenderloin Tree Steward program banner",
    width: 1800,
    height: 900
  } satisfies ImageAsset,
  signupHref: externalLinks.treeStewardSignup,
  intro: [
    "Thank you for your interest in becoming a Tree Steward in the Tenderloin. Care and attention play an important role in helping young street trees grow strong and healthy in the Tenderloin.",
    "The ArboristaSF Tenderloin Initiative supports 18 new trees planted by SF Public Works’ nonprofit partner Friends of the Urban Forest (FUF).",
    "BUFEES (Bureau of Urban Forestry Eyes and Ears on the Streets) will be asked to visit new street trees once a day, providing observations and photos on the health of each tree. In conjunction with the ArboristaSF Rapid Response Team, these observations will help the Public Works Bureau of Urban Forestry (BUF) and FUF provide immediate care for these trees to thrive during the crucial first three years of life. With steady care and attention during this time, each tree has a much better chance of growing into a healthy, mature part of the neighborhood."
  ],
  dutiesTitle: "What Tenderloin BUFEES Do",
  duties: [
    "Visit their adopted tree(s) each day",
    "With the Web App provided by the program, complete a survey of the tree(s) conditions and record issues or vandalism for evaluation by the ArboristaSF Rapid Response Team",
    "Submit photos of the adopted tree(s) through the Web App"
  ],
  outro: [
    "The job is primarily to observe changes, report concerns, and share the program goals with curious passersby neighbors.",
    "Supplies will also be provided to clean up small trash items (excluding broken glass, needles and bio-waste)."
  ],
  ctaLabel: "Interested in Being a Tenderloin BUFEES? Click Here!"
};
