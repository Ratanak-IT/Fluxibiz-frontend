"use client";

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
  options: string[];
}

function FilterDropdown({ label, options }: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-11 shrink-0 items-center rounded-full bg-white px-5 font-medium text-neutral-800 shadow-sm hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200"
      >
        {label}
        <ChevronDown className="ml-1.5 h-4 w-4 text-neutral-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((option) => (
          <DropdownMenuItem key={option}>{option}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function SearchFilterBar() {
  return (
    <div className="flex w-full items-center gap-3  px-25 dark:bg-neutral-950">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          type="text"
          placeholder="Search drinks, food, or category..."
          className="h-11 rounded-full border-0 bg-white pl-11 text-sm shadow-sm placeholder:text-neutral-400 dark:bg-neutral-900"
        />
      </div>

      {/* Category */}
      <FilterDropdown
        label="Category"
        options={["All", "Juice", "Food", "Dessert"]}
      />

      {/* Price Range */}
      <FilterDropdown
        label="Price Range"
        options={["Under $2", "$2 - $5", "$5 - $10", "Over $10"]}
      />

      {/* Short By (Sort By) */}
      <FilterDropdown
        label="Short By"
        options={[
          "Newest",
          "Price: Low to High",
          "Price: High to Low",
          "Popularity",
        ]}
      />

      {/* Filter button */}
      <Button
        variant="ghost"
        className="h-11 shrink-0 rounded-full bg-white px-5 font-medium text-neutral-800 shadow-sm hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200"
      >
        <ListFilter className="mr-1.5 h-4 w-4" />
        Filter
      </Button>
    </div>
  );
}