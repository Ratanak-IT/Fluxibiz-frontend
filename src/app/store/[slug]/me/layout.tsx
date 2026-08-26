import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  title: "My Profile",
  robots: NOINDEX,
};

export default function StoreMeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
