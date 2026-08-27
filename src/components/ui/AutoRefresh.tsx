"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Re-renders the server page while somebody is looking at it, so content that
 * changes behind the scenes — a newly published event, a filled seat — shows
 * up without a manual reload.
 *
 * Refreshes when the tab regains focus (the "create it in the app, switch to
 * the site" moment) and on a slow interval while the tab stays visible. The
 * page's own `revalidate` window still caps how often the backend is actually
 * asked; this only re-renders from that shared cache, so a busy tab costs the
 * backend nothing extra.
 */
export function AutoRefresh({ intervalMs = 30_000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const timer = setInterval(refresh, intervalMs);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router, intervalMs]);

  return null;
}
