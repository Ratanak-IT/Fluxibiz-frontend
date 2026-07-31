"use client";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  Plus } from "lucide-react";
import Image from "next/image";
import { MenuItemData } from "@/lib/store/detailstore/detailstore";
import { useState } from "react";
import ProductQuickViewModal  from "./product-view-modal";

interface MenuProductCardProps {
  item: MenuItemData;
}

export function MenuProductCard({ item }: MenuProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

   
  return (
   
  <Card className=" max-w-xl overflow-hidden border-0 bg-white p-0 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg dark:bg-card">
  <div className="flex h-full min-h-25 sm:min-h-30">
    {/* Left: text content */}
    <div className="flex min-w-0 flex-1 flex-col justify-between p-2.5 sm:p-3 pr-2">
      <CardHeader className="gap-0.5 p-0">
        <CardTitle className="truncate text-sm font-bold text-text dark:text-text sm:text-base">
          {item.name}
        </CardTitle>
        <p className="text-sm font-bold text-red-500 dark:text-red-400 sm:text-base">
          $ {item.price}
        </p>
        <CardDescription className="line-clamp-2 text-[11px] text-neutral-500 dark:text-neutral-400 sm:text-xs">
          {item.description}
        </CardDescription>
      </CardHeader>

      <span className="mt-0.5 text-[11px] font-bold text-primary dark:text-primary sm:text-xs">
        {item.category}
      </span>
    </div>

    {/* Right: image + add button */}
    <div className="relative m-2 sm:m-2.5 aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-card sm:w-24 md:w-28">
      <Image
        src={item.image}
        alt={item.name}
        fill
        sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
        className="h-full w-full object-cover"
      />

      <div className="absolute bottom-1 right-1">
     
          
         <Button
  type="button"
  size="icon"
  variant="secondary"
  className="h-6 w-6 rounded-full bg-card text-primary shadow-md hover:bg-card dark:bg-text dark:text-primary sm:h-7 sm:w-7"
  aria-label={`Add ${item.name} to cart`}
  onClick={() => setQuickViewOpen(true)}
>
  <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
</Button>

<ProductQuickViewModal
  productId={item.id}
  open={quickViewOpen}
  onOpenChange={setQuickViewOpen}
/>
        
      </div>
    </div>
  </div>
</Card>
  );
}
