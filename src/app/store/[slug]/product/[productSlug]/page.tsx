import { backendBaseUrl } from "@/lib/seo";
import type { PublicStoreDetailResponse, StorefrontItemResponse } from "@/lib/type/storeType";
import DetailProductPage from "./product-detail-client";

/**
 * Fetches the shop's menu on the server so a shopper arriving from a shared link
 * sees the product rather than a skeleton.
 *
 * The menu is what identifies the product — there is no endpoint for one item —
 * so the same request already serves the page's metadata, and Next reuses it
 * rather than asking twice.
 */
async function fetchItems(storeSlug: string): Promise<StorefrontItemResponse[]> {
  try {
    const res = await fetch(`${backendBaseUrl}/api/v1/public/stores/${storeSlug}/items`, {
      next: { revalidate: 60 },
    });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

async function fetchStore(storeSlug: string): Promise<PublicStoreDetailResponse | null> {
  try {
    const res = await fetch(`${backendBaseUrl}/api/v1/public/stores/${storeSlug}`, {
      next: { revalidate: 60 },
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const { slug, productSlug } = await params;
  const [items, store] = await Promise.all([fetchItems(slug), fetchStore(slug)]);

  return (
    <DetailProductPage
      storeSlug={slug}
      productSlug={productSlug}
      initialItems={items}
      initialStore={store}
    />
  );
}
