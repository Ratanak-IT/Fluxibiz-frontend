"use client";

import { useEffect, useState } from "react";

export function useIsMessenger(): boolean {
  const [isMessenger, setIsMessenger] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fromQuery = new URLSearchParams(window.location.search).get("messenger") === "true";
    const fromStorage = window.localStorage.getItem("messenger_mode") === "true";

    if (fromQuery) {
      window.localStorage.setItem("messenger_mode", "true");
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMessenger(fromQuery || fromStorage);
  }, []);

  return isMessenger;
}
