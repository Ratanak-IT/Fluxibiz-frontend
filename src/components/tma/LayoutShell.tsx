"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import type { ReactNode } from "react";

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isTma = pathname.startsWith("/tma");

  if (isTma) {
    return <main className="min-h-screen bg-slate-950">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
