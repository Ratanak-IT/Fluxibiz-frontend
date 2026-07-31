"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
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
import { toStoreCard } from "@/lib/type/storeType";

const RecommendShops: Store[] = [
  {
    id: "1",
    name: "Chip Mong",
    category: "Daily Fresh Fruit, High...",
    description: "Chopmong fresh, Fresh quality",
    location: "Toul Kork",
    hours: "",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKbxMiLonIEXU_K7WWSA74TtcPlK9hu_XEEEo8XA9IPLU3IWeDZYsiCHw&s=10",
    isOpen: true,
  },
  {
    id: "2",
    name: "Zando",
    category: "Daily Fresh Fruit, High...",
    description: "Zando Company, Fresh quality",
    location: "Toul Kork",
    hours: "",
    image:
      "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/assets/app/app-zando-logo.png",
    isOpen: true,
  },
  {
    id: "3",
    name: "KOI",
    category: "Daily Fresh Fruit, High...",
    description: "Koi Drink, Fresh quality",
    location: "Toul Kork",
    hours: "07:00 - 22:00",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo4VXwoCJ-dS4NLRkYdcXCfcyrdDSwUFBjNsmPymGlzVpIcZczXJtBPxSK&s=10",
    isOpen: true,
  },
  {
    id: "7",
    name: "MIXUE",
    category: "Daily Fresh Fruit, High...",
    description: "MIXUE Ice cream, Fresh quality",
    location: "Toul Kork",
    hours: "07:00 - 22:00",
    image:
      "https://i.pinimg.com/736x/b8/10/de/b810de0abac5d814637ed085df2f04ea.jpg",
    isOpen: true,
  },
  {
    id: "8",
    name: "KFC",
    category: "Daily Fresh Fruit, High...",
    description: "KFC Fresh, Fresh quality",
    location: "Toul Kork",
    hours: " 07:00 - 22:00",
    image:
      "https://i.pinimg.com/736x/91/2a/d1/912ad14928b0fc294054d485970880b2.jpg",
    isOpen: true,
  },
  {
    id: "33",
    name: "Chip Mong",
    category: "Daily Fresh Fruit, High...",
    description: "Chopmong fresh, Fresh quality",
    location: "Toul Kork",
    hours: "",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKbxMiLonIEXU_K7WWSA74TtcPlK9hu_XEEEo8XA9IPLU3IWeDZYsiCHw&s=10",
    isOpen: true,
  },
  {
    id: "23",
    name: "Zando",
    category: "Daily Fresh Fruit, High...",
    description: "Zando Company, Fresh quality",
    location: "Toul Kork",
    hours: "",
    image:
      "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/assets/app/app-zando-logo.png",
    isOpen: true,
  },
];

const promotions: Store[] = [
  {
    id: "4",
    name: "AEON",
    category: "AEON Q2 Deli, Fresh, High...",
    description: "AEON Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: " 07:00 - 22:00",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSASC65bCKsmDW5gynrtfhpueHTuZ4Aa4gk53oClcsB22uhb7uHQIxL2n72&s=10",
    discountLabel: "70%",
    isOpen: true,
  },
  {
    id: "5",
    name: "Daily Fresh Fruit",
    category: "Daily Fresh Fruit, High...",
    description: "Fresh Fruit Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: " 07:00 - 22:00",
    image:
      "https://i.pinimg.com/736x/b2/9e/99/b29e991c78bef89ce93cff1554a284d3.jpg",
    discountLabel: "10%",
    isOpen: true,
  },
  {
    id: "1",
    name: "Chip Mong",
    category: "Daily Fresh Fruit, High...",
    description: "chipmong Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: "",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKbxMiLonIEXU_K7WWSA74TtcPlK9hu_XEEEo8XA9IPLU3IWeDZYsiCHw&s=10",
    isOpen: true,
  },
  {
    id: "6",
    name: "Daily Fresh Fruit",
    category: "Daily Fresh Fruit, High...",
    description: "Fresh Fruit Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: " 07:00 - 22:00",
    image:
      "https://i.pinimg.com/736x/b2/9e/99/b29e991c78bef89ce93cff1554a284d3.jpg",
    isOpen: true,
  },
  {
    id: "2",
    name: "Zando",
    category: "Daily Fresh Fruit, High...",
    description: "Zando Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: "",
    image:
      "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/assets/app/app-zando-logo.png",
    isOpen: true,
  },
];

