"use client";

import { useState, useEffect, use } from "react";
import Script from "next/script";
import TmaHeader from "@/components/tma/TmaHeader";
import TmaProductGrid from "@/components/tma/TmaProductGrid";
import TmaCartDrawer from "@/components/tma/TmaCartDrawer";
import type { PublicStoreDetailResponse, ItemResponse } from "@/lib/type/storeType";

interface TmaStorePageProps {
  params: Promise<{ slug: string }>;
}

export default function TmaStorePage({ params }: TmaStorePageProps) {
  const { slug } = use(params);
  const [store, setStore] = useState<PublicStoreDetailResponse | null>(null);
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [itemsMap, setItemsMap] = useState<Record<string, ItemResponse>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const baseUrl = "/api/v1";

        const [storeRes, itemsRes] = await Promise.all([
          fetch(`${baseUrl}/public/stores/${slug}`),
          fetch(`${baseUrl}/public/stores/${slug}/items`),
        ]);

        if (!storeRes.ok) {
          throw new Error("Store not found");
        }

        const storeData = await storeRes.json();
        const itemsData = itemsRes.ok ? await itemsRes.json() : [];

        setStore(storeData);
        setItems(Array.isArray(itemsData) ? itemsData : []);

        const map: Record<string, ItemResponse> = {};
        if (Array.isArray(itemsData)) {
          itemsData.forEach((i: ItemResponse) => {
            map[i.id] = i;
          });
        }
        setItemsMap(map);
      } catch (err: unknown) {
        console.error("Failed to load TMA store", err);
        setError("Unable to load storefront. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleAddToCart = (item: ItemResponse) => {
    setCartItems((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (item: ItemResponse) => {
    setCartItems((prev) => {
      const current = prev[item.id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[item.id];
        return next;
      }
      return { ...prev, [item.id]: current - 1 };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading Storefront...</p>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center text-white">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm">
          <p className="text-sm font-medium text-red-400">{error || "Store Not Found"}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <TmaHeader store={store} />
        <TmaProductGrid
          items={items}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
        />
        <TmaCartDrawer
          store={store}
          cartItems={cartItems}
          itemsMap={itemsMap}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
        />
      </div>
    </>
  );
}
