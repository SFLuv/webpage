import { contactEmails } from "@/lib/site";

/**
 * The Get in touch page.
 *
 * Two ways to reach us, offered in the order most people want them: the
 * community chat first, because most questions are answered there in minutes
 * by someone who has already asked them, and the form second for anything that
 * needs a reply from us specifically.
 */

export type GetInTouchSubject = {
  /** Stable slug, used in the ?subject= link so a page can preselect one. */
  slug: string;
  /** What the sender sees, and what we see in the alert. */
  label: string;
  hint?: string;
};

/**
 * The subjects on the form.
 *
 * Slugs are permanent once published: they appear in links from other pages
 * and in people's browser history. Add rather than rename.
 */
export const getInTouchSubjects: GetInTouchSubject[] = [
  { slug: "general", label: "General question" },
  {
    slug: "become-an-improver",
    label: "Become an improver",
    hint: "Earn SFLuv for work that improves the neighbourhood"
  },
  { slug: "merchant-onboarding", label: "Merchant onboarding" },
  { slug: "events", label: "Events and volunteering" },
  { slug: "donations", label: "Donations" },
  { slug: "press", label: "Press or media" },
  { slug: "technical-support", label: "Technical support" },
  { slug: "other", label: "Something else" }
];

export const defaultSubjectSlug = "general";

/** Resolves a ?subject= value, falling back rather than failing. */
export function subjectFromSlug(slug: string | null | undefined): string {
  const match = getInTouchSubjects.find((subject) => subject.slug === slug);
  return (match ?? getInTouchSubjects.find((s) => s.slug === defaultSubjectSlug)!).slug;
}

export const getInTouchContent = {
  title: "Get in touch",
  lead: "Ask in the community chat, or send us a message and we will reply by email.",

  chat: {
    heading: "Join the community chat",
    body: "Our Telegram group is where merchants, improvers and volunteers talk to each other and to us. Most questions get answered there first.",
    cta: "Open the community chat",
    /** Shown when no community link is configured, so the step degrades. */
    unavailable: "The community chat link is not available right now — please use the form below."
  },

  form: {
    heading: "Send us a message",
    body: "We will email you a reply. You will get a reference straight away so you can follow it up.",
    cta: "Send message",
    sending: "Sending…",
    /** The reference is the point of the confirmation, so it leads. */
    success: (reference: string) =>
      `Thank you — your reference is ${reference}. We have emailed you a copy and we will be in touch.`,
    failure: "We could not send that. Please try again, or email us directly.",
    fallbackEmail: contactEmails.inquiries
  }
} as const;
