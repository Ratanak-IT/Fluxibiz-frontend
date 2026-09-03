"use client";

import { useEffect, useState } from "react";
import { WifiOff, ServerOff, Wifi, RefreshCw, Loader2 } from "lucide-react";
import { useNetworkStatus, type NetworkStatus } from "@/hooks/useNetworkStatus";

export function NetworkStatusBanner() {
  const { status, isChecking, checkStatus } = useNetworkStatus();
  const [prevStatus, setPrevStatus] = useState<NetworkStatus>(status);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    if (
      status === "online" &&
      (prevStatus === "offline" || prevStatus === "server_down")
    ) {
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 3500);
      return () => clearTimeout(timer);
    }
    setPrevStatus(status);
  }, [status, prevStatus]);

  if (status === "online" && !showRestored) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto">
      {/*  Offline */}
      {status === "offline" && (
        <div className="flex items-center gap-3 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-2xl">
          <WifiOff className="size-4" />
          <span>No Internet Connection</span>
        </div>
      )}

      {/*  Connection Restored */}
      {status === "online" && showRestored && (
        <div className="flex items-center gap-2.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-2xl">
          <Wifi className="size-4" />
          <span>Back Online</span>
        </div>
      )}
    </div>
  );
}
