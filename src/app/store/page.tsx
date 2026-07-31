"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Store as StoreIcon } from "lucide-react";
import BannerCarousel from "@/components/store/store-component/banner-carousel";
import StoreCardHorizontal from "@/components/store/store-component/store-card-horizontal";
import StoreFilterComponent from "@/components/store/store-component/store-filter-component";
import {
  Store,
  StoreCardComponent,
} from "@/components/store/store-component/store-cart-component";
import Link from "next/link";
import {
  useGetPublicStoresQuery,
  useGetRecommendedStoresQuery,
} from "@/features/store-api/store-api";
import { PublicStore, toStoreCard } from "@/lib/type/storeType";

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}

function ScrollRow({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="group/row relative">
      <div
        ref={scrollRef}
        className="
          flex gap-4 overflow-x-auto pb-2
          snap-x snap-mandatory scroll-smooth
          [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
        "
      >
        {children}
      </div>

      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="
            absolute left-1 top-1/2 z-20 -translate-y-1/2
            flex h-10 w-10 items-center justify-center
            rounded-full bg-white shadow-lg
            opacity-0 transition-opacity duration-200
            group-hover/row:opacity-100
            hover:bg-accent
          "
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="
            absolute right-1 top-1/2 z-20 -translate-y-1/2
            flex h-10 w-10 items-center justify-center
            rounded-full bg-white shadow-lg
            opacity-0 transition-opacity duration-200
            group-hover/row:opacity-100
            hover:bg-accent
          "
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      )}
    </div>
  );
}

// Horizontal scroll row of vertical store cards
function StoreRow({ items }: { items: Store[] }) {
  return (
    <ScrollRow>
      {items.map((store) => (
        <Link
          key={store.id}
          href={`/store/${store.slug || store.id}`}
          className="shrink-0 snap-start"
        >
          <StoreCardComponent store={store} />
        </Link>
      ))}
    </ScrollRow>
  );
}

function RecommendedSection() {
  const { data: recData, isLoading: isLoadingRec } = useGetRecommendedStoresQuery({ size: 10 });
  const { data: publicData, isLoading: isLoadingPublic } = useGetPublicStoresQuery({ size: 10 });

  const recStores = recData?.content.map(toStoreCard) ?? [];
  const publicStores = publicData?.content.map(toStoreCard) ?? [];

  const storesToDisplay = recStores.length > 0 ? recStores : publicStores;
  const isLoading = isLoadingRec && isLoadingPublic;

  if (isLoading && storesToDisplay.length === 0) {
    return (
      <section className="space-y-3">
        <SectionHeader title="Recommend" />
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          Loading recommended stores...
        </div>
      </section>
    );
  }

  if (storesToDisplay.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <SectionHeader title="Recommend" />
      <ScrollRow>
        {storesToDisplay.map((store) => (
          <Link
            key={store.id}
            href={`/store/${store.slug || store.id}`}
            className="shrink-0 snap-start basis-[calc((100%-3*(--spacing(4)))/4)]"
          >
            <StoreCardHorizontal store={store} />
          </Link>
        ))}
      </ScrollRow>
    </section>
  );
}

function StoresByCategorySection({ selectedCategoryIds }: { selectedCategoryIds?: string[] }) {
  const { data, isLoading } = useGetPublicStoresQuery({
    size: 100,
    categoryIds: selectedCategoryIds && selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
  });
  const publicStores = data?.content ?? [];

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        Loading stores...
      </div>
    );
  }

  if (publicStores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <StoreIcon className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-base font-semibold text-foreground">No stores found</p>
        <p className="text-sm text-muted-foreground">
          No stores match your selected filter. Try selecting different categories.
        </p>
      </div>
    );
  }

  // Group public stores by their category name
  const grouped = publicStores.reduce<Record<string, PublicStore[]>>((acc, store) => {
    const categoryName = store.category?.name?.trim() || "Stores";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(store);
    return acc;
  }, {});

  const categoriesList = Object.entries(grouped);

  return (
    <div className="space-y-10">
      {categoriesList.map(([catName, catStores]) => (
        <section key={catName} className="space-y-3">
          <SectionHeader title={catName} />
          <StoreRow items={catStores.map(toStoreCard)} />
        </section>
      ))}
    </div>
  );
}

function PromotionsSection() {
  const { data, isLoading } = useGetPublicStoresQuery({ size: 50 });
  const promoStores = (data?.content ?? [])
    .map(toStoreCard)
    .filter((store) => Boolean(store.discountLabel));

  if (isLoading || promoStores.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <SectionHeader title="Promotions" />
      <StoreRow items={promoStores} />
    </section>
  );
}

export default function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <div className="mx-auto max-w-362.5 space-y-10 px-4 py-6">
      <BannerCarousel />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-55 lg:self-start">
          <div className="flex max-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-lg p-4">
            <div className="flex-1 overflow-y-auto pr-1">
              <StoreFilterComponent
                selected={selectedCategories}
                onSelectedChange={setSelectedCategories}
              />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-10">
          <RecommendedSection />

          <PromotionsSection />

          <StoresByCategorySection selectedCategoryIds={selectedCategories} />
        </div>
      </div>
    </div>
  );
}