"use client";

import { useEffect, useState } from "react";

export type GeoStatus = "idle" | "granted" | "denied" | "unsupported";

/**
 * The shopper's own position for "near me" sorting — requested automatically
 * on mount. The browser's own native permission dialog is unavoidable either
 * way (no page can skip it on a first visit); this only removes an extra
 * in-app "Allow location" step before that dialog appears. A shopper who
 * already decided once — through the browser's own remembered
 * grant/deny — gets it silently honored without a dialog at all, same as
 * any other site.
 */
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
