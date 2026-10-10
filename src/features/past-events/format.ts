/** "2026-05-16" → "May 16, 2026". The date has no time, so it is read in UTC to avoid slipping a day. */
export function formatPastEventDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return "";
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d))
  );
}
