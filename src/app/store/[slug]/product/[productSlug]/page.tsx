"use client";

import { useTranslations } from "next-intl";

import { use } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DescriptionCard from "@/components/store/productdetail/description-card";
import ProductDetail from "@/components/store/productdetail/product-detail";
import { MenuProductCard } from "@/components/store/detailstore/product-card";
import { MenuProductCardSkeleton } from "@/components/common/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetPublicStoreItemsQuery,
  useGetPublicStoreQuery,
} from "@/features/store-api/store-api";
import { MenuItemData, isItemOutOfStock } from "@/lib/store/detailstore/detailstore";
import {
  StorefrontItemResponse,
  primaryItemImage,
  itemPriceRange,
  remainingStock,
  isStorefrontOpen,
} from "@/lib/type/storeType";

import { formatPrice } from "@/lib/store/productdetail/product";

function toMenuItem(item: StorefrontItemResponse, currency?: string): MenuItemData {
  const isOutOfStock = isItemOutOfStock(item);
  // An item sold in options is never sold as itself, so its own price is
  // empty and the options carry the real ones.
  const range = itemPriceRange(item);
  const hasOwnPrice = item.price !== undefined && item.price !== null;
  return {
    id: item.id,
    name: item.name,
    // An unpriced item is not a free one, so it carries no price at all.
    price: hasOwnPrice
      ? String(item.price)
      : range
        ? String(range.min)
        : undefined,
    priceMax:
      !hasOwnPrice && range && range.max > range.min
        ? String(range.max)
        : undefined,
    compareAtPrice:
      item.compareAtPrice !== undefined && item.compareAtPrice !== null
        ? String(item.compareAtPrice)
        : undefined,
    badge: item.badge,
    discountLabel: item.discountLabel,
    currency: currency,
    description: item.description ?? "",
    category: item.itemGroup?.name ?? "Menu",
    image: primaryItemImage(item) ?? "",
    status: item.status,
    remaining: remainingStock(item),
    isOutOfStock,
    rawItem: item,
  };
}

export default function DetailProductPage({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const unwrappedParams = use(params);
  const storeSlug = unwrappedParams?.slug ?? "";
  const productSlug = unwrappedParams?.productSlug ?? "";

  const { data: storeItems = [], isLoading: isLoadingItems } =
    useGetPublicStoreItemsQuery(storeSlug, { skip: !storeSlug });
  const { data: storeDetail } = useGetPublicStoreQuery(storeSlug, {
    skip: !storeSlug,
  });

  const rawItem = storeItems.find(
    (i) => i.id === productSlug || i.slug === productSlug
  );

  const relatedStoreItems = storeItems
    .filter((i) => i.id !== rawItem?.id)
    .slice(0, 6);

  const currency = storeDetail?.displayCurrency || storeDetail?.baseCurrency;
  const t = useTranslations("Store.common");

  // The online store's hours, as the checkout enforces them. A shopper who
  // can read the page can read this too, rather than finding out by being
  // refused at Add to Cart.
  const storeOpen = isStorefrontOpen(storeDetail);

  return (
    <div className="min-h-screen pb-28 dark:bg-background lg:pb-8">
      <ProductDetail
        item={rawItem}
        storeSlug={storeSlug}
        storeName={storeDetail?.name}
        currency={currency}
        isLoading={isLoadingItems}
        isStoreOpen={storeOpen}
        onlineHours={storeDetail?.onlineHours}
      />
      


      {isLoadingItems ? (
        <section className="mx-auto my-12 max-w-7xl px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-7 w-44 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <MenuProductCardSkeleton key={i} />
            ))}
          </div>
        </section>
      ) : relatedStoreItems.length > 0 && (
        <section className="mx-auto my-12 max-w-7xl px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
              You May Also Like
            </h2>
            <Link
              href={`/store/${storeSlug}`}
              className="flex items-center gap-1 text-sm text-[#00932A] transition-colors hover:text-[#007d24] hover:underline"
            >
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedStoreItems.map((item) => (
              <MenuProductCard key={item.id} item={toMenuItem(item, currency)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}