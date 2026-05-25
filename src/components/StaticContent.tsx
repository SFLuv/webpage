"use client";

import { useEffect, useRef } from "react";

type StaticContentProps = {
  html: string;
  variant?: "home" | "page";
};

export function StaticContent({ html, variant = "page" }: StaticContentProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || root.dataset.scriptsExecuted === "true") return;

    root.dataset.scriptsExecuted = "true";

    root.querySelectorAll("script").forEach((oldScript) => {
      const nextScript = document.createElement("script");

      Array.from(oldScript.attributes).forEach((attribute) => {
        nextScript.setAttribute(attribute.name, attribute.value);
      });

      if (oldScript.src) {
        nextScript.src = oldScript.src;
      } else {
        nextScript.textContent = oldScript.textContent;
      }

      oldScript.replaceWith(nextScript);
    });
  }, [html]);

  return (
    <div
      ref={rootRef}
      className={`static-content static-content--${variant}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
