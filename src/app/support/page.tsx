

import type { Metadata } from "next";
import { ContactSection } from "@/components/about/ContactSection";
import { MigrationSection } from "@/components/landing-page";
import { HeroSection } from "@/components/support/Hero";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Support | FluxiBiz",
  description:
    "Get help with FluxiBiz — contact our support team or migrate your business from another platform.",
  alternates: {
    canonical: `${SITE_URL}/support`,
  },
};

export default function SupportPage() {
  return (
    <main>
        <HeroSection />
        <MigrationSection />
        <ContactSection />
    </main>
  );
}