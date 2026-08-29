"use client";

import { useEffect, useState } from "react";

export function useIsMessenger(): boolean {
  const [isMessenger, setIsMessenger] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fromQuery = new URLSearchParams(window.location.search).get("messenger") === "true";
    // sessionStorage, not localStorage — see useIsTma.ts for why: a
    // localStorage flag never clears, so any browser that ever opened a
    // Mini App link once would keep the regular site's own Navbar/Footer
    // permanently hidden on every later visit.
    const fromStorage = window.sessionStorage.getItem("messenger_mode") === "true";

    if (fromQuery) {
      window.sessionStorage.setItem("messenger_mode", "true");
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMessenger(fromQuery || fromStorage);
  }, []);

  return isMessenger;
}
