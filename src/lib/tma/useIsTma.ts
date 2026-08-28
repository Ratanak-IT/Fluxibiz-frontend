"use client";

import { useEffect, useState } from "react";


export function useIsTma(): boolean {
  const [isTma, setIsTma] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fromQuery = new URLSearchParams(window.location.search).get("tma") === "true";
    // sessionStorage, not localStorage: this only needs to survive
    // navigation within the same Mini App tab (Telegram links inside the
    // webview don't always keep repeating ?tma=true). localStorage would
    // never clear — any browser that ever opened a Mini App link once would
    // have the regular site's own Navbar/Footer permanently hidden.
    const fromStorage = window.sessionStorage.getItem("tma_mode") === "true";

    if (fromQuery) {
      window.sessionStorage.setItem("tma_mode", "true");
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTma(fromQuery || fromStorage);
  }, []);

  return isTma;
}
