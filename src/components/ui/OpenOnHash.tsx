"use client";

import { useEffect } from "react";

/**
 * Opens and scrolls to whatever the URL fragment names, opening any
 * `<details>` it is, or sits inside, on the way.
 *
 * Browsers scroll to a fragment but leave a closed disclosure closed, so a
 * deep link like `/financials-and-reports#annual-impact-reports`, or one to a
 * single document inside a collapsed year, would land on a closed box. Runs on
 * mount (covering client-side navigation) and on later hash changes.
 */
export function OpenOnHash() {
  useEffect(() => {
    function openTarget() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      for (let node: HTMLElement | null = target; node; node = node.parentElement) {
        if (node instanceof HTMLDetailsElement) node.open = true;
      }
      // Deferred past the router's own scroll handling, and instant because
      // the site-wide smooth scroll gets cancelled by it mid-animation — either
      // way a client-side navigation would otherwise land at the top.
      const block = target instanceof HTMLDetailsElement ? "start" : "center";
      setTimeout(() => target.scrollIntoView({ block, behavior: "instant" }), 50);
    }

    openTarget();
    window.addEventListener("hashchange", openTarget);
    return () => window.removeEventListener("hashchange", openTarget);
  }, []);

  return null;
}
