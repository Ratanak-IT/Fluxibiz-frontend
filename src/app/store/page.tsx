"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Store as StoreIcon } from "lucide-react";
import BannerCarousel from "@/components/store/store-component/banner-carousel";
import StoreCardHorizontal from "@/components/store/store-component/store-card-horizontal";

import { StoreCardComponent } from "@/components/store/store-component/store-cart-component";
import Link from "next/link";
import {
  useGetPublicStoresQuery,
  useGetRecommendedStoresQuery,
} from "@/features/store-api/store-api";
import { PublicStore, toStoreCard, type Store } from "@/lib/type/storeType";
import {
  RecommendedRowSkeleton,
  StoreRowSkeleton,
} from "@/components/common/Skeletons";
import StoreFilterComponent from "@/components/store/store-component/store-filter-component";

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-0">
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}

function ScrollRow({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Store.listing");
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
          aria-label={t("scrollLeft")}
          className="
            absolute left-1 top-1/2 z-20 -translate-y-1/2
            flex h-10 w-10 items-center justify-center
            rounded-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-md border border-neutral-200/60 dark:border-neutral-800
            opacity-0 transition-colors duration-200
            group-hover/row:opacity-100
            hover:bg-neutral-200/80 dark:hover:bg-neutral-800
          "
        >
          <ChevronLeft className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label={t("scrollRight")}
          className="
            absolute right-1 top-1/2 z-20 -translate-y-1/2
            flex h-10 w-10 items-center justify-center
            rounded-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-md border border-neutral-200/60 dark:border-neutral-800
            opacity-0 transition-colors duration-200
            group-hover/row:opacity-100
            hover:bg-neutral-200/80 dark:hover:bg-neutral-800
          "
        >
          <ChevronRight className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />
        </button>
      )}
    </div>
  );
}

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

