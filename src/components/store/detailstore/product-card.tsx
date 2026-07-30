"use client";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { MenuItemData } from "@/lib/store/detailstore/detailstore";
import { useState } from "react";

interface MenuProductCardProps {
  item: MenuItemData;
}

export function MenuProductCard({ item }: MenuProductCardProps) {
  const [quantity, setQuantity] = useState(0);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
  return (
   <Card className="w-full max-w-xl overflow-hidden border-0 bg-white p-0 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg dark:bg-card">
  <div className="flex h-full min-h-[140px] sm:min-h-[165px]">
    {/* Left: text content */}
    <div className="flex min-w-0 flex-1 flex-col justify-between p-3.5 sm:p-4 pr-2">
      <CardHeader className="gap-1 p-0">
        <CardTitle className="truncate text-base font-bold text-text dark:text-text sm:text-lg md:text-xl">
          {item.name}
        </CardTitle>
        <p className="text-base font-bold text-red-500 dark:text-red-400 sm:text-lg">
          $ {item.price}
        </p>
        <CardDescription className="line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
          {item.description}
        </CardDescription>
      </CardHeader>
      
      <span className="mt-1 text-xs font-bold text-primary dark:text-primary sm:text-sm">
        {item.category}
      </span>
    </div>

    {/* Right: image + add button */}
    <div className="relative m-2.5 sm:m-3 aspect-square w-28 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-card sm:w-36 md:w-40">
      <Image
        src={item.image}
        alt={item.name}
        fill
        sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 160px"
        className="h-full w-full object-cover"
      />
      
      <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2">
        {quantity === 0 ? (
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="h-7 w-7 rounded-full bg-card text-primary shadow-md hover:bg-card dark:bg-text dark:text-primary sm:h-8 sm:w-8"
            aria-label={`Add ${item.name} to cart`}
            onClick={handleIncrement}
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        ) : (
          /* (- 1 +) Quantity Stepper */
          <div className="flex h-7 items-center gap-1.5 rounded-full border border-neutral-100 bg-card px-1.5 py-0.5 shadow-md dark:border-neutral-800 dark:bg-text sm:h-8 sm:gap-2 sm:px-2 sm:py-1">
            <button
              type="button"
              className="p-1 text-red-500 transition-opacity hover:opacity-80"
              onClick={handleDecrement}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>

            <span className="min-w-3 text-center text-xs font-semibold text-neutral-800 dark:text-neutral-100 sm:text-sm">
              {quantity}
            </span>

            <button
              type="button"
              className="p-1 text-green-600 transition-opacity hover:opacity-80"
              onClick={handleIncrement}
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
</Card>
  );
}
