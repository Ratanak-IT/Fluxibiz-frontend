import { backendBaseUrl } from "@/lib/seo";
import type { PublicStore, PublicStorePage } from "@/lib/type/storeType";
import HomePage, { type MarketplaceInitialData } from "./marketplace-client";

async function fetchStores(query: string): Promise<PublicStore[]> {
  try {
    const res = await fetch(`${backendBaseUrl}/api/v1/public/stores?${query}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const page: PublicStorePage = await res.json();
    return page.content ?? [];
  } catch {
    return [];
  }
}

async function fetchRecommended(query: string): Promise<PublicStore[]> {
  try {
    const res = await fetch(`${backendBaseUrl}/api/v1/public/stores/recommended?${query}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const page: PublicStorePage = await res.json();
    return page.content ?? [];
  } catch {
    return [];
  }
}

export default async function StoreListingPage() {
  const [recommended, recommendedFallback, promotions, stores] = await Promise.all([
    fetchRecommended("size=10"),
    fetchStores("size=10"),
    fetchStores("size=50"),
    fetchStores("size=100"),
  ]);

  const initial: MarketplaceInitialData = {
    recommended,
    recommendedFallback,
    promotions,
    stores,
  };

  return <HomePage initial={initial} />;
}
