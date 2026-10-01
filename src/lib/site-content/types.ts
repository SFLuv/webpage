import type { DocumentLink } from "@/components/ui/DocumentLinkList";

/**
 * Shapes returned by the SFLuv backend's public `/site/*` routes. They mirror
 * `backend/structs/site.go` in the app repo; see docs/features/website-editing-and-forms.md
 * there for the full contract.
 */

export type PublicSlide = {
  id: string;
  label: string;
  title: string;
  /** Plain text. `[label](url)` becomes a link; see `parseInline`. */
  body: string;
  image: { url: string; width: number; height: number; alt: string };
  /** CSS `object-position` for the strip the photo is cropped to. */
  image_position: string;
  action: {
    label: string;
    href: string;
    new_tab: boolean;
    /** Opened in a new tab on the same click, while this tab follows `href`. */
    also_open: string;
  };
  /** Words from a recurring volunteer event's title; the site finds its next occurrence. */
  event_match: string;
};

export type PublicSpotlight = { slides: PublicSlide[] };

export type PublicFinancialDocument = { label: string; href: string; kind?: string };

export type PublicFinancials = {
  years: {
    label: string;
    fiscal_year?: number;
    periods: { label: string; documents: PublicFinancialDocument[] }[];
  }[];
  impact_reports: PublicFinancialDocument[];
};

export type FormChoice = { id: string; label: string; description: string };

export type FormConfig = {
  contact: "off" | "optional" | "required";
  preferred_name: boolean;
  event: "off" | "ask" | "fixed";
  event_name: string;
  choices_prompt: string;
  choices: FormChoice[];
  guardian_section: boolean;
  confirmation_message: string;
};

export type PublicFormSummary = { slug: string; kind: string; title: string; summary: string };

export type PublicForm = {
  slug: string;
  kind: string;
  title: string;
  summary: string;
  version: number;
  body: string;
  config: FormConfig;
};

export type FormLookup =
  | { state: "open"; form: PublicForm }
  | { state: "closed"; title: string }
  | { state: "notfound" }
  | { state: "unavailable" };

export type { DocumentLink };
