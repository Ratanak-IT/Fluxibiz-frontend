"use client";

import type { ReactNode } from "react";
import StoreNavbar from "@/components/store/store-component/navbar";
import { useMiniAppMode } from "@/lib/tma/useMiniAppMode";

export default function StoreLayoutShell({ children }: { children: ReactNode }) {
  const { isMiniApp } = useMiniAppMode();

  return (
    <div className={`relative min-h-screen ${isMiniApp ? "" : "pb-24 lg:pb-0"}`}>
      {children}
      <StoreNavbar />
    </div>
  );
}
