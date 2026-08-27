import type { Metadata } from "next";
import type { ReactNode } from "react";
import StoreLayoutShell from "@/components/store/store-component/StoreLayoutShell";
import { STORE_URL } from "@/lib/seo";

interface StoreLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "Browse Stores",
  description:
    "Discover local shops and restaurants selling online through FluxiBiz. Browse categories, find stores near you, and shop directly.",
  alternates: {
    canonical: STORE_URL,
  },
};

export default function StoreLayout({ children }: StoreLayoutProps) {
  return <StoreLayoutShell>{children}</StoreLayoutShell>;
}
