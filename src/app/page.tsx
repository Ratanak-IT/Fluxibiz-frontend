import type { Metadata } from "next";
import { permanentRedirect, RedirectType } from "next/navigation";
import { STORE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FluxiBiz — Run your whole business from one screen",
  description:
    "All-in-one point of sale, inventory, online storefront, and reporting for small teams in Cambodia.",
  alternates: {
    canonical: STORE_URL,
  },
};

export default function LandingPage() {
  permanentRedirect("/store", RedirectType.replace);
}