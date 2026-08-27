import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Payment History",
  robots: NOINDEX,
};

export default function StoreHistoryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
