"use client";

import type { ReactNode } from "react";
import StoreNavbar from "@/components/store/store-component/navbar";

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <div className="relative min-h-screen pb-24 lg:pb-0">
      {children}
      <StoreNavbar />
    </div>
  );
}
