import SearchFilterBar from "@/components/store/detailstore/button";
import ProductList from "@/components/store/detailstore/product-list";
import CartSidebar from "@/components/store/detailstore/cart-sidebar";
import StoreCard from "@/components/store/detailstore/store-card";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default async function StoreDetail() {

 
  return (
    <div className="mx-auto max-w-362.5 space-y-10 py-6 sm:px-10 dark:bg-background">
      <div className="mb-4 flex items-center justify-between px-4 sm:px-8 md:px-14 lg:px-23">
        <Link
          href="/store"
          className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Store
        </Link>
        <Link
          href="storeDetail/cart"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary sm:h-11 sm:px-5 lg:hidden"
        >
          <ShoppingCart className="h-4 w-4" />
          Cart
        </Link>
      </div>
 
      <div className="space-y-10">
        <StoreCard />
        <SearchFilterBar />
      </div>
 
      <div className="grid grid-cols-1 items-start justify-center gap-0 pr-6 sm:pr-10 lg:pr-25 lg:grid-cols-[1fr_400px] lg:gap-0">
        <div className="min-w-0 space-y-2">
          <ProductList title="Popular" type="popular" />
      <ProductList title="Tea Series" type="tea" />
        </div>
 
        {/* Cart sidebar: hidden on mobile (use the Cart link above instead), sticky on desktop */}
        <div className="hidden lg:block lg:pt-8">
          <div className="sticky top-6">
            <CartSidebar subtotal={0} />
          </div>
        </div>
      </div>
    </div>
  );
}
