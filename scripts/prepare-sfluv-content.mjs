import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const tmpRoot = "/tmp";
const pagesPath = path.join(tmpRoot, "sfluv-pages.json");
const mediaPath = path.join(tmpRoot, "sfluv-media-1.json");
const homeHtmlPath = path.join(tmpRoot, "sfluv-home.html");
const homeContentPath = path.join(tmpRoot, "sfluv-home-content.html");
const uagCssPath = path.join(tmpRoot, "sfluv-uag.css");
const lativCssPath = path.join(tmpRoot, "sfluv-lativ.css");

const outDataPath = path.join(root, "src/data/site-content.json");
const outWpCssPath = path.join(root, "src/app/wp-extracted.css");
const outUagCssPath = path.join(root, "src/app/uag.css");
const outLativCssPath = path.join(root, "src/app/lativ.css");
const curlConfigPath = path.join(root, "scripts/sfluv-assets.curl");

const requiredFiles = [pagesPath, mediaPath, homeHtmlPath, homeContentPath, uagCssPath, lativCssPath];
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing ${file}. Fetch the SFLuv export inputs before running this script.`);
  }
}

const pages = JSON.parse(fs.readFileSync(pagesPath, "utf8"));
const media = JSON.parse(fs.readFileSync(mediaPath, "utf8"));
const homeHtml = fs.readFileSync(homeHtmlPath, "utf8");
const rawHomeContent = fs.readFileSync(homeContentPath, "utf8");
const rawUagCss = fs.readFileSync(uagCssPath, "utf8");
const rawLativCss = fs.readFileSync(lativCssPath, "utf8");

const assetUrls = new Map();

function decodeEntities(value) {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "-")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, "\"")
    .replace(/&#8221;/g, "\"")
    .replace(/&#8230;/g, "...")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, "\"");
}

function normalizeUrl(input) {
  return decodeEntities(input)
    .replace(/^http:\/\/sfluv\.org/i, "https://sfluv.org")
    .replace(/^http:\/\/www\.sfluv\.org/i, "https://sfluv.org")
    .trim()
    .replace(/[),.]+$/g, "");
}

function isDownloadable(url) {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    const pathname = parsed.pathname.toLowerCase();
    return /\.(png|jpe?g|gif|webp|svg|pdf|ttf|woff2?|css)$/i.test(pathname);
  } catch {
    return false;
  }
}

function localPathForUrl(url) {
  const parsed = new URL(url);
  const decodedPath = decodeURIComponent(parsed.pathname);

  if (parsed.hostname === "sfluv.org" && decodedPath.startsWith("/wp-content/")) {
    return `/assets${decodedPath}`;
  }

  const ext = path.extname(decodedPath) || ".asset";
  const digest = crypto.createHash("sha256").update(url).digest("hex").slice(0, 12);
  const basename = path.basename(decodedPath, ext).replace(/[^a-z0-9._-]+/gi, "-") || "asset";
  return `/assets/external/${parsed.hostname}/${basename}-${digest}${ext}`;
}

function addAsset(candidate) {
  const normalized = normalizeUrl(candidate);
  if (!isDownloadable(normalized)) return;
  if (!assetUrls.has(normalized)) {
    assetUrls.set(normalized, localPathForUrl(normalized));
  }
}

function collectAssetsFromText(text) {
  const matches = String(text).match(/https?:\/\/[^\s"'<>]+/g) || [];
  matches.forEach(addAsset);
}

collectAssetsFromText(homeHtml);
collectAssetsFromText(rawHomeContent);
collectAssetsFromText(rawUagCss);
collectAssetsFromText(rawLativCss);

for (const page of pages) {
  collectAssetsFromText(page.content?.rendered || "");
}

for (const item of media) {
  addAsset(item.source_url);
  const sizes = item.media_details?.sizes || {};
  for (const size of Object.values(sizes)) {
    if (size?.source_url) addAsset(size.source_url);
  }
}

function rewriteAssetUrls(text) {
  let output = String(text).replace(/http:\/\/sfluv\.org/g, "https://sfluv.org");
  for (const [remote, local] of assetUrls.entries()) {
    const escapedRemote = remote.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    output = output.replace(new RegExp(escapedRemote, "g"), local);
    output = output.replace(new RegExp(escapedRemote.replace(/&/g, "&amp;"), "g"), local);
  }
  return output;
}

function rewriteInternalLinks(text) {
  return String(text)
    .replace(/href="https:\/\/sfluv\.org\/"/g, 'href="/"')
    .replace(/href="https:\/\/sfluv\.org\/([^"#?]+)\/?"/g, 'href="/$1"')
    .replace(/href="https:\/\/www\.sfluv\.org\/?"/g, 'href="/"')
    .replace(/href="http:\/\/www\.sfluv\.org\/?"/g, 'href="/"');
}

function normalizeHtml(html) {
  return rewriteInternalLinks(rewriteAssetUrls(html))
    .replace(/\sloading="lazy"/g, ' loading="lazy"')
    .replace(/sizes="auto,\s*/g, 'sizes="');
}

function extractCssFromStyleTags(html) {
  const ids = [
    "wp-img-auto-sizes-contain-inline-css",
    "wp-block-spacer-inline-css",
    "wp-block-group-inline-css",
    "wp-block-site-logo-inline-css",
    "wp-block-navigation-link-inline-css",
    "wp-block-heading-inline-css",
    "wp-block-paragraph-inline-css",
    "wp-block-image-inline-css",
    "wp-block-columns-inline-css",
    "wp-block-social-links-inline-css",
    "global-styles-inline-css",
    "core-block-supports-inline-css",
    "wp-block-template-skip-link-inline-css",
    "uagb-style-frontend-0"
  ];

  const css = [];
  for (const id of ids) {
    const match = html.match(new RegExp(`<style[^>]*id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/style>`, "i"));
    if (match) css.push(`/* ${id} */\n${match[1].trim()}`);
  }

  const fontMatch = html.match(/<style class="wp-fonts-local">([\s\S]*?)<\/style>/i);
  if (fontMatch) css.push(`/* wp-fonts-local */\n${fontMatch[1].trim()}`);

  return rewriteAssetUrls(css.join("\n\n"));
}

function pageSummary(html) {
  return decodeEntities(
    html
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  ).slice(0, 180);
}

function sortPages(items) {
  const preferred = [
    "mission-and-vision",
    "how-it-works",
    "our-team",
    "financials-and-reports",
    "donors",
    "community",
    "merchants",
    "improvers",
    "volunteers",
    "resources",
    "contact",
    "support",
    "privacy-policy",
    "terms-and-conditions",
    "delete-account",
    "tree-steward-program",
    "sfluv-quiz",
    "submit-w9",
    "communitymigration",
    "roadmap"
  ];
  return items.slice().sort((a, b) => {
    const ai = preferred.indexOf(a.slug);
    const bi = preferred.indexOf(b.slug);
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    return a.slug.localeCompare(b.slug);
  });
}

const normalizedPages = sortPages(pages).map((page) => {
  const html = normalizeHtml(page.content.rendered);
  return {
    slug: page.slug,
    title: decodeEntities(page.title.rendered),
    html,
    summary: pageSummary(html),
    link: page.link
  };
});

const siteContent = {
  siteName: "SFLuv",
  tagline: "Empowering Merchants, Empowering Communities",
  source: "https://sfluv.org",
  home: {
    slug: "",
    title: "SFLuv",
    html: normalizeHtml(rawHomeContent),
    summary: "Empowering merchants, empowering communities."
  },
  pages: normalizedPages
};

fs.writeFileSync(outDataPath, `${JSON.stringify(siteContent, null, 2)}\n`);
fs.writeFileSync(outWpCssPath, `${extractCssFromStyleTags(homeHtml)}\n`);
fs.writeFileSync(outUagCssPath, rewriteAssetUrls(rawUagCss));
fs.writeFileSync(outLativCssPath, rewriteAssetUrls(rawLativCss));

const curlLines = [
  "location",
  "silent",
  "show-error",
  "fail",
  "create-dirs"
];

for (const [remote, local] of assetUrls.entries()) {
  const outputPath = path.join(root, "public", local);
  curlLines.push("next", `url = \"${remote}\"`, `output = \"${outputPath}\"`);
}

fs.writeFileSync(curlConfigPath, `${curlLines.join("\n")}\n`);

console.log(`Wrote ${normalizedPages.length} pages to ${path.relative(root, outDataPath)}`);
console.log(`Found ${assetUrls.size} downloadable assets`);
console.log(`Wrote curl config to ${path.relative(root, curlConfigPath)}`);
