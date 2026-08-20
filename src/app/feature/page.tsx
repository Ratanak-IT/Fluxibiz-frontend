import type { Metadata } from "next";

import {
  DashboardSyncShowcase,
  FeatureBento,
  FeatureCta,
  FeatureModules,
} from "@/components/feature-page";
import { TechnologyMarquee } from "@/components/ui/technology-marquee";
import HeroSection from "@/components/about/HeroSection";
import { ToolsBento } from "@/components/landing-page/tools-bento";
import { DayTimeline } from "@/components/landing-page/day-timeline";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Features — FluxiBiz",
  description:
    "Explore FluxiBiz business management, inventory, sales, reporting, online shopping, and social commerce features.",
  alternates: {
    canonical: `${SITE_URL}/feature`,
  },
};

export default function FeaturePage() {
  return (
    <main className="overflow-x-clip bg-white">
      <HeroSection/>
      <DashboardSyncShowcase />
      <ToolsBento />
      <FeatureModules />
      <DayTimeline />
      <FeatureBento />
      <TechnologyMarquee />
      <FeatureCta />
    </main>
  );
}