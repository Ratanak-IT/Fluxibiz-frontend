import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  primaryItemImage,
  StorefrontItemResponse,
  type PublicStoreDetailResponse,
} from "@/lib/type/storeType";
import { SITE_URL, absoluteUrl, backendBaseUrl } from "@/lib/seo";

interface ProductLayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string; productSlug: string }>;
}

async function findItem(
  storeSlug: string,
  productSlug: string,
): Promise<StorefrontItemResponse | null> {
  const res = await fetch(
    `${backendBaseUrl}/api/v1/public/stores/${storeSlug}/items`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) return null;

  const items: StorefrontItemResponse[] = await res.json();
  return (
    items.find((i) => i.slug === productSlug || i.id === productSlug) ?? null
  );
}

async function findStore(
  storeSlug: string,
): Promise<PublicStoreDetailResponse | null> {
  try {
    const res = await fetch(
      `${backendBaseUrl}/api/v1/public/stores/${storeSlug}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function buildProductTitle(
  item: StorefrontItemResponse,
  storeName: string | null,
): string {
  const category = item.itemGroup?.name;
  if (storeName && category) return `${item.name} — ${category} | ${storeName}`;
  if (storeName) return `${item.name} | ${storeName}`;
  return `${item.name} | FluxiBiz`;
}

function buildProductDescription(
  item: StorefrontItemResponse,
  storeName: string | null,
): string {
  const raw = (item.description ?? "").trim();
  if (raw.length >= 40) return raw;

  const category = item.itemGroup?.name;
  const parts = [
    category ? `${category} from` : "Available from",
    storeName ? `${storeName} on FluxiBiz.` : "a FluxiBiz storefront.",
  ];
  const contextSentence = parts.join(" ");

  if (raw) return `${raw} — ${contextSentence}`;
  return `${item.name}. ${contextSentence} Order online now.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}): Promise<Metadata> {
  const { slug, productSlug } = await params;
  const canonical = `${SITE_URL}/store/${slug}/product/${productSlug}`;

  try {
    const [item, store] = await Promise.all([
      findItem(slug, productSlug),
      findStore(slug),
    ]);

    if (!item) {
      return {
        title: "Product",
        description: "Browse this product on FluxiBiz.",
        alternates: { canonical },
        robots: { index: false, follow: true },
      };
    }

    const storeName = store?.name || store?.displayName || null;
    const title = buildProductTitle(item, storeName);
    const description = buildProductDescription(item, storeName);
    const rawImage = primaryItemImage(item);
    const imageUrl = rawImage
      ? absoluteUrl(rawImage)
      : absoluteUrl("/thumbnail/thumbnail1.png");

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: canonical,
        title,
        description,
        siteName: "FluxiBiz Storefront",
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 800,
            alt: item.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: "Product",
      description: "Browse this product on FluxiBiz.",
      alternates: { canonical },
    };
  }
}

export default async function ProductLayout({
  children,
  params,
}: ProductLayoutProps) {
  const { slug, productSlug } = await params;
  const [item, store] = await Promise.all([
    findItem(slug, productSlug).catch(() => null),
    findStore(slug),
  ]);

  const currency = store?.displayCurrency || store?.baseCurrency || undefined;
  const storeName = store?.name || store?.displayName || slug;
  const canonical = `${SITE_URL}/store/${slug}/product/${productSlug}`;

  const productJsonLd = item
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: item.name,
        description: item.description ?? undefined,
        sku: item.sku ?? undefined,
        category: item.itemGroup?.name ?? undefined,
        brand: item.businessName
          ? { "@type": "Brand", name: item.businessName }
          : undefined,
        image: primaryItemImage(item)
          ? [absoluteUrl(primaryItemImage(item)!)]
          : undefined,
        offers: {
          "@type": "Offer",
          url: canonical,
          price: item.price,
          priceCurrency: currency,
          availability:
            item.availableQuantity === 0
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
        },
      }
    : null;

  const breadcrumbJsonLd = item
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Store", item: `${SITE_URL}/store` },
          {
            "@type": "ListItem",
            position: 3,
            name: storeName,
            item: `${SITE_URL}/store/${slug}`,
          },
          { "@type": "ListItem", position: 4, name: item.name },
        ],
      }
    : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
