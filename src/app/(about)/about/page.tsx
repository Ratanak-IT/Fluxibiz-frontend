import {ContactSection} from "@/components/about/ContactSection";
import FeaturesSection from "@/components/about/FeaturesSection";
import HeroSection from "@/components/about/HeroSection";
import MentorsSection from "@/components/about/MentorsSection";
import MissionSection from "@/components/about/MissionSection";

import VisionSection from "@/components/about/VisionSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | FluxiBiz",
  description: "One platform for your whole business — founded in Phnom Penh, 2026.",
};

export default function AboutPage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection/>
      <MissionSection/>
      <VisionSection stepDurationMs={900} dwellMs={1200}/>
      <ContactSection />
      <MentorsSection />
    </main>
  );
}