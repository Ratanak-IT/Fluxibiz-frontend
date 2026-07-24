"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import BannerCarousel from "@/components/store/StoreComponent/BannerCarousel";
import StoreCardHorizontal from "@/components/store/StoreComponent/StoreCardHorizontal";
import StoreFilterComponent from "@/components/store/StoreComponent/StoreFilterComponent";
import {
  Store,
  StoreCardComponent,
} from "@/components/store/StoreComponent/StoreCartComponent";


const popularShops: Store[] = [
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
    hours: "",
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
    hours: "Tue and Sun 07:00 - 22:00",
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
    hours: "Tue and Sun 07:00 - 22:00",
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
    hours: "Tue and Sun 07:00 - 22:00",
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
    hours: "Tue and Sun 07:00 - 22:00",
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
    hours: "Tue and Sun 07:00 - 22:00",
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

const recommend: Store[] = [
  {
    id: "64",
    name: "Daily Fresh Fruit",
    category: "Daily Fresh Fruit, High Fresh Fruit",
    description: "Fresh Fruit Q2 Deli, Fresh quality",
    location: "Toul Kork",
    hours: "Tue and Sun 07:00 - 22:00",
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
    hours: "Tue and Sun 07:00 - 22:00",
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
    hours: "Tue and Sun 07:00 - 22:00",
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
    hours: "Tue and Sun 07:00 - 22:00",
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
    hours: "Tue and Sun 07:00 - 22:00",
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
    hours: "Tue and Sun 07:00 - 22:00",
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
    hours: "Tue and Sun 07:00 - 22:00",
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
    hours: "Tue and Sun 07:00 - 22:00",
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
    hours: "Tue and Sun 07:00 - 22:00",
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
    hours: "Tue and Sun 07:00 - 22:00",
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
    hours: "Tue and Sun 07:00 - 22:00",
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
    hours: "Tue and Sun 07:00 - 22:00",
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
      <button className="text-muted-foreground hover:text-foreground">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

// Horizontal scroll
function StoreRow({ items }: { items: Store[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none]  [&::-webkit-scrollbar]:hidden">
      {items.map((store) => (
        <div key={store.id} className="shrink-0 snap-start">
          <StoreCardComponent store={store} />
        </div>
      ))}
    </div>
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
          <section className="space-y-3">
            <SectionHeader title="Popular Shops" />
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {popularShops.map((store) => (
                <div
                  key={store.id}
                  className="shrink-0 snap-start basis-[calc((100%-3*theme(spacing.4))/4)]"
                >
                  <StoreCardHorizontal store={store} />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <SectionHeader title="Promotions" />
            <StoreRow items={promotions} />
          </section>

          <section className="space-y-3">
            <SectionHeader title="Recommend" />
            <StoreRow items={recommend} />
          </section>

          <section className="space-y-3">
            <SectionHeader title="Nearby Store" />
            <StoreRow items={nearby} />
          </section>

          <section className="space-y-3">
            <SectionHeader title="Store" />
            <StoreRow items={stores} />
            <div className="flex justify-center pt-4">
              <button className="rounded-full bg-primary px-6 py-2 text-sm flex items-center gap-2 font-medium text-white">
                See More <ChevronDown/>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
