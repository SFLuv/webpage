import { getInTouchLink } from "@/lib/get-in-touch-link";
import { contactEmails, externalLinks } from "@/lib/site";
import { routes } from "@/lib/routes";

export type MailtoFormConfig = {
  title: string;
  lead: string;
  recipient: string;
  topics: string[];
  note: string;
  noscriptNote: string;
};

// contactFormConfig is gone with the mailto: contact page. The Get in touch
// page replaced it and keeps its own content in src/content/get-in-touch.ts;
// leaving a second, unused copy of that copy here is how the two drift apart.
export const supportFormConfig: MailtoFormConfig = {
  title: "Contact Technical Support",
  lead: "Use this form to start an email to the SFLUV technical support team.",
  recipient: contactEmails.support,
  topics: [
    "Technical Support Request",
    "Account Access",
    "Website Issue",
    "Wallet Issue",
    "General Question"
  ],
  note: `This will open your email app with the message addressed to ${contactEmails.support}.`,
  noscriptNote: "JavaScript is required for the form button. You can also email support directly at"
};

export const w9Content = {
  title: "Your W-9 is filed in the SFLuv app",
  paragraphs: [
    "Thank you for your continued involvement in SFLuv! To keep receiving perks once you earn past the IRS reporting threshold, we need a W-9 from you. It only takes a few minutes.",
    "W-9s are now filled in on a secure form inside the SFLuv app, not here. Open the app on your phone and tap the W-9 prompt; it appears whenever one is needed."
  ],
  help: "Don't see the prompt, or something isn't working? Send us a message and pick W-9 as the topic. It reaches the team with a reference number you can quote."
};

export const deleteAccountContent = {
  title: "Delete Your SFLuv Account",
  lead: "Request deletion of your SFLuv account and associated account data",
  signIn: {
    title: "Start with secure sign-in",
    lead: "The fastest and safest way to delete your account is to sign in through SFLuv, confirm your identity, and submit the deletion request from your account settings.",
    primaryCta: { href: externalLinks.appDeleteAccount, label: "Sign in to delete my account" },
    secondaryCta: { href: "#deletion-help", label: "I cannot sign in" },
    afterSignIn: {
      title: "What happens after sign-in?",
      steps: [
        "You sign in with the same method you use for SFLuv.",
        "You confirm that you want to delete your account.",
        "Your account is deactivated and scheduled for deletion.",
        "You can contact us within 30 days if you need account recovery."
      ]
    },
    retention: {
      title: "Data retention",
      body: "Eligible account data is deleted after the recovery period. SFLuv may retain limited records where required for security, fraud prevention, legal, regulatory, or compliance reasons."
    },
    warning:
      "Never send passwords, private keys, seed phrases, or wallet recovery information to SFLuv support."
  },
  help: {
    title: "Having trouble signing in?",
    lead: "Send a deletion request to SFLuv support. We may follow up to verify account ownership before processing the request.",
    loginMethods: ["Google", "Apple", "Email", "Wallet", "Not sure"],
    confirmation:
      "I request deletion of my SFLuv account and associated account data. I understand SFLuv may need to verify account ownership before processing this request.",
    supportLink: getInTouchLink("technical-support")
  },
  policies: {
    title: "Policies",
    lead: "You can review how SFLuv handles account data, email preferences, and deletion requests in our policies.",
    links: [{ href: routes.privacyPolicy, label: "Privacy Policy" }]
  }
};

export const roadmapContent = {
  title: "Roadmap",
  body: "Coming soon…"
};
