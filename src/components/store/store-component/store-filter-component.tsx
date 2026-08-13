"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Loader2, Search, SlidersHorizontal, X } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetBusinessCategoryQuery,
  useGetPublicStoresQuery,
} from "@/features/store-api/store-api";
import SearchDrawer from "./search";
import ApiErrorFallback from "@/components/common/api-error-fallback";
import type { PublicStore } from "@/lib/type/storeType";

interface StoreFilterComponentProps {
  selected?: string[];
  onSelectedChange?: (selected: string[]) => void;
  selectedLocations?: string[];
  onLocationsChange?: (locations: string[]) => void;
  availableLocations?: string[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const VISIBLE_COUNT = 5;

export default function StoreFilterComponent({
  selected = [],
  onSelectedChange,
  selectedLocations = [],
  onLocationsChange,
  availableLocations,
  searchValue,
  onSearchChange,
}: StoreFilterComponentProps) {
  const t = useTranslations("Store.filters");
  const [showMore, setShowMore] = useState(false);
  const [showMoreLocations, setShowMoreLocations] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState("");

  const [apiLocations, setApiLocations] = useState<string[]>([]);
  const [isFetchingLocations, setIsFetchingLocations] = useState(false);

  const {
    data: category = [],
    isLoading,
    isError,
    refetch,
  } = useGetBusinessCategoryQuery();

  const {
    data: storesData,
    isLoading: isLoadingStores,
    isError: isErrorStores,
    refetch: refetchStores,
  } = useGetPublicStoresQuery({ size: 100 });

  useEffect(() => {
    if (availableLocations && availableLocations.length > 0) {
      setApiLocations(availableLocations);
      return;
    }

    const stores = storesData?.content ?? [];
    if (stores.length === 0) return;

    let isMounted = true;
    setIsFetchingLocations(true);

    async function loadStoreLocations() {
      const set = new Set<string>();

      // 1. Collect non-empty cityOrProvince / address from store list items
      for (const store of stores) {
        if (store.cityOrProvince?.trim()) set.add(store.cityOrProvince.trim());
        if (store.address?.trim()) set.add(store.address.trim());
      }

      // 2. Fetch store details for stores without address in summary list
      const missingDetailStores = stores.filter(
        (s) => !s.cityOrProvince?.trim() && !s.address?.trim() && (s.slug || s.id),
      );

      if (missingDetailStores.length > 0) {
        await Promise.all(
          missingDetailStores.map(async (store) => {
            try {
              const res = await fetch(`/api/v1/public/stores/${store.slug || store.id}`);
              if (res.ok) {
                const detail = await res.json();
                const locStr = detail.cityOrProvince?.trim() || detail.address?.trim();
                if (locStr) {
                  set.add(locStr);
                }
              }
            } catch {
              // Ignore single store fetch failure
            }
          }),
        );
      }

      // 3. Process comma-separated locations for district/city parts
      const finalSet = new Set<string>();
      for (const item of set) {
        finalSet.add(item);
        if (item.includes(",")) {
          const parts = item.split(",").map((p) => p.trim()).filter(Boolean);
          for (const p of parts) {
            if (p.length >= 3 && !/^\d+$/.test(p) && !/^no\.\d+/i.test(p)) {
              finalSet.add(p);
            }
          }
        }
      }

      if (isMounted) {
        setApiLocations(Array.from(finalSet).sort());
        setIsFetchingLocations(false);
      }
    }

    loadStoreLocations();

    return () => {
      isMounted = false;
    };
  }, [storesData, availableLocations]);

  const currentSearchValue = searchValue ?? localSearchValue;

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
      return;
    }
    setLocalSearchValue(value);
  };

  const allTypes = category.flatMap((categoryItem) =>
    categoryItem.subCategories && categoryItem.subCategories.length > 0
      ? categoryItem.subCategories
      : [
        {
          id: categoryItem.id,
          name: categoryItem.name,
          slug: categoryItem.slug,
        },
      ],
  );

  const visibleTypes = allTypes.slice(0, VISIBLE_COUNT);
  const extraTypes = allTypes.slice(VISIBLE_COUNT);

  const toggleCategory = (id: string) => {
    const nextSelected = selected.includes(id)
      ? selected.filter((selectedId) => selectedId !== id)
      : [...selected, id];
    onSelectedChange?.(nextSelected);
  };

  const toggleLocation = (loc: string) => {
    const nextLocations = selectedLocations.includes(loc)
      ? selectedLocations.filter((item) => item !== loc)
      : [...selectedLocations, loc];
    onLocationsChange?.(nextLocations);
  };

  const visibleLocations = apiLocations.slice(0, VISIBLE_COUNT);
  const extraLocations = apiLocations.slice(VISIBLE_COUNT);

  const hasActiveFilters =
    currentSearchValue.trim() !== "" ||
    selected.length > 0 ||
    selectedLocations.length > 0;

