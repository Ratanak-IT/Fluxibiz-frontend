"use client";

import { useTranslations } from "next-intl";

import { use, useState, useMemo } from "react";
import SearchFilterBar from "@/components/store/detailstore/button";

import CartSidebar from "@/components/store/detailstore/cart-sidebar";
import StoreCard from "@/components/store/detailstore/store-card";
import { useTodayHoursLabel } from "@/components/store/detailstore/store-hours";
import { MenuItemData, isItemOutOfStock } from "@/lib/store/detailstore/detailstore";
import { ChevronLeft, Clock, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { StorePageSkeleton } from "@/components/common/Skeletons";
import ApiErrorFallback from "@/components/common/api-error-fallback";
import {
  useGetPublicStoreQuery,
  useGetPublicStoreItemsQuery,
  useGetFacebookSocialSettingsQuery,
} from "@/features/store-api/store-api";
import { resolveMediaUrl } from "@/lib/type/cartType";

import {
  StorefrontItemResponse,
  primaryItemImage,
  itemPriceRange,
  sellingPriceFrom,
  remainingStock,
  isStorefrontOpen,
} from "@/lib/type/storeType";
import { StoreCardData } from "@/lib/store/detailstore/store";
import ProductList from "@/components/store/detailstore/product-list";
import { formatPrice } from "@/lib/store/productdetail/product";
import { useShopperLocation } from "@/lib/hooks/useShopperLocation";
import { useIsTma } from "@/lib/tma/useIsTma";
import { useIsMessenger } from "@/lib/tma/useIsMessenger";

function toMenuItem(
  item: StorefrontItemResponse,
  fallbackCategory: string,
  currency?: string
): MenuItemData {
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
    currency: currency,
    description: item.description ?? "",
    category: item.itemGroup?.name ?? fallbackCategory,
    image: primaryItemImage(item) ?? "",
    status: item.status,
    remaining: remainingStock(item),
    isOutOfStock,
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
  const { coords } = useShopperLocation();
  const isTma = useIsTma();
  const isMessenger = useIsMessenger();
  const isMiniAppMode = isTma || isMessenger;
  const {
    data: storeDetail,
    isLoading: isLoadingStore,
    isError: isStoreError,
  } = useGetPublicStoreQuery({ slug, lat: coords?.lat, lng: coords?.lng });
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
        // The least it can be bought for, so an item priced only through its
        // options is filtered on a price it really has rather than on zero.
        const price = sellingPriceFrom(item) ?? 0;
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
      sorted.sort(
        (a, b) => (sellingPriceFrom(a) ?? 0) - (sellingPriceFrom(b) ?? 0),
      );
    } else if (sortBy === "Price: High to Low") {
      sorted.sort(
        (a, b) => (sellingPriceFrom(b) ?? 0) - (sellingPriceFrom(a) ?? 0),
      );
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

  // The online store's own hours, as the checkout enforces them — not the
  // shopfront's opening times, which say nothing about the web.
  const storefrontOpen = isStorefrontOpen(storeDetail);
  const todayHours = useTodayHoursLabel(storeDetail?.onlineHours);

  const { data: facebookSettings } = useGetFacebookSocialSettingsQuery(
    storeDetail?.id || slug,
    { skip: !slug }
  );

  const facebookInfo = useMemo(() => {
    const parseFbSlug = (urlStr?: string): string => {
      if (!urlStr) return "Facebook Page";
      try {
        const parsed = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
        const pathname = parsed.pathname.replace(/\/$/, "");
        const parts = pathname.split("/").filter(Boolean);
        if (parts.length > 0) {
          const last = parts[parts.length - 1];
          if (last && !last.includes("profile.php") && last !== "pages") {
            return decodeURIComponent(last);
          }
        }
      } catch {
        // fallback
      }
      return "Facebook Page";
    };

    // 0. Check response from /businesses/social-settings/facebook endpoint
    if (facebookSettings) {
      const fs = facebookSettings as any;
      const fsName =
        fs.pageName ||
        fs.page_name ||
        fs.name ||
        fs.facebookPageName ||
        fs.facebook_page_name ||
        fs.title;
      const fsUrl =
        fs.pageUrl ||
        fs.page_url ||
        fs.url ||
        fs.link ||
        fs.facebookPageUrl ||
        fs.facebook_page_url;

      if (fsName || fsUrl) {
        const finalUrl = fsUrl || `https://facebook.com/${encodeURIComponent(fsName || "")}`;
        const finalName = fsName || parseFbSlug(finalUrl);
        return { url: finalUrl, name: finalName };
      }
    }

    if (!storeDetail) return null;
    const sd = storeDetail as any;

    // 1. Direct top-level connected Facebook properties & sub-objects
    const connectedName =
      sd.facebookPageName ||
      sd.facebook_page_name ||
      sd.facebookName ||
      sd.facebook_name ||
      sd.linkedFacebookPage ||
      sd.linked_facebook_page ||
      sd.linkedFacebookPageName ||
      sd.linked_facebook_page_name ||
      sd.facebookPageTitle ||
      sd.facebook_page_title ||
      sd.facebookPage?.name ||
      sd.facebookPage?.pageName ||
      sd.facebookPage?.page_name ||
      sd.facebookPage?.title ||
      sd.facebook_page?.name ||
      sd.facebook_page?.page_name ||
      sd.facebook_page?.title ||
      sd.facebookIntegration?.pageName ||
      sd.facebookIntegration?.page_name ||
      sd.facebookIntegration?.name ||
      sd.facebook_integration?.pageName ||
      sd.facebook_integration?.page_name ||
      sd.facebook_integration?.name ||
      sd.facebookDetails?.name ||
      sd.facebookDetails?.pageName ||
      sd.facebook_details?.name ||
      sd.facebook_details?.page_name ||
      sd.messengerPage?.name ||
      sd.messenger_page?.name;

    const connectedUrl =
      sd.facebookPageUrl ||
      sd.facebook_page_url ||
      sd.facebookUrl ||
      sd.facebook_url ||
      sd.linkedFacebookPageUrl ||
      sd.linked_facebook_page_url ||
      sd.facebookPage?.url ||
      sd.facebookPage?.link ||
      sd.facebook_page?.url ||
      sd.facebook_page?.link ||
      sd.facebookIntegration?.url ||
      sd.facebookIntegration?.link ||
      sd.facebook_integration?.url ||
      sd.facebook_integration?.link;

    if (connectedName || connectedUrl) {
      const finalUrl =
        connectedUrl ||
        (sd.website && sd.website.toLowerCase().includes("facebook.com")
          ? sd.website
          : `https://facebook.com/${encodeURIComponent(connectedName || "")}`);
      const finalName = connectedName || parseFbSlug(finalUrl);
      return { url: finalUrl, name: finalName };
    }

    // 2. integrations array
    if (Array.isArray(sd.integrations)) {
      for (const item of sd.integrations) {
        if (typeof item === "object" && item !== null) {
          const type = (item.type || item.platform || item.provider || "").toLowerCase();
          if (type.includes("facebook") || type.includes("messenger")) {
            const name = item.pageName || item.page_name || item.name || item.title || item.label;
            const url = item.url || item.link || item.facebookUrl;
            if (name || url) {
              const finalUrl = url || `https://facebook.com/${encodeURIComponent(name || "")}`;
              const finalName = name || parseFbSlug(finalUrl);
              return { url: finalUrl, name: finalName };
            }
          }
        }
      }
    }

    // 3. socialLinks array or object
    const social = sd.socialLinks;
    if (social) {
      if (Array.isArray(social)) {
        for (const item of social) {
          if (typeof item === "object" && item !== null) {
            const url = item.url || item.facebook || item.link || item.href || item.facebookUrl || item.facebook_url;
            const name = item.name || item.pageName || item.page_name || item.title || item.label || item.facebookPageName || item.facebook_page_name;

            if (url && String(url).toLowerCase().includes("facebook.com")) {
              return {
                url: String(url),
                name: name ? String(name) : parseFbSlug(String(url)),
              };
            }

            if (name && (item.platform?.toLowerCase() === "facebook" || item.type?.toLowerCase() === "facebook")) {
              return {
                url: url ? String(url) : `https://facebook.com/${encodeURIComponent(name)}`,
                name: String(name),
              };
            }

            for (const [key, val] of Object.entries(item)) {
              if (
                key.toLowerCase().includes("facebook") &&
                typeof val === "string" &&
                val.trim()
              ) {
                const isUrl = val.toLowerCase().includes("facebook.com");
                return {
                  url: isUrl ? val : `https://facebook.com/${encodeURIComponent(val)}`,
                  name: name ? String(name) : isUrl ? parseFbSlug(val) : val,
                };
              }
            }
          }
        }
      } else if (typeof social === "object") {
        const url = social.facebook || social.facebookUrl || social.url;
        const name = social.facebookPageName || social.facebookName || social.name || social.pageName;
        if (url || name) {
          const finalUrl = url || `https://facebook.com/${encodeURIComponent(name)}`;
          const finalName = name || parseFbSlug(finalUrl);
          return { url: finalUrl, name: finalName };
        }
      }
    }

    // 4. Website
    if (sd.website && sd.website.toLowerCase().includes("facebook.com")) {
      return {
        url: sd.website,
        name: parseFbSlug(sd.website),
      };
    }

    // 5. facebook string field
    if (typeof sd.facebook === "string" && sd.facebook.trim()) {
      const fbVal = sd.facebook.trim();
      const isUrl = fbVal.toLowerCase().includes("facebook.com");
      return {
        url: isUrl ? fbVal : `https://facebook.com/${encodeURIComponent(fbVal)}`,
        name: isUrl ? parseFbSlug(fbVal) : fbVal,
      };
    }

    return null;
  }, [storeDetail, facebookSettings]);

  const storeData: StoreCardData | undefined = storeDetail
    ? {
        id: storeDetail.id,
        name: storeDetail.name ?? storeDetail.displayName ?? "",
        category: storeDetail.category?.name ?? t("common.store"),
        description: storeDetail.about ?? "",
        location: storeDetail.cityOrProvince ?? t("common.noLocation"),
        address: storeDetail.address ?? storeDetail.cityOrProvince ?? t("common.noLocation"),
        googleMap: storeDetail.googleMap,
        phoneNumber: storeDetail.phoneNumber,
        facebookUrl: facebookInfo?.url ?? null,
        facebookName: facebookInfo?.name ?? null,
        hours: operatingHours,
        openTime: storeDetail.openTime ?? undefined,
        closeTime: storeDetail.closeTime ?? undefined,
        image: resolvedImage,
        discountLabel: storeDetail.discountLabel,
        isOpen: storefrontOpen,
        onlineHours: storeDetail.onlineHours,
        distanceKm: storeDetail.distanceKm,
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
      {/* The Mini App is scoped to this one business's own Telegram/Messenger
          bot — a way back to the general store directory makes no sense
          there, same reasoning as hiding the site-wide Navbar/Footer. */}
      {!isMiniAppMode && (
        <div className="mb-4 flex items-center justify-between px-4 sm:px-6 md:px-12 lg:px-20">
          <Link
            href="/store"
            className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("common.store")}
          </Link>
        </div>
      )}

      {isLoading ? (
        <StorePageSkeleton />
      ) : isStoreError ? (
        <ApiErrorFallback
          title={t("detail.couldNotLoadStore")}
          description={t("detail.checkStoreAddressOrConnection")}
          onRetry={() => window.location.reload()}
          backHref={isMiniAppMode ? undefined : "/store"}
        />
      ) : (
        <>
          <div className="space-y-10">
            <StoreCard store={storeData} />
            <div className="sticky top-0 z-30 bg-background/95 py-2.5 backdrop-blur-md">
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
          </div>

          {/* Said once, at the top: the menu below is still worth reading,
              but nothing on it can be ordered until the shop reopens. */}
          {storeDetail && !storefrontOpen ? (
            <div className="mt-6 px-4 sm:px-6 md:px-12 lg:px-20">
              <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-400">
                <Clock className="h-4 w-4 shrink-0" />
                <span className="font-bold">{t("detail.storeClosed")}</span>
                {todayHours ? <span>· {todayHours}</span> : null}
              </div>
            </div>
          ) : null}

          <div id="categories" className="scroll-mt-20 px-4 sm:px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
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

              <div className="hidden lg:block lg:pt-4">
                <div className="sticky top-6">
                  <CartSidebar slug={slug} businessId={storeDetail?.id} storeCurrency={currency} />
                </div>
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
}
