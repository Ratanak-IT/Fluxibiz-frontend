"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import type { ReactNode } from "react";

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMiniApp = pathname.startsWith("/tma") || pathname.startsWith("/m-app");

  if (isMiniApp) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
