"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { useGetBusinessCategoryQuery } from "@/features/store-api/store-api";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { useState } from "react";

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

  return (
    <div
      className="
                w-full space-y-4
                sm:space-y-5
                lg:sticky lg:top-4 lg:max-w-xs lg:space-y-6 lg:self-start\ "
    >
      <button
        type="button"
        className="
    flex h-10 w-full
    items-center justify-start
    gap-3
    rounded-full
    bg-card
    px-4
    shadow-sm
    transition-colors
    hover:bg-accent

    sm:h-9 sm:w-9 sm:justify-center sm:px-0 "
      >
        <Search className="h-4 w-4" />

        <span className="text-sm sm:hidden">Search...</span>
      </button>

    <div className="space-y-0.5">
  <h2 className="text-xl font-bold text-foreground sm:text-2xl">
    Filters
  </h2>
  <p className="text-sm text-muted-foreground">Browse by Category</p>
</div>

<div
  className="
    p-3 shadow-sm
    sm:p-4
    lg:p-5
  ">
  <h4 className="mb-2 text-lg font-medium text-foreground sm:mb-3">
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
     
      <div
        className="
          flex gap-2 overflow-x-auto pb-1
          [-ms-overflow-style:none] [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden

          sm:grid sm:grid-cols-2 sm:gap-x-3 sm:gap-y-2.5
          sm:overflow-visible sm:pb-0

          lg:flex lg:flex-col lg:gap-y-2.5
        "
      >
        {visitTypes.map((cateType) => (
          <div
            key={cateType.id}
            className="
              flex shrink-0 items-center gap-2
              rounded-full border border-border bg-background
              px-3 py-1.5 transition-colors
              has-[button[data-state=checked]]:border-primary
              has-[button[data-state=checked]]:bg-primary/10

              sm:shrink

              lg:w-full lg:rounded-xl
            "
          >
            <Checkbox
              id={String(cateType.id)}
              checked={selected.includes(cateType.id)}
              onCheckedChange={() => toggle(cateType.id)}
            />
            <Label
              htmlFor={String(cateType.id)}
              className="cursor-pointer whitespace-nowrap text-sm font-medium text-foreground sm:whitespace-normal"
            >
              {cateType.name}
            </Label>
          </div>
        ))}
      </div>

      {extraTypes.length > 0 && (
        <Collapsible open={showMore} onOpenChange={setShowMore}>
          <CollapsibleContent
            className="
              mt-3 flex gap-2 overflow-x-auto pb-1
              [-ms-overflow-style:none] [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden

              sm:grid sm:grid-cols-2 sm:gap-x-3 sm:gap-y-2.5
              sm:overflow-visible sm:pb-0

              lg:flex lg:flex-col lg:gap-y-2.5
            "
          >
            {extraTypes.map((cateType) => (
              <div
                key={cateType.id}
                className="
                  flex shrink-0 items-center gap-2
                  rounded-full border border-border bg-background
                  px-3 py-1.5 transition-colors
                  has-[button[data-state=checked]]:border-primary
                  has-[button[data-state=checked]]:bg-primary/10

                  sm:shrink

                  lg:w-full lg:rounded-xl
                "
              >
                <Checkbox
                  id={String(cateType.id)}
                  checked={selected.includes(cateType.id)}
                  onCheckedChange={() => toggle(cateType.id)}
                />
                <Label
                  htmlFor={String(cateType.id)}
                  className="cursor-pointer whitespace-nowrap text-sm font-medium text-foreground sm:whitespace-normal"
                >
                  {cateType.name}
                </Label>
              </div>
            ))}
          </CollapsibleContent>

          <CollapsibleTrigger
            className="mt-3 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
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
  );
}
