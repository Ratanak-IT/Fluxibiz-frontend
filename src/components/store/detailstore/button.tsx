"use client";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, ListFilter } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (option: string) => void;
}

function FilterDropdown({ label, value, options, onSelect }: FilterDropdownProps) {
  const t = useTranslations("Store.filters");
  const isSelected = value && value !== "All" && value !== "All Prices" && value !== "Default";
  const optionLabel = (option: string) => ({
    "All": t("all"), "All Prices": t("allPrices"), "Default": t("default"),
    "Under $2": t("underTwo"), "$2 - $5": t("twoToFive"), "$5 - $10": t("fiveToTen"),
    "Over $10": t("overTen"), "Price: Low to High": t("priceLowHigh"),
    "Price: High to Low": t("priceHighLow"), "Name: A to Z": t("nameAZ")
  } as Record<string, string>)[option] ?? option;
  const displayLabel = isSelected ? optionLabel(value) : label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`inline-flex h-11 shrink-0 items-center rounded-xl px-4 text-xs font-medium shadow-sm transition-colors sm:px-5 sm:text-sm ${
          isSelected
            ? "bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary"
            : "bg-white text-neutral-800 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200"
        }`}
      >
        <span>{displayLabel}</span>
        <ChevronDown className="ml-1.5 h-3.5 w-3.5 opacity-60 sm:h-4 sm:w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((option) => {
          const active = option === value;
          return (
            <DropdownMenuItem
              key={optionLabel(option)}
              onClick={() => onSelect(option)}
              className={`cursor-pointer text-xs sm:text-sm ${
                active
                  ? "bg-primary/10 font-bold text-primary dark:bg-primary/20 dark:text-primary"
                  : "focus:bg-neutral-100 focus:text-neutral-900 dark:focus:bg-neutral-800 dark:focus:text-neutral-100"
              }`}
            >
              {optionLabel(option)}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedPriceRange: string;
  onPriceRangeChange: (price: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  onReset: () => void;
}

export default function SearchFilterBar({
  searchQuery,
  onSearchChange,
  categories = ["All"],
  selectedCategory = "All",
  onCategoryChange,
  selectedPriceRange = "All Prices",
  onPriceRangeChange,
  sortBy = "Default",
  onSortByChange,
  onReset,
}: SearchFilterBarProps) {
  const t = useTranslations("Store.filters");
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedPriceRange !== "All Prices" ||
    sortBy !== "Default";

  return (
    <div className="flex w-full flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 px-4 sm:px-8 md:px-16 lg:px-24">
      {/* Search input */}
      <div className="relative w-full sm:flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-11 w-full rounded-full border-0 bg-white pl-11 pr-8 text-sm shadow-sm placeholder:text-neutral-400 dark:bg-neutral-900"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label={t("clearSearch")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Group Container */}
      <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {/* Category */}
        <FilterDropdown
          label={t("category")}
          value={selectedCategory}
          options={categories}
          onSelect={onCategoryChange}
        />

        {/* Price Range */}
        <FilterDropdown
          label={t("priceRange")}
          value={selectedPriceRange}
          options={["All Prices", "Under $2", "$2 - $5", "$5 - $10", "Over $10"]}
          onSelect={onPriceRangeChange}
        />

        {/* Sort By */}
        <FilterDropdown
          label={t("sortBy")}
          value={sortBy}
          options={[
            "Default",
            "Price: Low to High",
            "Price: High to Low",
            "Name: A to Z",
          ]}
          onSelect={onSortByChange}
        />

        {/* Reset / Filter button */}
        {hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className="h-11 shrink-0 rounded-full bg-red-50 px-4 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-100 sm:px-5 sm:text-sm dark:bg-red-950/40 dark:text-red-400"
          >
            {t("resetFilters")}
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            className="h-11 shrink-0 rounded-full bg-white px-4 sm:px-5 font-medium text-neutral-800 shadow-sm hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200"
          >
            <ListFilter className="mr-1.5 h-4 w-4" />
            {t("filter")}
          </Button>
        )}
      </div>
    </div>
  );
}
