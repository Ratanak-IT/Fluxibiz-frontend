import { ContactSection } from "@/components/about/ContactSection";
import { MigrationSection } from "@/components/landing-page";
import { HeroSection } from "@/components/support/Hero";

export default function SupportPage() {
  return (
    <main>
        <HeroSection />
        <MigrationSection />
        <ContactSection />
    </main>
  );
}