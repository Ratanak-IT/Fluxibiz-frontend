"use client";

import type { ReactNode } from "react";
import StoreNavbar from "@/components/store/store-component/navbar";
import { useIsTma } from "@/lib/tma/useIsTma";

/**
 * Keeps the bottom-padding reserved for StoreNavbar off Mini App pages too —
 * they already pad for their own TmaBottomTabBar (see
 * TelegramWebAppProvider), so stacking both leaves a dead gap at the
 * bottom of the screen.
 */
export default function StoreLayoutShell({ children }: { children: ReactNode }) {
  const isTma = useIsTma();

  return (
    <div className={`relative min-h-screen ${isTma ? "" : "pb-24 lg:pb-0"}`}>
      {children}
      <StoreNavbar />
    </div>
  );
}
