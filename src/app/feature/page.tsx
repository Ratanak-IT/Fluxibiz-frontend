import type { Metadata } from "next";

import {
  DashboardSyncShowcase,
  FeatureBento,
  FeatureCta,
  FeatureHero,
  FeatureModules,
} from "@/components/feature-page";
import { TechnologyMarquee } from "@/components/ui/technology-marquee";

export const metadata: Metadata = {
  title: "Features — FluxiBiz",
  description:
    "Explore FluxiBiz business management, inventory, sales, reporting, online shopping, and social commerce features.",
};

export default function FeaturePage() {
  return (
    <main className="overflow-x-clip bg-white">
      <FeatureHero />
      <DashboardSyncShowcase />
      <FeatureBento />
      <TechnologyMarquee />
      <FeatureModules />
      <FeatureCta />
    </main>
  );
}
