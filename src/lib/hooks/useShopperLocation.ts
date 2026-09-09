"use client";

import { useEffect, useState } from "react";

export type GeoStatus = "idle" | "granted" | "denied" | "unsupported";


export function useShopperLocation() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<GeoStatus>("idle");

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("unsupported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setStatus("granted");
      },
      () => setStatus("denied"),
      { maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  return { coords, status };
}
