/**
 * A minimal document tree for long-form pages.
 *
 * Legal copy is stored as this structure rather than as an HTML string, so the
 * text stays verbatim while the rendering stays real React elements.
 */
export type InlineNode =
  | string
  | { type: "strong"; children: InlineNode[] }
  | { type: "em"; children: InlineNode[] }
  | { type: "link"; href: string; children: InlineNode[] };

export type BlockNode =
  | { type: "heading"; level: 2 | 3 | 4; children: InlineNode[] }
  | { type: "paragraph"; children: InlineNode[] }
  | { type: "list"; ordered?: boolean; items: InlineNode[][] };

export type LegalDocument = {
  title: string;
  /** Human-readable revision date shown in the page header, when present. */
  updated?: string;
  summary: string;
  blocks: BlockNode[];
};