  const handleResetFilters = () => {
    handleSearchChange("");
    onSelectedChange?.([]);
    onLocationsChange?.([]);
  };

  const loadingLocations = isLoadingStores || isFetchingLocations;

  const renderLocationItemsOnly = () => (
    <>
      {loadingLocations && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span>{t("loading")}</span>
        </div>
      )}

      {isErrorStores && !loadingLocations && (
        <ApiErrorFallback
          variant="compact"
          title={t("cannotLoadLocations")}
          onRetry={() => refetchStores()}
        />
      )}

      {!loadingLocations && !isErrorStores && (
        <>
          {apiLocations.length === 0 ? (
            <p className="text-xs text-muted-foreground py-1">{t("noLocationsFound")}</p>
          ) : (
            <div className="space-y-2.5">
              {visibleLocations.map((loc) => {
                const checkboxId = `store-location-${loc}`;
                return (
                  <div key={loc} className="flex items-center gap-2 min-w-0">
                    <Checkbox
                      id={checkboxId}
                      checked={selectedLocations.includes(loc)}
                      onCheckedChange={() => toggleLocation(loc)}
                    />
                    <Label
                      htmlFor={checkboxId}
                      className="cursor-pointer text-sm font-medium text-foreground min-w-0 break-words hover:text-primary transition-colors duration-150"
                    >
                      {loc}
                    </Label>
                  </div>
                );
              })}

              {extraLocations.length > 0 && (
                <Collapsible open={showMoreLocations} onOpenChange={setShowMoreLocations}>
                  <CollapsibleContent className="space-y-2.5">
                    {extraLocations.map((loc) => {
                      const checkboxId = `store-extra-location-${loc}`;
                      return (
                        <div key={loc} className="flex items-center gap-2 min-w-0">
                          <Checkbox
                            id={checkboxId}
                            checked={selectedLocations.includes(loc)}
                            onCheckedChange={() => toggleLocation(loc)}
                          />
                          <Label
                            htmlFor={checkboxId}
                            className="cursor-pointer text-sm font-medium text-foreground min-w-0 break-words hover:text-primary transition-colors duration-150"
                          >
                            {loc}
                          </Label>
                        </div>
                      );
                    })}
                  </CollapsibleContent>

                  <CollapsibleTrigger className="mt-2.5 flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    {showMoreLocations ? t("showLess") : t("showMore")}
                    <ChevronDown
                      className={`size-4 transition-transform duration-200 ${showMoreLocations ? "rotate-180" : ""}`}
                    />
                  </CollapsibleTrigger>
                </Collapsible>
              )}
            </div>
          )}
        </>
      )}
    </>
  );

  const renderLocationFilters = () => (
    <div>
      <h4 className="sticky top-0 z-20 mb-3 bg-card py-3 text-lg font-medium text-foreground transition-colors hover:text-primary cursor-default">
        {t("locations")}
      </h4>
      {renderLocationItemsOnly()}
    </div>
  );

  const renderCategoryItemsOnly = () => (
    <>
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span>{t("loading")}</span>
        </div>
      )}

      {isError && !isLoading && (
        <ApiErrorFallback
          variant="compact"
          title={t("cannotLoadTypes")}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && (
        <div className="space-y-2.5">
          {visibleTypes.map((categoryType) => {
            const checkboxId = `store-category-${categoryType.id}`;
            return (
              <div key={categoryType.id} className="flex items-center gap-2 min-w-0">
                <Checkbox
                  id={checkboxId}
                  checked={selected.includes(categoryType.id)}
                  onCheckedChange={() => toggleCategory(categoryType.id)}
                />
                <Label htmlFor={checkboxId} className="cursor-pointer text-sm font-medium text-foreground min-w-0 break-words hover:text-primary transition-colors duration-150">
                  {categoryType.name}
                </Label>
              </div>
            );
          })}

          {extraTypes.length > 0 && (
            <Collapsible open={showMore} onOpenChange={setShowMore}>
              <CollapsibleContent className="space-y-2.5">
                {extraTypes.map((categoryType) => {
                  const checkboxId = `store-extra-category-${categoryType.id}`;
                  return (
                    <div key={categoryType.id} className="flex items-center gap-2 min-w-0">
                      <Checkbox
                        id={checkboxId}
                        checked={selected.includes(categoryType.id)}
                        onCheckedChange={() => toggleCategory(categoryType.id)}
                      />
                      <Label htmlFor={checkboxId} className="cursor-pointer text-sm font-medium text-foreground min-w-0 break-words hover:text-primary transition-colors duration-150">
                        {categoryType.name}
                      </Label>
                    </div>
                  );
                })}
              </CollapsibleContent>

              <CollapsibleTrigger className="mt-2.5 flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                {showMore ? t("showLess") : t("showMore")}
                <ChevronDown
                  className={`size-4 transition-transform duration-200 ${showMore ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
            </Collapsible>
          )}
        </div>
      )}
    </>
  );

  const renderCategoryFilters = () => (
    <div>
      <h4 className="sticky top-0 z-20 mb-3 bg-card py-3 text-lg font-medium text-foreground transition-colors hover:text-primary cursor-default">
        {t("shopTypes")}
      </h4>
      {renderCategoryItemsOnly()}
    </div>
  );

  return (
    <div className="w-full max-w-full">
      {/* Mobile/tablet SearchDrawer */}
      <SearchDrawer
        value={currentSearchValue}
        onChange={handleSearchChange}
        open={mobileSearchOpen}
        onOpenChange={setMobileSearchOpen}
        hideTrigger
      />

      <div className="xl:hidden">
        <div className="flex w-full min-w-0 items-center gap-2.5">
          <div className="group relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              strokeWidth={2}
              className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-primary transition-colors duration-200"
            />
            <Input
              type="text"
              value={currentSearchValue}
              readOnly
              onClick={() => setMobileSearchOpen(true)}
              onFocus={(e) => {
                e.target.blur();
                setMobileSearchOpen(true);
              }}
              placeholder={t("searchPlaceholder")}
              className="
                h-12
                min-w-0
                w-full
                rounded-full
                border
                border-primary/40
                bg-white
                pl-11
                pr-4
                text-sm
                shadow-none
                outline-none
                cursor-pointer
                placeholder:truncate
                placeholder:text-neutral-400
                hover:bg-neutral-50
                focus-visible:border-primary
                focus-visible:ring-1
                focus-visible:ring-primary/20
                dark:border-primary/50
                dark:bg-card
                dark:hover:bg-muted
              "
            />
          </div>

          <Drawer open={mobileFilterOpen} onOpenChange={setMobileFilterOpen} showSwipeHandle>
            <DrawerTrigger
              render={
                <button
                  type="button"
                  aria-label={t("openFilters")}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-white outline-none transition-colors duration-200 hover:border-primary hover:bg-neutral-50 dark:border-primary/50 dark:bg-card dark:hover:bg-muted text-neutral-900 dark:text-neutral-100"
                >
                  <SlidersHorizontal strokeWidth={2} className="h-4 w-4 text-primary" />
                </button>
              }
            />
            <DrawerContent className="rounded-t-[28px] border-t border-border/10 bg-card p-0 overflow-x-hidden">
              <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-4 sm:px-5">
                <div className="min-w-0">
                  <DrawerTitle className="text-xl font-bold text-foreground truncate hover:text-primary transition-colors">{t("title")}</DrawerTitle>
                </div>
                <DrawerClose
                  render={
                    <button
                      type="button"
                      className="shrink-0 rounded-full border border-primary/40 bg-transparent px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary/5 focus-visible:ring-1 focus-visible:ring-primary/20 dark:border-primary/50"
                    >
                      {t("close")}
                    </button>
                  }
                />
              </div>

              <div className="max-h-[70vh] space-y-6 overflow-y-auto overflow-x-hidden p-4 pt-0 sm:p-5 sm:pt-0">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mb-2 mt-3 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400"
                  >
                    {t("resetFilters")}
                  </button>
                )}
                {renderCategoryFilters()}
                {renderLocationFilters()}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* Desktop Sidebar Layout with Primary Colored Search Icon & Text Hover Effects */}
      <div className="hidden w-full max-w-[420px] xl:block xl:min-w-[340px]">
        {/* Top Sticky Header (Search Icon + Filters Title) */}
        <div className="sticky top-0 z-30 bg-background pt-1 pb-4 space-y-4">
          {/* 1. Search Icon */}
          <div>
            <SearchDrawer value={currentSearchValue} onChange={handleSearchChange} />
          </div>

          {/* 2. Filters Title + Reset button */}
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-foreground hover:text-primary transition-colors cursor-default">{t("title")}</h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="shrink-0 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400"
              >
                {t("resetFilters")}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1: Shop Types */}
          <div className="space-y-3">
            <div className="sticky top-[88px] z-20 bg-background py-3 -mt-2">
              <h4 className="text-lg font-medium text-foreground hover:text-primary transition-colors cursor-default">
                {t("shopTypes")}
              </h4>
            </div>
            {renderCategoryItemsOnly()}
          </div>

          {/* Section 2: Locations (Replaces Shop Types header at top-[88px] when scrolling) */}
          <div className="space-y-3">
            <div className="sticky top-[88px] z-20 bg-background py-3 -mt-2">
              <h4 className="text-lg font-medium text-foreground hover:text-primary transition-colors cursor-default">
                {t("locations")}
              </h4>
            </div>
            {renderLocationItemsOnly()}
          </div>
        </div>
      </div>
    </div>
  );
}
