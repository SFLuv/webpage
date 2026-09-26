"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { fitSpotlight, HERO_ID, pinHeroViewport, SPOTLIGHT_SLOT_ID } from "./heroLayout";

const neverChanges = () => () => {};

/**
 * True while rendering on the server and hydrating, false otherwise.
 *
 * The inline scripts below exist only in the server's HTML. A homepage
 * rendered on the client, after an in-app navigation, would never run them
 * (React does not execute scripts it creates, and says so), and does not need
 * them: the effects do the same job before paint there.
 */
function useFromServer() {
  return useSyncExternalStore(
    neverChanges,
    () => false,
    () => true
  );
}

function InlineScript({ run, id }: { run: (element: HTMLElement | null) => void; id: string }) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: `(${run.toString()})(document.getElementById(${JSON.stringify(id)}))` }}
    />
  );
}

/**
 * Pins the hero's height to the viewport it loaded in. The first thing in the
 * hero, so everything after it is laid out against the pinned value.
 *
 * Re-pinned when the screen turns or, on a desktop, when the window is resized.
 * Not when only the height of a touch screen's viewport changes: that is its
 * toolbars collapsing and expanding as the page scrolls, exactly what the pin
 * is there to ignore.
 */
export function HeroViewportScript() {
  const fromServer = useFromServer();

  useLayoutEffect(() => {
    const hero = document.getElementById(HERO_ID);
    pinHeroViewport(hero);

    let width = window.innerWidth;
    const touch = window.matchMedia("(pointer: coarse)");

    const onResize = () => {
      if (touch.matches && window.innerWidth === width) return;
      width = window.innerWidth;
      pinHeroViewport(hero);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return fromServer ? <InlineScript run={pinHeroViewport} id={HERO_ID} /> : null;
}

/**
 * Sizes the spotlight card before the first paint. The last thing in the hero,
 * so the whole hero is laid out by the time it measures; the carousel keeps it
 * fitted after that.
 */
export function SpotlightFitScript() {
  const fromServer = useFromServer();
  return fromServer ? <InlineScript run={fitSpotlight} id={SPOTLIGHT_SLOT_ID} /> : null;
}
