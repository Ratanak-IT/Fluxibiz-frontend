import type { MetadataRoute } from "next";
import { SITE_URL, backendBaseUrl } from "@/lib/seo";
import type { PublicStorePage, StorefrontItemResponse } from "@/lib/type/storeType";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/store", changeFrequency: "daily", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/feature", changeFrequency: "monthly", priority: 0.6 },
  { path: "/support", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/register", changeFrequency: "monthly", priority: 0.5 },
  { path: "/register/business", changeFrequency: "monthly", priority: 0.5 },
];

const MAX_STORE_PAGES = 10;
const STORE_PAGE_SIZE = 100;
const MAX_STORES_FOR_PRODUCTS = 300;

async function fetchAllStoreSlugs(): Promise<string[]> {
  const slugs: string[] = [];

  for (let page = 0; page < MAX_STORE_PAGES; page++) {
    try {
      const res = await fetch(
        `${backendBaseUrl}/api/v1/public/stores?page=${page}&size=${STORE_PAGE_SIZE}`,
        { next: { revalidate: 3600 } },
      );
      if (!res.ok) break;

      const data: PublicStorePage = await res.json();
      for (const store of data.content ?? []) {
        if (store.slug) slugs.push(store.slug);
      }

      if (page + 1 >= (data.page?.totalPages ?? 1)) break;
    } catch {
      break;
    }
  }

  return slugs;
}

async function fetchStoreProductSlugs(storeSlug: string): Promise<string[]> {
  try {
    const res = await fetch(
      `${backendBaseUrl}/api/v1/public/stores/${storeSlug}/items`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];

    const items: StorefrontItemResponse[] = await res.json();
    return items.map((item) => item.slug || item.id).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const slugs = await fetchAllStoreSlugs();

  const storeEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/store/${slug}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const storesForProducts = slugs.slice(0, MAX_STORES_FOR_PRODUCTS);
  const productSlugsByStore = await Promise.all(
    storesForProducts.map(async (slug) => ({
      slug,
      productSlugs: await fetchStoreProductSlugs(slug),
    })),
  );

  const productEntries: MetadataRoute.Sitemap = productSlugsByStore.flatMap(
    ({ slug, productSlugs }) =>
      productSlugs.map((productSlug) => ({
        url: `${SITE_URL}/store/${slug}/product/${productSlug}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
  );

  return [...staticEntries, ...storeEntries, ...productEntries];
}
