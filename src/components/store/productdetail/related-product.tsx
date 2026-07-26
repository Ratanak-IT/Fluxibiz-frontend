// related-products.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {  Products } from "@/lib/store/detailproduct/product";
import { ProductCard } from "./prodcuct-card";


interface RelatedProductsProps {
  title?: string;
  items: Products[];
  viewAllHref?: string;
}

export function RelatedProducts({
  title = "You May Also Like",
  items,
  viewAllHref = "#",
}: RelatedProductsProps) {
  return (
    <section className="m-25">
     
      <div className="mb-4 flex items-center justify-between ">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>


      <div
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2
          [-ms-overflow-style:none] [scrollbar]
          [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div key={item.id} className="shrink-0 snap-start">
            <ProductCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}