"use client";

import { useEffect, useState } from "react";


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
