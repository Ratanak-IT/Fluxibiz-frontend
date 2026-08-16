import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Your Cart",
  robots: NOINDEX,
};

export default function StoreCartLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
