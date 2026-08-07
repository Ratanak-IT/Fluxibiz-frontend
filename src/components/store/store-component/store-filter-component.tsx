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
import SearchFilterBar from "../detailstore/button";
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
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");
  const [sortBy, setSortBy] = useState("Default");

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
  const categoryOptions = ["All", ...allTypes.map((categoryType) => categoryType.name)];
  const selectedCategoryName =
    allTypes.find((categoryType) => categoryType.id === selected[0])?.name ?? "All";

  const toggle = (id: string) => {
    const nextSelected = selected.includes(id)
      ? selected.filter((selectedId) => selectedId !== id)
      : [...selected, id];

    onSelectedChange?.(nextSelected);
  };

  const handleCategoryChange = (categoryName: string) => {
    if (categoryName === "All") {
      onSelectedChange?.([]);
      return;
    }

    onSelectedChange?.(
      allTypes
        .filter((categoryType) => categoryType.name === categoryName)
        .map((categoryType) => categoryType.id),
    );
  };

  const handleResetFilters = () => {
    handleSearchChange("");
    onSelectedChange?.([]);
    setSelectedPriceRange("All Prices");
    setSortBy("Default");
  };

  const renderCategoryFilters = () => (
    <div>
      <h4 className="mb-3 text-lg font-medium text-foreground">
        {t("shopTypes")}
      </h4>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span>{t("loading")}</span>
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="text-sm text-destructive">{t("cannotLoadTypes")}</div>
      )}

      {/* Category list */}
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

                  <Label
                    htmlFor={checkboxId}
                    className="
                      cursor-pointer
                      text-sm
                      font-medium
                      text-foreground
                    "
                  >
                    {categoryType.name}
                  </Label>
                </div>
              );
            })}
          </div>

          {/* Extra categories */}
          {extraTypes.length > 0 && (
            <Collapsible open={showMore} onOpenChange={setShowMore}>
              <CollapsibleContent className="space-y-2.5 pt-3">
                {extraTypes.map((categoryType) => {
                  const checkboxId = `store-extra-category-${categoryType.id}`;

                  return (
                    <div
                      key={categoryType.id}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={checkboxId}
                        checked={selected.includes(categoryType.id)}
                        onCheckedChange={() => toggle(categoryType.id)}
                      />

                      <Label
                        htmlFor={checkboxId}
                        className="
                          cursor-pointer
                          text-sm
                          font-medium
                          text-foreground
                        "
                      >
                        {categoryType.name}
                      </Label>
                    </div>
                  );
                })}
              </CollapsibleContent>

              <CollapsibleTrigger
                className="
                  mt-3
                  flex
                  items-center
                  gap-1
                  text-sm
                  font-medium
                  text-primary
                  hover:underline "
              >
                {showMore ? t("showLess") : t("showMore")}

                <ChevronDown
                  className={`
                    size-4
                    transition-transform
                    duration-200
                    ${showMore ? "rotate-180" : ""}
                  `}
                />
              </CollapsibleTrigger>
            </Collapsible>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="w-full">

      <SearchDrawer/>
 
      <div className="xl:hidden">
        <Collapsible
          open={mobileFilterOpen}
          onOpenChange={setMobileFilterOpen}
          className="w-full"
        >
          <div className="flex w-full min-w-0 items-center gap-2">
            {/* Search input */}
            <div className="group relative min-w-0 flex-1">
              <Search
                aria-hidden="true"
                strokeWidth={1.8}
                className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                z-10
                size-[18px]
                -translate-y-1/2
                text-neutral-400
                transition-colors
                duration-200
                group-hover:text-primary
                group-focus-within:text-primary
              "
              />

              <Input
                type="text"
                value={currentSearchValue}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder={t("searchPlaceholder")}
                className="
                      h-11
                      min-w-0
                      w-full
                      rounded-full
                      border-0
                      bg-white
                      pl-11
                      pr-4
                      text-sm
                      shadow-sm
                      outline-none
                      placeholder:truncate
                      placeholder:text-neutral-400
                      hover:shadow-md
                      focus-visible:border-0
                      focus-visible:ring-1
                      focus-visible:ring-primary/20
                      dark:bg-neutral-900
                    "
              />
            </div>

            {/* Filter button */}
            <CollapsibleTrigger
              type="button"
              aria-label={
                mobileFilterOpen ? t("closeFilters") : t("openFilters")
              }
              className={`
              flex
              size-11
              shrink-0
              items-center
              justify-center
              rounded-full
              border-0
              bg-white
              shadow-sm
              outline-none
              transition-all
              duration-200
              hover:bg-white
              hover:text-primary
              hover:shadow-md
              focus-visible:ring-1
              focus-visible:ring-primary/20
              dark:bg-neutral-900
              dark:hover:bg-neutral-900
              ${mobileFilterOpen ? "text-primary" : "text-neutral-500"}
            `}
            >
              <SlidersHorizontal strokeWidth={1.9} className="size-[18px]" />
            </CollapsibleTrigger>
          </div>

          {/* Mobile/tablet filter dropdown */}
          <CollapsibleContent
            className="
              mt-3
              overflow-hidden
              rounded-2xl
              border
              border-border
              bg-card
              p-4
              shadow-none
            "
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold text-foreground">
                {t("title")}
              </h2>

              <p className="text-sm text-muted-foreground">
                {t("browseByCategory")}
              </p>
            </div>

            {renderCategoryFilters()}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="hidden w-full space-y-3 xl:block">
     

        <div className="space-y-0.5">
          <h2 className="text-xl font-bold text-foreground">{t("title")}</h2>

          <p className="text-sm text-muted-foreground">
            {t("browseByCategory")}
          </p>
        </div>

        {renderCategoryFilters()}
      </div>
    </div>
  );
}
