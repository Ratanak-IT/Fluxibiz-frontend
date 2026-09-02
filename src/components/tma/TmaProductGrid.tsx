"use client";

import { useState } from "react";
import Image from "next/image";
import { primaryItemImage, type ItemResponse } from "@/lib/type/storeType";
import { Plus, Minus, ShoppingBag } from "lucide-react";

interface TmaProductGridProps {
  items: ItemResponse[];
  cartItems: Record<string, number>;
  onAddToCart: (item: ItemResponse) => void;
  onRemoveFromCart: (item: ItemResponse) => void;
}

export default function TmaProductGrid({
  items,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
}: TmaProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = Array.from(
    new Set(
      items
        .map((i) => i.itemGroup?.name)
        .filter((c): c is string => Boolean(c))
    )
  );

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "ALL") return true;
    return item.itemGroup?.name === selectedCategory;
  });

  return (
    <div className="p-4 space-y-4 pb-28">
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === "ALL"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
            }`}
          >
            All Items ({items.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
          <ShoppingBag className="w-12 h-12 mb-2 stroke-1" />
          <p className="text-sm font-medium">No items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const imageUrl = primaryItemImage(item);
            const qty = cartItems[item.id] || 0;
            const priceDisplay = item.unitPrice
              ? `$${Number(item.unitPrice).toFixed(2)}`
              : "Free";

            return (
              <div
                key={item.id}
                className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3 flex flex-col justify-between shadow-lg hover:border-slate-600 transition-all"
              >
                <div className="relative w-full aspect-square rounded-xl bg-slate-900 overflow-hidden mb-2">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-slate-100 line-clamp-2 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-sm font-bold text-blue-400">
                    {priceDisplay}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between">
                  {qty > 0 ? (
                    <div className="flex items-center justify-between w-full bg-blue-950/60 border border-blue-500/40 rounded-xl px-2 py-1">
                      <button
                        onClick={() => onRemoveFromCart(item)}
                        className="text-blue-400 hover:text-white p-0.5"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-white px-2">
                        {qty}
                      </span>
                      <button
                        onClick={() => onAddToCart(item)}
                        className="text-blue-400 hover:text-white p-0.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAddToCart(item)}
                      className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shadow-md shadow-blue-600/30 transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
