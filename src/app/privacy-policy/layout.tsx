import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy | FluxiBiz",
  description:
    "Learn how FluxiBiz collects, uses, and protects your personal and business data across our marketplace, POS, and messaging channels.",
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
