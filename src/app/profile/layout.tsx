import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Profile",
  robots: NOINDEX,
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
