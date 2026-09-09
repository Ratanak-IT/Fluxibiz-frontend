import { backendBaseUrl } from "@/lib/seo";
import type { PublicStoreDetailResponse, StorefrontItemResponse } from "@/lib/type/storeType";
import DetailProductPage from "./product-detail-client";

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
