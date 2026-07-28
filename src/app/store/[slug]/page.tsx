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
        <div className="min-h-screen bg-neutral-100 px-25 py-6 sm:px-10 dark:bg-neutral-950">
            <div className="mb-4 flex items-center justify-between px-25">
                <button
                    type="button"
                    className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Store
                </button>
                <Link
                    href="storeDetail/cart"
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-green-600 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700"
                >
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                </Link>
            </div>
            <StoreCard />
            <SearchFilterBar />

            <ProductList title="Popular Menu" items={popularMenuItems} />
            <ProductList title="Tea Menu" items={teaMenuItems} />
        </div>
    );
}