const food: Store[] = [
  {
    id: "64",
    name: "Daily Fresh Fruit",
    category: "Daily Fresh Fruit, High Fresh Fruit",
    description: "Fresh Fruit Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: " 07:00 - 22:00",
    image:
      "https://i.pinimg.com/736x/b2/9e/99/b29e991c78bef89ce93cff1554a284d3.jpg",
    isOpen: true,
  },
  {
    id: "9",
    name: "ZANDO",
    category: "Daily Fresh Fruit",
    description: "Zando Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: "",
    image:
      "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/assets/app/app-zando-logo.png",
    isOpen: true,
  },
  {
    id: "10",
    name: "Real Clothing",
    category: "Daily Fresh Fruit",
    description: "Clothing Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: "",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSASC65bCKsmDW5gynrtfhpueHTuZ4Aa4gk53oClcsB22uhb7uHQIxL2n72&s=10",
    isOpen: true,
  },
  {
    id: "4",
    name: "AEON",
    category: "AEON Q2 Deli, Fresh, High...",
    description: "AEON Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: " 07:00 - 22:00",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSASC65bCKsmDW5gynrtfhpueHTuZ4Aa4gk53oClcsB22uhb7uHQIxL2n72&s=10",
    discountLabel: "70%",
    isOpen: true,
  },
  {
    id: "5",
    name: "Daily Fresh Fruit",
    category: "Daily Fresh Fruit, High...",
    description: "Fresh Fruit Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: " 07:00 - 22:00",
    image:
      "https://i.pinimg.com/736x/b2/9e/99/b29e991c78bef89ce93cff1554a284d3.jpg",
    discountLabel: "10%",
    isOpen: true,
  },
  {
    id: "1",
    name: "Chip Mong",
    category: "Daily Fresh Fruit, High...",
    description: "chipmong Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: "",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKbxMiLonIEXU_K7WWSA74TtcPlK9hu_XEEEo8XA9IPLU3IWeDZYsiCHw&s=10",
    isOpen: true,
  },
  {
    id: "6",
    name: "Daily Fresh Fruit",
    category: "Daily Fresh Fruit, High...",
    description: "Fresh Fruit Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: " 07:00 - 22:00",
    image:
      "https://i.pinimg.com/736x/b2/9e/99/b29e991c78bef89ce93cff1554a284d3.jpg",
    isOpen: true,
  },
  {
    id: "2",
    name: "Zando",
    category: "Daily Fresh Fruit, High...",
    description: "Zando Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: "",
    image:
      "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/assets/app/app-zando-logo.png",
    isOpen: true,
  },
];

const nearby: Store[] = [
  {
    id: "7",
    name: "MIXUE",
    category: "Daily Fresh Fruit, High...",
    description: "MIXUE Ice cream, Fresh quality",
    location: "Toul Kork",
    hours: " 07:00 - 22:00",
    image:
      "https://i.pinimg.com/736x/8c/e6/cf/8ce6cf60303b39d28e25ab838e0966f9.jpg",
    isOpen: true,
  },
  {
    id: "8",
    name: "KFC",
    category: "Daily Fresh Fruit, High...",
    description: "MIXUE Ice cream, Fresh quality",
    location: "Toul Kork",
    hours: " 07:00 - 22:00",
    image:
      "https://i.pinimg.com/736x/ee/93/70/ee9370b2e11c2e0d52d49a86934a7de0.jpg",
    isOpen: true,
  },
  {
    id: "4",
    name: "AEON",
    category: "AEON Q2 Deli, Fresh, High...",
    description: "AEON Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: " 07:00 - 22:00",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSASC65bCKsmDW5gynrtfhpueHTuZ4Aa4gk53oClcsB22uhb7uHQIxL2n72&s=10",
    discountLabel: "70%",
    isOpen: true,
  },
  {
    id: "5",
    name: "Daily Fresh Fruit",
    category: "Daily Fresh Fruit, High...",
    description: "Fresh Fruit Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: " 07:00 - 22:00",
    image:
      "https://i.pinimg.com/736x/b2/9e/99/b29e991c78bef89ce93cff1554a284d3.jpg",
    discountLabel: "10%",
    isOpen: true,
  },
  {
    id: "1",
    name: "Chip Mong",
    category: "Daily Fresh Fruit, High...",
    description: "chipmong Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: "",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKbxMiLonIEXU_K7WWSA74TtcPlK9hu_XEEEo8XA9IPLU3IWeDZYsiCHw&s=10",
    isOpen: true,
  },
  {
    id: "6",
    name: "Daily Fresh Fruit",
    category: "Daily Fresh Fruit, High...",
    description: "Fresh Fruit Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: " 07:00 - 22:00",
    image:
      "https://i.pinimg.com/736x/b2/9e/99/b29e991c78bef89ce93cff1554a284d3.jpg",
    isOpen: true,
  },
  {
    id: "2",
    name: "Zando",
    category: "Daily Fresh Fruit, High...",
    description: "Zando Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: "",
    image:
      "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/assets/app/app-zando-logo.png",
    isOpen: true,
  },
];

