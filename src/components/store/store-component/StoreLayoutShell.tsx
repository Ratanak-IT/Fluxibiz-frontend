"use client";

import type { ReactNode } from "react";
import StoreNavbar from "@/components/store/store-component/navbar";
import { useMiniAppMode } from "@/lib/tma/useMiniAppMode";

/**
 * Keeps the bottom-padding reserved for StoreNavbar off Mini App pages too —
 * they already pad for their own TmaBottomTabBar (see
 * TelegramWebAppProvider / MessengerWebAppProvider), so stacking both leaves
 * a dead gap at the bottom of the screen.
 */
export default function StoreLayoutShell({ children }: { children: ReactNode }) {
  const { isMiniApp } = useMiniAppMode();

  return (
    <div className={`relative min-h-screen ${isMiniApp ? "" : "pb-24 lg:pb-0"}`}>
      {children}
      <StoreNavbar />
    </div>
  );
}
