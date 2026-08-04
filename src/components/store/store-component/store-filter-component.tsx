"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { useGetBusinessCategoryQuery } from "@/features/store-api/store-api";
// import { ChevronDown, Loader2, Search } from "lucide-react";
import { useState } from "react";

import { Search, Loader2, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface StoreFilterComponentProps {
  selected?: string[];
  onSelectedChange?: (selected: string[]) => void;
}

const VisitCount = 10;

export default function StoreFilterComponent({
  selected = [],
  onSelectedChange,
}: StoreFilterComponentProps) {
  const [showMore, setShowMore] = useState(false);

  const {
    data: category = [],
    isLoading,
    isError,
  } = useGetBusinessCategoryQuery();

  // The API returns parent categories with nested subCategories.
  // We map top-level categories and sub-categories into a flat list of shop types.
  const allTypes = category.flatMap((cat) =>
    cat.subCategories && cat.subCategories.length > 0
      ? cat.subCategories
      : [{ id: cat.id, name: cat.name, slug: cat.slug }],
  );

  const visitTypes = allTypes.slice(0, VisitCount);
  const extraTypes = allTypes.slice(VisitCount);

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    onSelectedChange?.(next);
  };

  const [filterOpen, setFilterOpen] = useState(false);

  return (
  <div
  className="
    w-full space-y-4
    sm:space-y-5
    lg:sticky lg:top-4 lg:max-w-xs lg:space-y-6 lg:self-start
  ">
  
  <div className="flex items-center gap-2 lg:hidden">
    <button
      type="button"
      className="
        flex h-10 flex-1 min-w-0 items-center gap-3
        rounded-full bg-card px-4 shadow-sm
        transition-colors hover:bg-primary/10
      "
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="truncate text-sm">Search...</span>
    </button>

    <Popover open={filterOpen} onOpenChange={setFilterOpen}>
      <PopoverTrigger >
        <button
          type="button"
          className="
            flex h-10 shrink-0 items-center gap-2
            rounded-full border border-border bg-card px-4
            shadow-sm transition-colors hover:bg-primary/10
            data-[state=open]:border-primary data-[state=open]:bg-primary/10
          "
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm font-medium">
            Filters{selected.length > 0 ? ` (${selected.length})` : ""}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${filterOpen ? "rotate-180" : ""}`}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72 p-4">
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          Shop types
        </p>

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        )}

        {isError && !isLoading && (
          <div className="text-sm text-destructive">
            Can not load store type
          </div>
        )}

        {!isLoading && !isError && (
          <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
            {visitTypes.map((cateType) => (
              <div
                key={cateType.id}
                className="
                  flex items-center gap-2 rounded-xl border border-border
                  bg-background px-3 py-1.5 transition-colors
                  has-[button[data-state=checked]]:border-primary
                  has-[button[data-state=checked]]:bg-primary/10
                "
              >
                <Checkbox
                  id={`m-${cateType.id}`}
                  checked={selected.includes(cateType.id)}
                  onCheckedChange={() => toggle(cateType.id)}
                />
                <Label
                  htmlFor={`m-${cateType.id}`}
                  className="cursor-pointer text-sm font-medium text-foreground"
                >
                  {cateType.name}
                </Label>
              </div>
            ))}

            {extraTypes.map((cateType) => (
              <div
                key={cateType.id}
                className="
                  flex items-center gap-2 rounded-xl border border-border
                  bg-background px-3 py-1.5 transition-colors
                  has-[button[data-state=checked]]:border-primary
                  has-[button[data-state=checked]]:bg-primary/10
                "
              >
                <Checkbox
                  id={`m-${cateType.id}`}
                  checked={selected.includes(cateType.id)}
                  onCheckedChange={() => toggle(cateType.id)}
                />
                <Label
                  htmlFor={`m-${cateType.id}`}
                  className="cursor-pointer text-sm font-medium text-foreground"
                >
                  {cateType.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  </div>

  {/* ---------- DESKTOP: original sidebar layout, unchanged ---------- */}
  <div className="hidden lg:block lg:space-y-6">
    <button
      type="button"
      className="
        flex h-9 w-9 items-center justify-center
        rounded-full bg-card shadow-sm
        transition-colors hover:bg-primary/10
      "
    >
      <Search className="h-4 w-4" />
    </button>

    <div className="space-y-0.5">
      <h2 className="text-2xl font-bold text-foreground">Filters</h2>
      <p className="text-sm text-muted-foreground">Browse by Category</p>
    </div>

    <div className="p-5 shadow-sm">
      <h4 className="mb-3 text-lg font-medium text-foreground">
        Shop types
      </h4>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </div>
      )}

      {isError && !isLoading && (
        <div className="text-sm text-destructive">
          Can not load store type
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="flex flex-col gap-y-2.5">
            {visitTypes.map((cateType) => (
              <div
                key={cateType.id}
                className="
                  flex w-full items-center gap-2
                  rounded-xl border border-border bg-background
                  px-3 py-1.5 transition-colors
                  has-[button[data-state=checked]]:border-primary
                  has-[button[data-state=checked]]:bg-primary/10
                "
              >
                <Checkbox
                  id={String(cateType.id)}
                  checked={selected.includes(cateType.id)}
                  onCheckedChange={() => toggle(cateType.id)}
                />
                <Label
                  htmlFor={String(cateType.id)}
                  className="cursor-pointer whitespace-normal text-sm font-medium text-foreground"
                >
                  {cateType.name}
                </Label>
              </div>
            ))}
          </div>

          {extraTypes.length > 0 && (
            <Collapsible open={showMore} onOpenChange={setShowMore}>
              <CollapsibleContent className="mt-3 flex flex-col gap-y-2.5">
                {extraTypes.map((cateType) => (
                  <div
                    key={cateType.id}
                    className="
                      flex w-full items-center gap-2
                      rounded-xl border border-border bg-background
                      px-3 py-1.5 transition-colors
                      has-[button[data-state=checked]]:border-primary
                      has-[button[data-state=checked]]:bg-primary/10
                    "
                  >
                    <Checkbox
                      id={String(cateType.id)}
                      checked={selected.includes(cateType.id)}
                      onCheckedChange={() => toggle(cateType.id)}
                    />
                    <Label
                      htmlFor={String(cateType.id)}
                      className="cursor-pointer whitespace-normal text-sm font-medium text-foreground"
                    >
                      {cateType.name}
                    </Label>
                  </div>
                ))}
              </CollapsibleContent>

              <CollapsibleTrigger className="mt-3 flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                {showMore ? "Show less" : "Show more"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showMore ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
            </Collapsible>
          )}
        </>
      )}
    </div>
  </div>
</div>
  );
}
