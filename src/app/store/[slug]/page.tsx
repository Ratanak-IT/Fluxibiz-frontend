import SearchFilterBar from "@/components/store/detailstore/button";
import ProductList from "@/components/store/detailstore/product-list";

import StoreCard from "@/components/store/detailstore/store-card";
import {
  getPopularMenuItems,
  getTeaMenuItems,
} from "@/lib/store/detailstore/detailstore";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default async function StoreDetail() {
  const popularMenuItems = await getPopularMenuItems();
  const teaMenuItems = await getTeaMenuItems();

  return (
    <div className="mx-auto max-w-362.5 space-y-10  py-6 sm:px-10 ">
      <div className="mb-4 flex items-center justify-between px-23">
        <Link
          href="/store"
          className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Store
        </Link>
        <Link
          href="storeDetail/cart"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary"
        >
          <ShoppingCart className="h-4 w-4" />
          Cart
        </Link>
      </div>

      <div className="space-y-10 ">
        <StoreCard />
        <SearchFilterBar />

        <ProductList title="Popular Menu" items={popularMenuItems} />
        <ProductList title="Tea Menu" items={teaMenuItems} />
      </div>
    </div>
  );
}