const stores: Store[] = [
  {
    id: "9",
    name: "ZANDO",
    category: "Daily Fresh Fruit",
    description: "Zando Company, Fresh quality",
    location: "Toul Kork",
    hours: "",
    image:
      "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/assets/app/app-zando-logo.png",
    isOpen: true,
  },
  {
    id: "10",
    name: "Real Clothing",
    category: "Daily Fresh Fruit",
    description: "Clothing pans, Fresh quality",
    location: "Toul Kork",
    hours: "",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSASC65bCKsmDW5gynrtfhpueHTuZ4Aa4gk53oClcsB22uhb7uHQIxL2n72&s=10",
    isOpen: true,
  },
  {
    id: "4",
    name: "AEON",
    category: "AEON Q2 Deli, Fresh, High...",
    description: "AEON Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: " 07:00 - 22:00",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSASC65bCKsmDW5gynrtfhpueHTuZ4Aa4gk53oClcsB22uhb7uHQIxL2n72&s=10",
    discountLabel: "70%",
    isOpen: true,
  },
  {
    id: "5",
    name: "Daily Fresh Fruit",
    category: "Daily Fresh Fruit, High...",
    description: "Fresh Fruit Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: " 07:00 - 22:00",
    image:
      "https://i.pinimg.com/736x/b2/9e/99/b29e991c78bef89ce93cff1554a284d3.jpg",
    discountLabel: "10%",
    isOpen: true,
  },
  {
    id: "1",
    name: "Chip Mong",
    category: "Daily Fresh Fruit, High...",
    description: "chipmong Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: "",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKbxMiLonIEXU_K7WWSA74TtcPlK9hu_XEEEo8XA9IPLU3IWeDZYsiCHw&s=10",
    isOpen: true,
  },
  {
    id: "6",
    name: "Daily Fresh Fruit",
    category: "Daily Fresh Fruit, High...",
    description: "Fresh Fruit Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: " 07:00 - 22:00",
    image:
      "https://i.pinimg.com/736x/b2/9e/99/b29e991c78bef89ce93cff1554a284d3.jpg",
    isOpen: true,
  },
  {
    id: "2",
    name: "Zando",
    category: "Daily Fresh Fruit, High...",
    description: "Zando Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: "",
    image:
      "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/assets/app/app-zando-logo.png",
    isOpen: true,
  },
];

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
          href={`/store/${store.id}`}
          className="shrink-0 snap-start"
        >
          <StoreCardComponent store={store} />
        </Link>
      ))}
    </ScrollRow>
  );
}

function RecommendedSection() {
  const { data, isLoading } = useGetRecommendedStoresQuery({ size: 10 });
  const liveStores = data?.content.map(toStoreCard) ?? [];
  const storesToDisplay = liveStores.length > 0 ? liveStores : RecommendShops;

  return (
    <section className="space-y-3">
      <SectionHeader title="Recommend" />
      {isLoading ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          Loading recommended stores...
        </div>
      ) : (
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
      )}
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-362.5 space-y-10 px-4 py-6">
      <BannerCarousel />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-55 lg:self-start">
          <div className="flex max-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-lg p-4">
            <div className="flex-1 overflow-y-auto pr-1">
              <StoreFilterComponent />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-10">
          <RecommendedSection />

          <section className="space-y-3">
            <SectionHeader title="Promotions" />
            <StoreRow items={promotions} />
          </section>

          <section className="space-y-3">
            <SectionHeader title="Food" />
            <StoreRow items={food} />
          </section>

          <section className="space-y-3">
            <SectionHeader title="Nearby Store" />
            <StoreRow items={nearby} />
          </section>

          <section className="space-y-3">
            <SectionHeader title="Store" />
            <StoreRow items={stores} />
            <div className="flex justify-center pt-4">
              <button
                className="
                  flex items-center gap-2 rounded-full bg-primary
                  px-6 py-2 text-sm font-medium text-white
                  transition-colors hover:bg-primary/90
                "
              >
                See More <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}