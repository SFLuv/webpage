import type { DocumentLink } from "@/components/ui/DocumentLinkList";

/**
 * Shapes returned by the SFLuv backend's public `/site/*` routes. They mirror
 * `backend/structs/site.go` in the app repo; see docs/features/website-editing-and-forms.md
 * there for the full contract.
 */

export type PublicAnnouncement = {
  enabled: boolean;
  eyebrow?: string;
  title?: string;
  /** Plain text. `[label](url)` becomes a link; see `parseInline`. */
  body?: string;
  image?: { url: string; width: number; height: number };
  button?: {
    label: string;
    href: string;
    /** Opened in a new tab on the same click, while this tab follows `href`. */
    also_open?: string;
  };
};

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
