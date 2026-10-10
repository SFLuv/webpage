/** File extensions for the image types the API serves, which its URLs do not carry. */
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic"
};

function extensionFromUrl(url: string) {
  return /\.([a-z0-9]{2,5})$/i.exec(new URL(url, window.location.href).pathname)?.[1].toLowerCase();
}

/** The name a download lands under: the event, not `IMG_5413.jpg` or a photo id. Extension added on save. */
export function photoFileName(title: string, index: number, total: number) {
  const slug = title
    .toLowerCase()
    .replace(/[’'"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = total > 1 ? `-${String(index + 1).padStart(2, "0")}` : "";
  return `sfluv-${slug}${suffix}`;
}

function save(href: string, filename: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
}

/**
 * Saves one photo as `name`, at full size.
 *
 * Gallery photos are mostly served by the API, on another origin, where a
 * plain `<a download>` is ignored and the browser just navigates to the image.
 * So those are fetched and saved from a blob, which the API's CORS headers
 * allow for the site's own origin. Where that is refused (a preview deployment
 * the API does not list, a dropped connection) the photo opens in a new tab
 * instead, so it can still be saved from there. Returns whether it downloaded.
 */
export async function downloadPhoto(url: string, name: string): Promise<boolean> {
  if (new URL(url, window.location.href).origin === window.location.origin) {
    save(url, `${name}.${extensionFromUrl(url) ?? "jpg"}`);
    return true;
  }

  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    save(objectUrl, `${name}.${EXTENSIONS[blob.type] ?? extensionFromUrl(url) ?? "jpg"}`);
    // Long enough for the browser to have taken the file.
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
    return true;
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
    return false;
  }
}

/**
 * Saves every photo, one at a time with a gap between them.
 *
 * Browsers rate-limit a burst of downloads from one click (Firefox in
 * particular), so they are spaced out. It stops at the first one that cannot
 * be downloaded, which has opened in a tab, rather than opening a tab per photo.
 */
export async function downloadAllPhotos(photos: { url: string }[], title: string) {
  for (const [index, photo] of photos.entries()) {
    if (!(await downloadPhoto(photo.url, photoFileName(title, index, photos.length)))) return;
    if (index < photos.length - 1) await new Promise((resolve) => window.setTimeout(resolve, 400));
  }
}
