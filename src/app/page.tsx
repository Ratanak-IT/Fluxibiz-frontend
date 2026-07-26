import type { Metadata } from "next";
import {
    DayTimeline,
    FeatureCards,
    HeroSection,
    MigrationSection,
    PricingSection,
    ProductPreview,
    SurfacesSection,
    ToolsBento,
} from "@/components/landing-page";

export const metadata: Metadata = {
    title: "FluxiBiz — Run your whole business from one screen",
    description:
        "All-in-one point of sale, inventory, online storefront, and reporting for small teams in Cambodia.",
};

export default function LandingPage() {
  return (
    <main className="landing-page overflow-x-clip">
      <HeroSection />
      <ProductPreview />
      <FeatureCards />
      <ToolsBento />
      <DayTimeline />
      <SurfacesSection />
      <MigrationSection />
      <PricingSection />
    </main>
  );
}
