import type { Metadata } from "next";
import type { ReactNode } from "react";
import { resolveMediaUrl } from "@/lib/type/cartType";
import type { ChannelSchedule, PublicStoreDetailResponse } from "@/lib/type/storeType";
import { SITE_URL, absoluteUrl, backendBaseUrl } from "@/lib/seo";

interface StoreLayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

async function fetchStore(slug: string): Promise<{
  store: PublicStoreDetailResponse | null;
  status: number;
}> {
  const res = await fetch(`${backendBaseUrl}/api/v1/public/stores/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return { store: null, status: res.status };
  return { store: await res.json(), status: res.status };
}

function buildStoreTitle(store: PublicStoreDetailResponse, fallbackName: string): string {
  const name = store.name || store.displayName || fallbackName;
  const category = store.category?.name;
  const city = store.cityOrProvince;

  if (category && city) return `${name} — ${category} in ${city} | FluxiBiz`;
  if (category) return `${name} — ${category} | FluxiBiz`;
  if (city) return `${name} — ${city} | FluxiBiz`;
  return `${name} | FluxiBiz`;
}

function buildStoreDescription(store: PublicStoreDetailResponse, name: string): string {
  const about = (store.about ?? "").trim();
  if (about.length >= 40) return about;

  const category = store.category?.name;
  const city = store.cityOrProvince;
  const location = [category, city].filter(Boolean).join(" in ");

  if (about && location) {
    return `${about} — ${name} is a ${location} storefront on FluxiBiz.`;
  }
  if (location) {
    return `${name} is a ${location} storefront on FluxiBiz. Browse the menu, products, and order online.`;
  }
  if (about) return about;
  return `Explore ${name}'s storefront on FluxiBiz — browse products, check hours, and order online.`;
}

const DAY_KEY_TO_SCHEMA: Record<string, string> = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};

function buildOpeningHoursSpecification(
  schedule?: ChannelSchedule | null,
): Array<Record<string, unknown>> | undefined {
  if (!schedule) return undefined;

  if (schedule.alwaysOpen) {
    return [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: Object.values(DAY_KEY_TO_SCHEMA).map(
          (day) => `https://schema.org/${day}`,
        ),
        opens: "00:00",
        closes: "23:59",
      },
    ];
  }

  if (!schedule.days) return undefined;

  const specs: Array<Record<string, unknown>> = [];
  for (const [dayKey, day] of Object.entries(schedule.days)) {
    const schemaDay = DAY_KEY_TO_SCHEMA[dayKey];
    if (!schemaDay || day.closed) continue;
    for (const window of day.windows ?? []) {
      if (!window?.open || !window?.close) continue;
      specs.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${schemaDay}`,
        opens: window.open,
        closes: window.close,
      });
    }
  }

  return specs.length > 0 ? specs : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const canonical = `${SITE_URL}/store/${slug}`;

  try {
    const { store, status } = await fetchStore(slug);

    if (!store) {
      return {
        title: "Storefront",
        description: "Browse menu items, products and services on FluxiBiz.",
        alternates: { canonical },
        robots: status === 404 ? { index: false, follow: true } : undefined,
      };
    }

    const storeName = store.name || store.displayName || slug;
    const title = buildStoreTitle(store, slug);
    const description = buildStoreDescription(store, storeName);

    const rawImage = store.logo || store.thumbnail;
    let imageUrl = absoluteUrl("/thumbnail/thumbnail1.png");

    if (rawImage) {
      const resolved = resolveMediaUrl(rawImage);
      if (resolved) {
        imageUrl = absoluteUrl(resolved);
      }
    }

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
            alt: `${storeName} Logo`,
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
      title: "Storefront",
      description: "Browse menu items, products and services on FluxiBiz.",
      alternates: { canonical },
    };
  }
}

export default async function StoreLayout({ children, params }: StoreLayoutProps) {
  const { slug } = await params;
  const { store } = await fetchStore(slug).catch(() => ({ store: null }));

  const canonical = `${SITE_URL}/store/${slug}`;
  const storeName = store?.name || store?.displayName || slug;

  const breadcrumbJsonLd = store
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Store", item: `${SITE_URL}/store` },
          { "@type": "ListItem", position: 3, name: storeName },
        ],
      }
    : null;

  const rawImage = store?.logo || store?.thumbnail;
  const resolvedImage = rawImage ? resolveMediaUrl(rawImage) : null;

  const businessJsonLd = store
    ? {
        "@context": "https://schema.org",
        "@type": "Store",
        name: storeName,
        url: canonical,
        image: resolvedImage ? absoluteUrl(resolvedImage) : undefined,
        telephone: store.phoneNumber || undefined,
        address:
          store.address || store.cityOrProvince
            ? {
                "@type": "PostalAddress",
                streetAddress: store.address || undefined,
                addressLocality: store.cityOrProvince || undefined,
              }
            : undefined,
        hasMap: store.googleMap || undefined,
        openingHoursSpecification: buildOpeningHoursSpecification(store.onlineHours),
      }
    : null;

  return (
    <>
      {businessJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
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
