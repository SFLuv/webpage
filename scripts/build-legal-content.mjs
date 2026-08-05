/**
 * One-time migration: converts the archived WordPress export for the long-form
 * legal pages into typed document trees under `src/content/legal/`.
 *
 * The generated modules are the source of truth from here on — this script
 * exists so the conversion is reproducible and auditable, not so it runs on
 * every build. Re-run with:  node scripts/build-legal-content.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "scripts/legacy/wordpress-export.json");
const outDir = path.join(root, "src/content/legal");

const TARGETS = [
  {
    slug: "privacy-policy",
    exportName: "privacyPolicy",
    title: "Privacy Policy",
    summary:
      "How SFLuv collects, uses, and discloses your information when you use the Service, and the privacy rights you have."
  },
  {
    slug: "terms-and-conditions",
    exportName: "termsAndConditions",
    title: "Terms and Conditions",
    summary: "The terms that govern your use of the SFLuv website and services."
  }
];

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&nbsp;": " ",
  "&#8211;": "–",
  "&#8212;": "—",
  "&#8216;": "‘",
  "&#8217;": "’",
  "&#8220;": "“",
  "&#8221;": "”",
  "&#8230;": "…"
};

function decodeEntities(value) {
  return value
    .replace(/&#(\d+);/g, (match, code) => ENTITIES[match] ?? String.fromCharCode(Number(code)))
    .replace(/&[a-z]+;/gi, (match) => ENTITIES[match] ?? match);
}

/** Splits an HTML fragment into tag and text tokens. */
function tokenize(html) {
  const tokens = [];
  const pattern = /<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi;
  let cursor = 0;
  let match;

  while ((match = pattern.exec(html))) {
    if (match.index > cursor) {
      tokens.push({ kind: "text", value: html.slice(cursor, match.index) });
    }

    tokens.push({
      kind: match[0].startsWith("</") ? "close" : "open",
      name: match[1].toLowerCase(),
      attrs: match[2] || "",
      selfClosing: match[2].trimEnd().endsWith("/")
    });

    cursor = match.index + match[0].length;
  }

  if (cursor < html.length) {
    tokens.push({ kind: "text", value: html.slice(cursor) });
  }

  return tokens;
}

function getAttr(attrs, name) {
  const match = attrs.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i"));
  return match ? decodeEntities(match[1]) : undefined;
}

const INLINE_TAGS = new Set(["strong", "b", "em", "i", "a", "br", "span"]);
const BLOCK_TAGS = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li"]);

/** Collapses whitespace the way HTML rendering does, but keeps meaningful gaps. */
function normalizeText(value) {
  return decodeEntities(value).replace(/\s+/g, " ");
}

function trimInline(nodes) {
  const out = nodes
    .map((node) => (typeof node === "string" ? node : node))
    .filter((node) => (typeof node === "string" ? node.length > 0 : true));

  if (out.length && typeof out[0] === "string") {
    out[0] = out[0].replace(/^\s+/, "");
    if (!out[0]) out.shift();
  }

  if (out.length && typeof out[out.length - 1] === "string") {
    const last = out.length - 1;
    out[last] = out[last].replace(/\s+$/, "");
    if (!out[last]) out.pop();
  }

  return out;
}

/**
 * WordPress wrapped every heading in <strong>. Headings are already weighted by
 * the stylesheet, so the wrapper is dropped.
 */
function unwrapHeading(children) {
  if (children.length === 1 && typeof children[0] === "object" && children[0].type === "strong") {
    return children[0].children;
  }
  return children;
}

function isEmptyInline(nodes) {
  return nodes.every((node) => typeof node === "string" && !node.trim());
}

/**
 * Walks the token stream and emits block nodes. Layout wrappers (div, figure,
 * section) are transparent: only the semantic blocks inside them are kept.
 */
