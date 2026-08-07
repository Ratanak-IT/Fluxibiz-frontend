"use client";

import { useTranslations } from "next-intl";

import { use } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DescriptionCard from "@/components/store/productdetail/description-card";
import ProductDetail from "@/components/store/productdetail/product-detail";
import { MenuProductCard } from "@/components/store/detailstore/product-card";
import {
  useGetPublicStoreItemsQuery,
  useGetPublicStoreQuery,
} from "@/features/store-api/store-api";
import { MenuItemData } from "@/lib/store/detailstore/detailstore";
import { StorefrontItemResponse, primaryItemImage } from "@/lib/type/storeType";

import { formatPrice } from "@/lib/store/productdetail/product";

function toMenuItem(item: StorefrontItemResponse, currency?: string): MenuItemData {
  return {
    id: item.id,
    name: item.name,
    price:
      item.price !== undefined && item.price !== null
        ? String(item.price)
        : "0",
    currency: currency,
    description: item.description ?? "",
    category: item.itemGroup?.name ?? "Menu",
    image: primaryItemImage(item) ?? "",
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

  return (
    <div className="dark:bg-background">
      <ProductDetail
        item={rawItem}
        storeSlug={storeSlug}
        storeName={storeDetail?.name}
        currency={currency}
        isLoading={isLoadingItems}
      />
      
      <DescriptionCard
        description={rawItem?.description || undefined}
      />

      {relatedStoreItems.length > 0 && (
        <section className="mx-auto my-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
              You May Also Like
            </h2>
            <Link
              href={`/store/${storeSlug}`}
              className="flex items-center gap-1 text-sm font-semibold text-[#00932A] transition-colors hover:text-[#007d24]"
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