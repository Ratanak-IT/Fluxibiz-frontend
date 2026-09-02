import { backendBaseUrl } from "@/lib/seo";
import type { PublicStoreDetailResponse, StorefrontItemResponse } from "@/lib/type/storeType";
import StoreDetail from "./store-detail-client";

/**
 * Fetches the shop and its menu on the server so the browser is sent a page that
 * already has them.
 *
 * Rendered in the browser alone, this page could only start loading its data once
 * the JavaScript had arrived and run, and a shopper watched a skeleton for the
 * whole of that wait plus two round trips. Both calls go straight to the API
 * rather than through this app's own proxy — that hop exists to attach a
 * shopper's cookie, and there is no shopper here.
 *
 * A minute of staleness is invisible on a menu, and the API's own cache sits
 * behind this, so a popular shop costs a query neither here nor there.
 */
async function fetchStore(slug: string): Promise<PublicStoreDetailResponse | null> {
  try {
    const res = await fetch(`${backendBaseUrl}/api/v1/public/stores/${slug}`, {
      next: { revalidate: 60 },
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

async function fetchItems(slug: string): Promise<StorefrontItemResponse[]> {
  try {
    const res = await fetch(`${backendBaseUrl}/api/v1/public/stores/${slug}/items`, {
      next: { revalidate: 60 },
    });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // In parallel: one is not needed to ask for the other.
  const [store, items] = await Promise.all([fetchStore(slug), fetchItems(slug)]);

  // Neither fetch throws. If the API is unreachable from here the page still
  // renders and the browser's own queries take over, which is exactly how this
  // page behaved before it was given a server side at all.
  return <StoreDetail slug={slug} initialStore={store} initialItems={items} />;
}
