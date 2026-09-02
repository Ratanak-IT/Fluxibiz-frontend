import { backendBaseUrl } from "@/lib/seo";
import type { PublicStore, PublicStorePage } from "@/lib/type/storeType";
import HomePage, { type MarketplaceInitialData } from "./marketplace-client";

/**
 * Fetches the marketplace on the server, so the landing page arrives with shops
 * on it instead of four skeletons and a wait for JavaScript.
 *
 * The four requests mirror the four this page makes in the browser, at the
 * arguments it uses before anyone has touched a filter or shared a location.
 * They run together, they go straight to the API rather than through this app's
 * proxy — that hop exists to attach a shopper's cookie, and there is no shopper
 * here — and the API caches these listings for a minute, so a busy marketplace
 * serves most of them without touching the database at all.
 *
 * Once the browser takes over, every one of these is re-fetched with the
 * shopper's real location and filters, and the distances appear.
 */
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
