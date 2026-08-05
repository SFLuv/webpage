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

export const contactFormConfig: MailtoFormConfig = {
  title: "Contact Us",
  lead: "Use this form to start an email to the SFLUV team.",
  recipient: contactEmails.inquiries,
  topics: [
    "General Inquiry",
    "Merchant Onboarding",
    "Events",
    "Volunteering",
    "Donations",
    "Press or Media",
    "Other"
  ],
  note: `This will open your email app with the message addressed to ${contactEmails.inquiries}.`,
  noscriptNote: "JavaScript is required for the form button. You can also email us directly at"
};

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
  title: "Please Submit a W9 Form to Continue",
  paragraphs: [
    "Thank you for your continued involvement in SFLUV! In order to keep receiving perks, you will need to fill out a W9 form, which should only take a few minutes",
    "Please fill out/validate the email below, then click Notify to let us know! We will follow up with a W9 form for you via email shortly."
  ]
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
    supportEmail: contactEmails.accountDeletion
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
