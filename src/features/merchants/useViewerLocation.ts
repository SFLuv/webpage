"use client";

import { useEffect, useState } from "react";
import type { Coordinates } from "@/lib/merchants/distance";

/**
 * The visitor's position, used to order the merchant list by distance.
 *
 * Deliberately does NOT prompt. This is a public marketing page, and throwing a
 * location permission dialog at someone who has just arrived — on the home page
 * no less — is the kind of thing that gets a site closed. So the permission is
 * only read, never requested: somebody who has already granted it (to this site
 * or through their browser's site settings) gets distance ordering, and
 * everyone else gets the list in its unsorted order within each open/closed
 * band. Nothing about the page depends on the answer.
 *
 * Returns null until a position is known, and stays null if it never is.
 */
export function useViewerLocation(): Coordinates | null {
  const [location, setLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    let cancelled = false;

    const read = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (cancelled) return;
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => undefined,
        { maximumAge: 600_000, timeout: 10_000 }
      );
    };

    // Permissions is unavailable on some older Safari versions; there we simply
    // do without rather than falling back to a prompt.
    if (!navigator.permissions?.query) return;

    void navigator.permissions
      .query({ name: "geolocation" })
      .then((status) => {
        if (cancelled || status.state !== "granted") return;
        read();
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return location;
}
