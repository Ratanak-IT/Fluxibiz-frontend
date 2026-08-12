import type { Metadata } from "next";
import type { ReactNode } from "react";
import { resolveMediaUrl } from "@/lib/type/cartType";

interface StoreLayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fluxibiz.store";
  const backendBaseUrl = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080"
  ).replace(/\/$/, "");

  try {
    const res = await fetch(`${backendBaseUrl}/api/v1/public/stores/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return {
        title: "Storefront",
        description: "Browse menu items, products and services on FluxiBiz.",
      };
    }

    const store = await res.json();
    const storeName = store.name || store.displayName || slug;
    const title = `${storeName} | FluxiBiz`;
    const description =
      store.about ||
      store.description ||
      `Explore ${storeName} store menu, products, and special offers on FluxiBiz.`;

    const rawImage = store.logo || store.thumbnail;
    let imageUrl = `${siteUrl}/desktop-view.png`;

    if (rawImage) {
      const resolved = resolveMediaUrl(rawImage);
      if (resolved) {
        imageUrl = resolved.startsWith("/") ? `${siteUrl}${resolved}` : resolved;
      }
    }

    return {
      title,
      description,
      openGraph: {
        type: "website",
        url: `${siteUrl}/store/${slug}`,
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
    };
  }
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  return <>{children}</>;
}
