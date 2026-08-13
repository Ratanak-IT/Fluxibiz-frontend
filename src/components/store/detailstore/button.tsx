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
        className={`inline-flex h-11 shrink-0 items-center justify-center rounded-full px-4 text-xs font-medium transition-colors outline-none focus:outline-none focus-visible:ring-0 sm:px-5 sm:text-sm ${
          isSelected
            ? "border border-primary bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
            : "border border-primary/40 bg-white text-neutral-800 hover:border-primary hover:bg-neutral-50 dark:border-primary/50 dark:bg-card dark:text-neutral-200 dark:hover:bg-muted"
        }`}
      >
        <span>{displayLabel}</span>
        <ChevronDown className="ml-1.5 h-3.5 w-3.5 opacity-60 sm:h-4 sm:w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-auto min-w-[180px] whitespace-nowrap rounded-2xl border border-neutral-100/80 bg-white p-1.5 shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
      >
        {options.map((option) => {
          const active = option === value;
          return (
            <DropdownMenuItem
              key={optionLabel(option)}
              onClick={() => onSelect(option)}
              className={`cursor-pointer rounded-xl px-3.5 py-2.5 text-xs font-medium whitespace-nowrap transition-colors sm:text-sm ${
                active
                  ? "bg-primary/10 font-bold text-primary focus:bg-primary/15 focus:text-primary dark:bg-primary/20 dark:text-primary dark:focus:bg-primary/25"
                  : "text-neutral-700 hover:bg-neutral-100 focus:bg-neutral-100 focus:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 dark:focus:text-neutral-100"
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
    <div className="flex w-full flex-wrap lg:flex-nowrap items-center gap-2.5 lg:gap-3 px-4 sm:px-6 md:px-12 lg:px-20">
      {/* Search input */}
      <div className="relative w-full sm:flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-11 w-full rounded-full border border-primary/40 bg-white pl-11 pr-8 text-sm shadow-sm placeholder:text-neutral-400 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:border-primary/50 dark:bg-card dark:text-foreground"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label={t("clearSearch")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-card"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Group Container */}
      <div className="flex w-full lg:w-auto items-center gap-2 lg:gap-3 overflow-x-auto lg:overflow-visible py-2 -my-2 px-1 -mx-1 scrollbar-none">
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
            className="h-11 shrink-0 rounded-full border-0 bg-red-50 px-4 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-100 sm:px-5 sm:text-sm dark:bg-card dark:text-red-400"
          >
            {t("resetFilters")}
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            className="h-11 shrink-0 rounded-full border border-primary/40 bg-white px-4 text-xs font-medium text-neutral-800 hover:border-primary hover:bg-neutral-50 sm:px-5 sm:text-sm dark:border-primary/50 dark:bg-card dark:text-neutral-200 dark:hover:bg-muted"
          >
            <ListFilter className="mr-1.5 h-4 w-4 text-primary" />
            {t("filter")}
          </Button>
        )}
      </div>
    </div>
  );
}
