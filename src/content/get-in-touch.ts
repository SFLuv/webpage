import {
  defaultSubjectSlug,
  getInTouchLink,
  type GetInTouchSubjectSlug
} from "@/lib/get-in-touch-link";

// Re-exported so the page and its flow keep importing subjects from one place.
export { defaultSubjectSlug, getInTouchLink };
export type { GetInTouchSubjectSlug };

/**
 * The Get in touch page.
 *
 * One way to reach us: this form.
 *
 * It offered two others and both were withdrawn. The Telegram community chat
 * came first on the page, on the reasoning that most questions are answered
 * there faster than we could; it is gone pending a link to chat inside the
 * SFLuv app, which is the replacement rather than a removal. And a "prefer
 * email?" fallback sat under the form, which is now the worse thing to offer
 * than nothing: that inbox is not actively monitored, so pointing somebody at
 * it sends their message somewhere nobody is reading.
 *
 * The consequence is that this form is load-bearing in a way it was not before.
 * Anything that weakens it — a failure message that shrugs, a reply address we
 * do not watch — now has no second route behind it.
 */

export type GetInTouchSubject = {
  /** Stable slug, used in the ?subject= link so a page can preselect one. */
  slug: GetInTouchSubjectSlug;
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

/** Resolves a ?subject= value, falling back rather than failing. */
export function subjectFromSlug(slug: string | null | undefined): GetInTouchSubjectSlug {
  const match = getInTouchSubjects.find((subject) => subject.slug === slug);
  return (match ?? getInTouchSubjects.find((s) => s.slug === defaultSubjectSlug)!).slug;
}

export const getInTouchContent = {
  title: "Get in touch",
  lead: "Send us a message and we will reply by email.",

  form: {
    heading: "Send us a message",
    body: "We will email you a reply. You will get a reference straight away so you can follow it up.",
    cta: "Send message",
    sending: "Sending…",
    /** The reference is the point of the confirmation, so it leads. */
    success: (reference: string) =>
      `Thank you — your reference is ${reference}. We have emailed you a copy and we will be in touch.`,
    // No "or email us directly" any more: that inbox is not monitored, so the
    // advice would have been to send it where nobody is looking. Asking for a
    // retry is all we can honestly offer, so it is all this says.
    failure: "We could not send that. Please check your connection and try again."
  }
} as const;
