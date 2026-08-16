import type { Metadata } from "next";
import type { ReactNode } from "react";
import StoreNavbar from "@/components/store/store-component/navbar";
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
  return (
    <div className="relative min-h-screen pb-24 lg:pb-0">
      {children}
      <StoreNavbar />
    </div>
  );
}
