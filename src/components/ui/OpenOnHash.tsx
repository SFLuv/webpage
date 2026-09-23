"use client";

import { useEffect } from "react";

/**
 * Opens and scrolls to a `<details>` when the URL fragment names it.
 *
 * Browsers scroll to a fragment but leave a closed disclosure closed, so a
 * deep link like `/financials-and-reports#annual-impact-reports` would land on
 * a collapsed box. Runs on mount (covering client-side navigation) and on
 * later hash changes.
 */
export function OpenOnHash() {
  useEffect(() => {
    function openTarget() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!(target instanceof HTMLDetailsElement)) return;
      target.open = true;
      // Deferred past the router's own scroll handling, and instant because
      // the site-wide smooth scroll gets cancelled by it mid-animation — either
      // way a client-side navigation would otherwise land at the top.
      setTimeout(() => target.scrollIntoView({ block: "start", behavior: "instant" }), 50);
    }

    openTarget();
    window.addEventListener("hashchange", openTarget);
    return () => window.removeEventListener("hashchange", openTarget);
  }, []);

  return null;
}
