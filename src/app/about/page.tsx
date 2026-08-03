
import MentorsSection from "@/components/about/MentorsSection";
import MissionSection from "@/components/about/MissionSection";
import VisionSection from "@/components/about/VisionSection";
import { HeroSection } from "@/components/landing-page";
import type { Metadata } from "next";
import GoalFeature from "@/components/about/GoalFeature";

export const metadata: Metadata = {
  title: "About Us | FluxiBiz",
  description: "One platform for your whole business — founded in Phnom Penh, 2026.",
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <HeroSection />
      <GoalFeature />
      <MissionSection />
      <VisionSection stepDurationMs={900} dwellMs={1200} />
      <MentorsSection />
    </main>
  );
}
