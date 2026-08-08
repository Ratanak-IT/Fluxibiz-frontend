"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Loader2, Search, SlidersHorizontal } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetBusinessCategoryQuery } from "@/features/store-api/store-api";
import SearchDrawer from "./search";

export type StoreSortOption = "Default" | "Name: A to Z" | "Name: Z to A";
export type StorePriceRange =
  | "All Prices"
  | "Under $2"
  | "$2 - $5"
  | "$5 - $10"
  | "Over $10";

const SORT_OPTIONS: StoreSortOption[] = ["Default", "Name: A to Z", "Name: Z to A"];
const PRICE_OPTIONS: StorePriceRange[] = [
  "All Prices",
  "Under $2",
  "$2 - $5",
  "$5 - $10",
  "Over $10",
];

interface StoreFilterComponentProps {
  selected?: string[];
  onSelectedChange?: (selected: string[]) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  sortBy?: StoreSortOption;
  onSortByChange?: (sort: StoreSortOption) => void;
  priceRange?: StorePriceRange;
  onPriceRangeChange?: (price: StorePriceRange) => void;
}

const VISIBLE_COUNT = 10;

export default function StoreFilterComponent({
  selected = [],
  onSelectedChange,
  searchValue,
  onSearchChange,
  sortBy: controlledSortBy,
  onSortByChange,
  priceRange: controlledPriceRange,
  onPriceRangeChange,
}: StoreFilterComponentProps) {
  const t = useTranslations("Store.filters");
  const [showMore, setShowMore] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState("");
  const [localSortBy, setLocalSortBy] = useState<StoreSortOption>("Default");
  const [localPriceRange, setLocalPriceRange] = useState<StorePriceRange>("All Prices");

  const {
    data: category = [],
    isLoading,
    isError,
  } = useGetBusinessCategoryQuery();

  const currentSearchValue = searchValue ?? localSearchValue;
  const currentSortBy = controlledSortBy ?? localSortBy;
  const currentPriceRange = controlledPriceRange ?? localPriceRange;

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
      return;
    }
    setLocalSearchValue(value);
  };

  const handleSortChange = (sort: StoreSortOption) => {
    if (onSortByChange) {
      onSortByChange(sort);
      return;
    }
    setLocalSortBy(sort);
  };

  const handlePriceChange = (price: StorePriceRange) => {
    if (onPriceRangeChange) {
      onPriceRangeChange(price);
      return;
    }
    setLocalPriceRange(price);
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

  const toggle = (id: string) => {
    const nextSelected = selected.includes(id)
      ? selected.filter((selectedId) => selectedId !== id)
      : [...selected, id];
    onSelectedChange?.(nextSelected);
  };

  const hasActiveFilters =
    currentSearchValue.trim() !== "" ||
    selected.length > 0 ||
    currentSortBy !== "Default" ||
    currentPriceRange !== "All Prices";

  const handleResetFilters = () => {
    handleSearchChange("");
    onSelectedChange?.([]);
    handleSortChange("Default");
    handlePriceChange("All Prices");
  };

  const optionLabel = (option: string) =>
    ({
      Default: t("default"),
      "Name: A to Z": t("nameAZ"),
      "Name: Z to A": t("nameZA") ?? "Name: Z to A",
      "All Prices": t("allPrices"),
      "Under $2": t("underTwo"),
      "$2 - $5": t("twoToFive"),
      "$5 - $10": t("fiveToTen"),
      "Over $10": t("overTen"),
    } as Record<string, string>)[option] ?? option;

  const renderSortChecklist = () => (
    <div>
      <h4 className="mb-3 text-lg font-medium text-foreground">{t("sortBy")}</h4>
      <div className="space-y-2.5">
        {SORT_OPTIONS.map((option) => {
          const inputId = `store-sort-${option}`;
          return (
            <div key={option} className="flex items-center gap-2">
              <Checkbox
                id={inputId}
                checked={currentSortBy === option}
                onCheckedChange={(checked) => { if (checked) handleSortChange(option); }}
                className="rounded-[4px] border border-primary/10 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <Label htmlFor={inputId} className="cursor-pointer text-sm font-medium text-foreground">
                {optionLabel(option)}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPriceChecklist = () => (
    <div>
      <h4 className="mb-3 text-lg font-medium text-foreground">{t("priceRange")}</h4>
      <div className="space-y-2.5">
        {PRICE_OPTIONS.map((option) => {
          const inputId = `store-price-${option}`;
          return (
            <div key={option} className="flex items-center gap-2">
              <Checkbox
                id={inputId}
                checked={currentPriceRange === option}
                onCheckedChange={(checked) => { if (checked) handlePriceChange(option); }}
                className="rounded-[4px] border border-primary/10 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <Label htmlFor={inputId} className="cursor-pointer text-sm font-medium text-foreground">
                {optionLabel(option)}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCategoryFilters = () => (
    <div>
      <h4 className="mb-3 text-lg font-medium text-foreground">
        {t("shopTypes")}
      </h4>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span>{t("loading")}</span>
        </div>
      )}

      {isError && !isLoading && (
        <div className="text-sm text-destructive">{t("cannotLoadTypes")}</div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="space-y-2.5">
            {visibleTypes.map((categoryType) => {
              const checkboxId = `store-category-${categoryType.id}`;
              return (
                <div key={categoryType.id} className="flex items-center gap-2">
                  <Checkbox
                    id={checkboxId}
                    checked={selected.includes(categoryType.id)}
                    onCheckedChange={() => toggle(categoryType.id)}
                  />
                  <Label htmlFor={checkboxId} className="cursor-pointer text-sm font-medium text-foreground">
                    {categoryType.name}
                  </Label>
                </div>
              );
            })}
          </div>

          {extraTypes.length > 0 && (
            <Collapsible open={showMore} onOpenChange={setShowMore}>
              <CollapsibleContent className="space-y-2.5 pt-3">
                {extraTypes.map((categoryType) => {
                  const checkboxId = `store-extra-category-${categoryType.id}`;
                  return (
                    <div key={categoryType.id} className="flex items-center gap-2">
                      <Checkbox
                        id={checkboxId}
                        checked={selected.includes(categoryType.id)}
                        onCheckedChange={() => toggle(categoryType.id)}
                      />
                      <Label htmlFor={checkboxId} className="cursor-pointer text-sm font-medium text-foreground">
                        {categoryType.name}
                      </Label>
                    </div>
                  );
                })}
              </CollapsibleContent>

              <CollapsibleTrigger className="mt-3 flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                {showMore ? t("showLess") : t("showMore")}
                <ChevronDown
                  className={`size-4 transition-transform duration-200 ${showMore ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
            </Collapsible>
          )}
        </>
      )}
    </div>
  );

  const renderAllFilters = () => (
    <div className="space-y-6">
      {renderSortChecklist()}
      {renderPriceChecklist()}
      {renderCategoryFilters()}
    </div>
  );

  return (
    <div className="w-full max-w-full">
      {/* Desktop: unchanged icon-only trigger, exactly as it was */}
      <div className="hidden xl:block">
        <SearchDrawer value={currentSearchValue} onChange={handleSearchChange} />
      </div>

      {/* Mobile/tablet: same SearchDrawer, no own trigger button — opened by tapping the bar below */}
      <SearchDrawer
        value={currentSearchValue}
        onChange={handleSearchChange}
        open={mobileSearchOpen}
        onOpenChange={setMobileSearchOpen}
        hideTrigger
      />

      <div className="xl:hidden">
        <Collapsible open={mobileFilterOpen} onOpenChange={setMobileFilterOpen} className="w-full">
          <div className="flex w-full min-w-0 items-center gap-2.5">
            <div className="group relative min-w-0 flex-1">
              <Search
                aria-hidden="true"
                strokeWidth={1.8}
                className="pointer-events-none absolute left-4 top-1/2 z-10 size-[18px] -translate-y-1/2 text-neutral-400 transition-colors duration-200 group-hover:text-primary group-focus-within:text-primary"
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
                  border-neutral-200/70
                  bg-neutral-100/60
                  pl-11
                  pr-4
                  text-sm
                  shadow-none
                  outline-none
                  cursor-pointer
                  placeholder:truncate
                  placeholder:text-neutral-400
                  hover:bg-neutral-100
                  focus-visible:border-primary/30
                  focus-visible:ring-1
                  focus-visible:ring-primary/20
                  dark:border-neutral-800
                  dark:bg-neutral-900
                "
              />
            </div>

            <CollapsibleTrigger
              type="button"
              aria-label={mobileFilterOpen ? t("closeFilters") : t("openFilters")}
              className={`flex size-12 shrink-0 items-center justify-center rounded-full border border-neutral-200/70 bg-white shadow-none outline-none transition-all duration-200 hover:bg-neutral-50 hover:text-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-900 ${mobileFilterOpen ? "text-primary" : "text-neutral-500"}`}
            >
              <SlidersHorizontal strokeWidth={1.9} className="size-[18px]" />
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="mt-3 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-none">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground">{t("title")}</h2>
                <p className="text-sm text-muted-foreground">{t("browseByCategory")}</p>
              </div>
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

            {renderAllFilters()}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="hidden w-full max-w-[420px] space-y-3 xl:block xl:min-w-[340px]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-0.5">
            <h2 className="text-xl font-bold text-foreground">{t("title")}</h2>
            <p className="whitespace-nowrap text-sm text-muted-foreground">{t("browseByCategory")}</p>
          </div>
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

        {renderAllFilters()}
      </div>
    </div>
  );
}