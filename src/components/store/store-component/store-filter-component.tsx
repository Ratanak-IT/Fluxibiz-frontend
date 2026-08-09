"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Loader2, Search } from "lucide-react";

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

interface StoreFilterComponentProps {
  selected?: string[];
  onSelectedChange?: (selected: string[]) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const VISIBLE_COUNT = 10;

export default function StoreFilterComponent({
  selected = [],
  onSelectedChange,
  searchValue,
  onSearchChange,
}: StoreFilterComponentProps) {
  const t = useTranslations("Store.filters");
  const [showMore, setShowMore] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState("");

  const {
    data: category = [],
    isLoading,
    isError,
  } = useGetBusinessCategoryQuery();

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

  const toggle = (id: string) => {
    const nextSelected = selected.includes(id)
      ? selected.filter((selectedId) => selectedId !== id)
      : [...selected, id];
    onSelectedChange?.(nextSelected);
  };

  const hasActiveFilters =
    currentSearchValue.trim() !== "" || selected.length > 0;

  const handleResetFilters = () => {
    handleSearchChange("");
    onSelectedChange?.([]);
  };

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
        <div className="group relative w-full min-w-0">
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

        {renderCategoryFilters()}
      </div>
    </div>
  );
}
