import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Checkout",
  robots: NOINDEX,
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
