import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "FluxiBiz — Run your whole business from one screen",
  description:
    "All-in-one point of sale, inventory, online storefront, and reporting for small teams in Cambodia.",
};

export default function LandingPage() {
  redirect("/store");
}