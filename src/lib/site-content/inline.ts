import type { InlineNode } from "@/components/content/document";

const LINK = /\[([^\]\n]{1,120})\]\(([^)\s]{1,500})\)/g;

/**
 * Turns banner text into inline nodes: `[label](url)` becomes a link, everything
 * else stays plain text.
 *
 * Only on-site paths and http(s)/mailto URLs become links. Editors paste this
 * text into a form, so a `javascript:` URL must never reach an href.
 */
export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let last = 0;

  for (const match of text.matchAll(LINK)) {
    const [whole, label, href] = match;
    const start = match.index ?? 0;
    const safe = /^(\/(?!\/)|https?:\/\/|mailto:)/i.test(href);

    if (start > last) nodes.push(text.slice(last, start));
    nodes.push(safe ? { type: "link", href, children: [label] } : whole);
    last = start + whole.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes.length > 0 ? nodes : [text];
}
