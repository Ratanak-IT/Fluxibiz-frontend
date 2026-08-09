"use client";

import { useTranslations } from "next-intl";

import { use, useState, useMemo } from "react";
import SearchFilterBar from "@/components/store/detailstore/button";

import CartSidebar from "@/components/store/detailstore/cart-sidebar";
import StoreCard from "@/components/store/detailstore/store-card";
import { MenuItemData } from "@/lib/store/detailstore/detailstore";
import { ChevronLeft, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { StorePageSkeleton } from "@/components/common/Skeletons";
import {
  useGetPublicStoreQuery,
  useGetPublicStoreItemsQuery,
} from "@/features/store-api/store-api";
import { resolveMediaUrl } from "@/lib/type/cartType";

import { StorefrontItemResponse, primaryItemImage } from "@/lib/type/storeType";
import { StoreCardData } from "@/lib/store/detailstore/store";
import ProductList from "@/components/store/detailstore/product-list";
import { formatPrice } from "@/lib/store/productdetail/product";

function toMenuItem(
  item: StorefrontItemResponse,
  fallbackCategory: string,
  currency?: string
): MenuItemData {
  return {
    id: item.id,
    name: item.name,
    price:
      item.price !== undefined && item.price !== null
        ? String(item.price)
        : "0",
    compareAtPrice:
      item.compareAtPrice !== undefined && item.compareAtPrice !== null
        ? String(item.compareAtPrice)
        : undefined,
    badge: item.badge,
    currency: currency,
    description: item.description ?? "",
    category: item.itemGroup?.name ?? fallbackCategory,
    image: primaryItemImage(item) ?? "",
    status: item.status,
    rawItem: item,
  };
}

export default function StoreDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = useTranslations("Store");
  const { slug } = use(params);
  const {
    data: storeDetail,
    isLoading: isLoadingStore,
    isError: isStoreError,
  } = useGetPublicStoreQuery(slug);
  const { data: storeItems = [], isLoading: isLoadingItems } =
    useGetPublicStoreItemsQuery(slug);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");
  const [sortBy, setSortBy] = useState("Default");

  // Dynamically derive category options from store's real items
  const dynamicCategories = useMemo(() => {
    const cats = new Set<string>();
    storeItems.forEach((item) => {
      const name = item.itemGroup?.name?.trim();
      if (name) cats.add(name);
    });
    return ["All", ...Array.from(cats)];
  }, [storeItems]);

  // Filter and sort items dynamically
  const filteredItems = useMemo(() => {
    let result = storeItems;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.itemGroup?.name && item.itemGroup.name.toLowerCase().includes(q)) ||
          (item.code && item.code.toLowerCase().includes(q)) ||
          (item.sku && item.sku.toLowerCase().includes(q)) ||
          (item.barcode && item.barcode.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((item) => {
        const catName = item.itemGroup?.name?.trim() || t("common.menu");
        return catName.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    // Price range filter
    if (selectedPriceRange !== "All Prices") {
      result = result.filter((item) => {
        const price = Number(item.price ?? 0);
        switch (selectedPriceRange) {
          case "Under $2":
            return price < 2;
          case "$2 - $5":
            return price >= 2 && price <= 5;
          case "$5 - $10":
            return price > 5 && price <= 10;
          case "Over $10":
            return price > 10;
          default:
            return true;
        }
      });
    }

    // Sort
    const sorted = [...result];
    if (sortBy === "Price: Low to High") {
      sorted.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0));
    } else if (sortBy === "Price: High to Low") {
      sorted.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
    } else if (sortBy === "Name: A to Z") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
  }, [storeItems, searchQuery, selectedCategory, selectedPriceRange, sortBy, t]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedPriceRange("All Prices");
    setSortBy("Default");
  };

  const resolvedImage =
    resolveMediaUrl(storeDetail?.logo) ??
    resolveMediaUrl(storeDetail?.thumbnail) ??
    "";

  const operatingHours =
    storeDetail?.operatingHours ??
    storeDetail?.hours ??
    (storeDetail?.openTime && storeDetail?.closeTime
      ? `${storeDetail.openTime} - ${storeDetail.closeTime}`
      : t("common.openAllDay"));

  const storeData: StoreCardData | undefined = storeDetail
    ? {
        id: storeDetail.id,
        name: storeDetail.name ?? storeDetail.displayName ?? "",
        category: storeDetail.category?.name ?? t("common.store"),
        description: storeDetail.about ?? "",
        location: storeDetail.cityOrProvince ?? t("common.noLocation"),
        address: storeDetail.address ?? storeDetail.cityOrProvince ?? t("common.noLocation"),
        googleMap: storeDetail.googleMap,
        hours: operatingHours,
        openTime: storeDetail.openTime ?? undefined,
        closeTime: storeDetail.closeTime ?? undefined,
        image: resolvedImage,
        discountLabel: storeDetail.discountLabel,
      }
    : undefined;

  const hasRealItems = storeItems.length > 0;
  const hasFilteredItems = filteredItems.length > 0;

  const currency = storeDetail?.displayCurrency || storeDetail?.baseCurrency;

  const groupedItems = filteredItems.reduce<Record<string, MenuItemData[]>>(
    (acc, item) => {
      const groupName = item.itemGroup?.name?.trim() || t("common.menu");
      if (!acc[groupName]) acc[groupName] = [];
      acc[groupName].push(toMenuItem(item, t("common.menu"), currency));
      return acc;
    },
    {},
  );

  const menuSections = Object.entries(groupedItems);
  const isLoading = isLoadingStore || isLoadingItems;

  return (
    <div className="mx-auto max-w-362.5 space-y-10 py-6 px-4 sm:px-10 dark:bg-background">
      <div className="mb-4 flex items-center justify-between px-4 sm:px-8 md:px-14 lg:px-23">
        <Link
          href="/store"
          className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("common.store")}
        </Link>

        {/* <Link
          href={`/cart?shop=${encodeURIComponent(slug)}`}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary sm:h-11 sm:px-5 lg:hidden"
        >
          <ShoppingCart className="h-4 w-4" />
          Cart
        </Link> */}
      </div>

      {isLoading ? (
        <StorePageSkeleton />
      ) : isStoreError ? (
        <div className="flex h-40 items-center justify-center text-sm text-destructive">
          {t("detail.storeLoadError")}
        </div>
      ) : (
        <>
          <div className="space-y-10">
            <StoreCard store={storeData} />
            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categories={dynamicCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedPriceRange={selectedPriceRange}
              onPriceRangeChange={setSelectedPriceRange}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              onReset={handleResetFilters}
            />
          </div>

          <div className="grid grid-cols-1 items-start justify-center gap-6 lg:grid-cols-[1fr_400px] lg:gap-0 lg:pr-25">
            <div className="min-w-0 space-y-2">
              {hasFilteredItems ? (
                menuSections.map(([groupTitle, items]) => (
                  <ProductList key={groupTitle} title={groupTitle} items={items} />
                ))
              ) : hasRealItems ? (
                <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                  <UtensilsCrossed className="h-8 w-8 text-neutral-400" />
                  <p className="text-base font-semibold text-neutral-800 dark:text-neutral-100">
                    {t("detail.noItemsFound")}
                  </p>
                  <p className="max-w-xs text-sm text-muted-foreground">
                    {t("detail.noItemsDescription")}
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary/90"
                  >
                    {t("filters.resetFilters")}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
                  <UtensilsCrossed className="h-8 w-8 text-neutral-300" />
                  <p className="text-base font-medium text-neutral-700 dark:text-neutral-200">
                    {t("detail.noMenuItems")}
                  </p>
                  <p className="max-w-xs text-sm text-muted-foreground">
                    {t("detail.noMenuItemsDescription")}
                  </p>
                </div>
              )}
            </div>

            <div className="hidden lg:block lg:pt-8">
              <div className="sticky top-6">
                <CartSidebar slug={slug} businessId={storeDetail?.id} />
              </div>
            </div>
          </div>

          <div className="px-4 pb-10 sm:px-6 lg:hidden">
            <CartSidebar slug={slug} businessId={storeDetail?.id} />
          </div>
        </>
      )}
    </div>
  );
}