function parseBlocks(html) {
  const tokens = tokenize(html);
  const blocks = [];

  // Stack of inline containers for the block currently being built.
  let current = null;
  let inlineStack = [];
  let listItems = null;
  let listOrdered = false;

  const push = (node) => {
    const target = inlineStack.length ? inlineStack[inlineStack.length - 1].children : current;
    if (target) target.push(node);
  };

  const finishBlock = () => {
    if (!current) return;
    const children = trimInline(current);
    if (children.length && !isEmptyInline(children)) {
      if (listItems) {
        listItems.push(children);
      } else if (currentHeadingLevel) {
        blocks.push({ type: "heading", level: currentHeadingLevel, children: unwrapHeading(children) });
      } else {
        blocks.push({ type: "paragraph", children });
      }
    }
    current = null;
    inlineStack = [];
    currentHeadingLevel = null;
  };

  let currentHeadingLevel = null;

  for (const token of tokens) {
    if (token.kind === "text") {
      if (!current) {
        // Stray text outside any block still deserves a paragraph.
        if (!token.value.trim()) continue;
        current = [];
      }
      push(normalizeText(token.value));
      continue;
    }

    const { name } = token;

    if (token.kind === "open") {
      if (name === "ul" || name === "ol") {
        finishBlock();
        listItems = [];
        listOrdered = name === "ol";
        continue;
      }

      if (name === "li") {
        finishBlock();
        current = [];
        continue;
      }

      if (BLOCK_TAGS.has(name)) {
        finishBlock();
        current = [];
        const headingMatch = name.match(/^h([1-6])$/);
        // h1 is the page title, rendered by the page shell, so demote to h2.
        currentHeadingLevel = headingMatch ? Math.min(4, Math.max(2, Number(headingMatch[1]))) : null;
        continue;
      }

      if (INLINE_TAGS.has(name)) {
        if (name === "br") {
          push(" ");
          continue;
        }
        if (name === "span") continue;

        if (!current) current = [];

        const node =
          name === "a"
            ? { type: "link", href: normalizeHref(getAttr(token.attrs, "href") || "#"), children: [] }
            : { type: name === "b" ? "strong" : name === "i" ? "em" : name, children: [] };

        push(node);
        inlineStack.push(node);
        continue;
      }

      // Any other tag (div, figure, section, …) is a transparent wrapper.
      continue;
    }

    // Closing tags.
    if (name === "ul" || name === "ol") {
      finishBlock();
      if (listItems && listItems.length) {
        blocks.push(listOrdered ? { type: "list", ordered: true, items: listItems } : { type: "list", items: listItems });
      }
      listItems = null;
      continue;
    }

    if (name === "li" || BLOCK_TAGS.has(name)) {
      finishBlock();
      continue;
    }

    if (INLINE_TAGS.has(name) && name !== "br" && name !== "span") {
      const openNode = inlineStack.pop();
      if (openNode) openNode.children = trimInline(openNode.children);
      continue;
    }
  }

  finishBlock();
  return blocks;
}

/** Rewrites absolute sfluv.org links to site-relative paths. */
function normalizeHref(href) {
  return href
    .replace(/^https?:\/\/(www\.)?sfluv\.org\/?$/i, "/")
    .replace(/^https?:\/\/(www\.)?sfluv\.org\/([^?#]*?)\/?$/i, "/$2");
}

/** Pulls a "Last updated: …" opener out of the block list into metadata. */
function extractUpdated(blocks) {
  const first = blocks[0];
  if (!first || first.type !== "paragraph") return { updated: undefined, blocks };

  const text = first.children.filter((node) => typeof node === "string").join("");
  const match = text.match(/^Last updated:\s*(.+)$/i);
  if (!match) return { updated: undefined, blocks };

  return { updated: match[1].trim(), blocks: blocks.slice(1) };
}

function serialize(value, indent = 0) {
  const pad = "  ".repeat(indent);

  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    const items = value.map((item) => `${pad}  ${serialize(item, indent + 1)}`);
    return `[\n${items.join(",\n")}\n${pad}]`;
  }

  const entries = Object.entries(value).map(
    ([key, item]) => `${pad}  ${key}: ${serialize(item, indent + 1)}`
  );
  return `{\n${entries.join(",\n")}\n${pad}}`;
}

const exportData = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
fs.mkdirSync(outDir, { recursive: true });

for (const target of TARGETS) {
  const page = exportData.pages.find((item) => item.slug === target.slug);
  if (!page) throw new Error(`No page in export for slug "${target.slug}"`);

  const parsed = parseBlocks(page.html);
  const { updated, blocks } = extractUpdated(parsed);

  const document = {
    title: target.title,
    ...(updated ? { updated } : {}),
    summary: target.summary,
    blocks
  };

  const file = `// Generated by scripts/build-legal-content.mjs from the archived WordPress export.
// Edit the copy here directly; the generator is kept only for re-running the migration.
import type { LegalDocument } from "@/components/content/document";

export const ${target.exportName}: LegalDocument = ${serialize(document)};
`;

  fs.writeFileSync(path.join(outDir, `${target.slug}.ts`), file);
  console.log(`${target.slug}: ${blocks.length} blocks${updated ? ` (updated ${updated})` : ""}`);
}
