"use client";

import { useEffect, useState } from "react";

/**
 * Whether the page is running inside the Telegram Mini App WebView. Reads
 * `window.location.search` directly rather than `useSearchParams()` so
 * callers (like the site-wide Navbar) don't need their own Suspense
 * boundary just for this check. Falls back to `localStorage.tma_mode`,
 * set once on first entry, so a client-side navigation within the same
 * Mini App session that drops the `?tma=true` query string doesn't flip
 * back to showing the normal site chrome.
 */
export function useIsTma(): boolean {
  const [isTma, setIsTma] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fromQuery = new URLSearchParams(window.location.search).get("tma") === "true";
    const fromStorage = window.localStorage.getItem("tma_mode") === "true";

    if (fromQuery) {
      window.localStorage.setItem("tma_mode", "true");
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTma(fromQuery || fromStorage);
  }, []);

  return isTma;
}