function RecommendedSection({
  selectedLocations = [],
  searchValue = "",
}: {
  selectedLocations?: string[];
  searchValue?: string;
}) {
  const t = useTranslations("Store.common");
  const { data: recData, isLoading: isLoadingRec } =
    useGetRecommendedStoresQuery({ size: 10 });
  const { data: publicData, isLoading: isLoadingPublic } =
    useGetPublicStoresQuery({ size: 10 });

  const rawRecStores = recData?.content ?? [];
  const rawPublicStores = publicData?.content ?? [];
  const rawStores = rawRecStores.length > 0 ? rawRecStores : rawPublicStores;
  const isLoading = isLoadingRec && isLoadingPublic;

  const storesToDisplay = useMemo(() => {
    return rawStores
      .filter((store) => {
        if (selectedLocations.length > 0) {
          const storeText = `${store.cityOrProvince ?? ""} ${store.address ?? ""} ${store.name ?? ""} ${store.about ?? ""}`.toLowerCase();
          const matchesLoc = selectedLocations.some((loc) =>
            storeText.includes(loc.toLowerCase()),
          );
          if (!matchesLoc) return false;
        }

        if (searchValue.trim()) {
          const term = searchValue.trim().toLowerCase();
          const storeText = `${store.name ?? ""} ${store.category?.name ?? ""} ${store.cityOrProvince ?? ""} ${store.address ?? ""} ${store.about ?? ""}`.toLowerCase();
          if (!storeText.includes(term)) return false;
        }

        return true;
      })
      .map(toStoreCard);
  }, [rawStores, selectedLocations, searchValue]);

  if (isLoading && storesToDisplay.length === 0) {
    return (
      <section className="space-y-0">
        <SectionHeader title={t("recommend")} />
        <RecommendedRowSkeleton count={4} />
      </section>
    );
  }

  if (storesToDisplay.length === 0) {
    return null;
  }

  return (
    <section className="space-y-0">
      <SectionHeader title={t("recommend")} />
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

function StoresByCategorySection({
  stores = [],
  isLoading = false,
}: {
  stores: PublicStore[];
  isLoading?: boolean;
}) {
  const t = useTranslations("Store");

  if (isLoading) {
    return (
      <section className="space-y-0">
        <SectionHeader title={t("common.stores")} />
        <StoreRowSkeleton count={4} />
      </section>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <StoreIcon className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-base font-semibold text-foreground">
          {t("listing.noStoresFound")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("listing.noStoresDescription")}
        </p>
      </div>
    );
  }

  // Group public stores by their category name
  const grouped = stores.reduce<Record<string, PublicStore[]>>(
    (acc, store) => {
      const categoryName = store.category?.name?.trim() || t("common.stores");
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(store);
      return acc;
    },
    {},
  );

  const categoriesList = Object.entries(grouped);

  return (
    <div className="space-y-10">
      {categoriesList.map(([catName, catStores]) => (
        <section key={catName} className="space-y-0">
          <SectionHeader title={catName} />
          <StoreRow items={catStores.map(toStoreCard)} />
        </section>
      ))}
    </div>
  );
}

function PromotionsSection({
  selectedLocations = [],
  searchValue = "",
}: {
  selectedLocations?: string[];
  searchValue?: string;
}) {
  const t = useTranslations("Store.common");
  const { data, isLoading } = useGetPublicStoresQuery({ size: 50 });
  const rawStores = data?.content ?? [];

  const promoStores = useMemo(() => {
    return rawStores
      .filter((store) => {
        if (!Boolean(store.discountLabel || store.promotionLabel || store.promotion)) {
          return false;
        }

        if (selectedLocations.length > 0) {
          const storeText = `${store.cityOrProvince ?? ""} ${store.address ?? ""} ${store.name ?? ""} ${store.about ?? ""}`.toLowerCase();
          const matchesLoc = selectedLocations.some((loc) =>
            storeText.includes(loc.toLowerCase()),
          );
          if (!matchesLoc) return false;
        }

        if (searchValue.trim()) {
          const term = searchValue.trim().toLowerCase();
          const storeText = `${store.name ?? ""} ${store.category?.name ?? ""} ${store.cityOrProvince ?? ""} ${store.address ?? ""} ${store.about ?? ""}`.toLowerCase();
          if (!storeText.includes(term)) return false;
        }

        return true;
      })
      .map(toStoreCard);
  }, [rawStores, selectedLocations, searchValue]);

  if (isLoading) {
    return (
      <section className="space-y-0">
        <SectionHeader title={t("promotions")} />
        <StoreRowSkeleton count={4} />
      </section>
    );
  }

  if (promoStores.length === 0) {
    return null;
  }

  return (
    <section className="space-y-0">
      <SectionHeader title={t("promotions")} />
      <StoreRow items={promoStores} />
    </section>
  );
}

export default function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  const { data: filteredStoresData, isLoading: isLoadingPublic } = useGetPublicStoresQuery({
    size: 100,
    categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
  });

  const rawPublicStores = filteredStoresData?.content ?? [];

  const filteredStores = useMemo(() => {
    return rawPublicStores.filter((store) => {
      if (selectedLocations.length > 0) {
        const storeText = `${store.cityOrProvince ?? ""} ${store.address ?? ""} ${store.name ?? ""} ${store.about ?? ""}`.toLowerCase();
        const matchesLoc = selectedLocations.some((loc) =>
          storeText.includes(loc.toLowerCase()),
        );
        if (!matchesLoc) return false;
      }

      if (searchValue.trim()) {
        const term = searchValue.trim().toLowerCase();
        const storeText = `${store.name ?? ""} ${store.category?.name ?? ""} ${store.cityOrProvince ?? ""} ${store.address ?? ""} ${store.about ?? ""}`.toLowerCase();
        if (!storeText.includes(term)) return false;
      }

      return true;
    });
  }, [rawPublicStores, selectedLocations, searchValue]);

  return (
    <div className="mx-auto max-w-362.5 space-y-6 px-4 pt-2 pb-6 sm:space-y-10 sm:pt-6 sm:py-6">
      <BannerCarousel />

      <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
        <aside className="sticky top-0 z-30 w-full shrink-0 overflow-x-hidden bg-background/95 py-2.5 backdrop-blur-md xl:sticky xl:top-24 xl:z-0 xl:w-64 xl:bg-transparent xl:py-0 xl:backdrop-blur-none xl:self-start">
          <div className="flex max-h-[calc(100vh-7rem)] flex-col overflow-hidden py-0">
            <div className="custom-scrollbar flex-1 overflow-y-auto overflow-x-hidden pr-2">
              <StoreFilterComponent
                selected={selectedCategories}
                onSelectedChange={setSelectedCategories}
                selectedLocations={selectedLocations}
                onLocationsChange={setSelectedLocations}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
              />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-10">
          <RecommendedSection
            selectedLocations={selectedLocations}
            searchValue={searchValue}
          />
          <PromotionsSection
            selectedLocations={selectedLocations}
            searchValue={searchValue}
          />
          <StoresByCategorySection
            stores={filteredStores}
            isLoading={isLoadingPublic}
          />
        </div>
      </div>
    </div>
  );
}
