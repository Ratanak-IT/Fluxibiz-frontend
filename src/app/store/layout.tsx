import type { Metadata } from "next";
import type { ReactNode } from "react";
import StoreLayoutShell from "@/components/store/store-component/StoreLayoutShell";
import { STORE_URL, absoluteUrl } from "@/lib/seo";

interface StoreLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "FluxiBiz — Run your whole business from one screen",
  description:
    "Discover local shops and restaurants selling online through FluxiBiz. Browse categories, find stores near you, and shop directly.",
  alternates: {
    canonical: STORE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: STORE_URL,
    siteName: "FluxiBiz",
    title: "FluxiBiz — Run your whole business from one screen",
    description:
      "Discover local shops and restaurants selling online through FluxiBiz. Browse categories, find stores near you, and shop directly.",
    images: [
      {
        url: absoluteUrl("/thumbnail/thumbnail1.png?v=2"),
        width: 1536,
        height: 1024,
        alt: "FluxiBiz Business Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FluxiBiz — Run your whole business from one screen",
    description:
      "Discover local shops and restaurants selling online through FluxiBiz. Browse categories, find stores near you, and shop directly.",
    images: [absoluteUrl("/thumbnail/thumbnail1.png?v=2")],
  },
};

export default function StoreLayout({ children }: StoreLayoutProps) {
  return <StoreLayoutShell>{children}</StoreLayoutShell>;
}
