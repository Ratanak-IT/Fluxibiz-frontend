import { backendBaseUrl } from "@/lib/seo";
import type { PublicStoreDetailResponse, StorefrontItemResponse } from "@/lib/type/storeType";
import StoreDetail from "./store-detail-client";


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

  const [store, items] = await Promise.all([fetchStore(slug), fetchItems(slug)]);

  return <StoreDetail slug={slug} initialStore={store} initialItems={items} />;
}
