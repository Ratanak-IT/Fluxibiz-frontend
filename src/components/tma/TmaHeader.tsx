"use client";

import Image from "next/image";
import { resolveMediaUrl } from "@/lib/type/cartType";
import type { PublicStoreDetailResponse } from "@/lib/type/storeType";
import { Store, MapPin, Phone, Clock } from "lucide-react";

interface TmaHeaderProps {
  store: PublicStoreDetailResponse;
}

export default function TmaHeader({ store }: TmaHeaderProps) {
  const storeName = store.name || store.displayName || "Store";
  const rawLogo = store.logo || store.thumbnail;
  const logoUrl = rawLogo ? resolveMediaUrl(rawLogo) : null;
  const isClosed = store.isClosed;

  return (
    <div className="relative bg-slate-900 text-white pb-6 pt-4 px-4 rounded-b-3xl shadow-xl border-b border-slate-800">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-500/20 to-purple-600/20 rounded-b-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-3">
        <div className="relative w-20 h-20 rounded-2xl bg-slate-800 p-1 shadow-2xl ring-2 ring-blue-500/50 overflow-hidden">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={storeName}
              fill
              className="object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-blue-400 rounded-xl">
              <Store className="w-10 h-10" />
            </div>
          )}
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            {storeName}
          </h1>
          {store.category?.name && (
            <span className="inline-block mt-1 px-3 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
              {store.category.name}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
          {store.cityOrProvince && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{store.cityOrProvince}</span>
            </div>
          )}
          {store.phoneNumber && (
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-green-400" />
              <span>{store.phoneNumber}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className={isClosed ? "text-red-400" : "text-emerald-400 font-semibold"}>
              {isClosed ? "Closed" : "Open Now"}
            </span>
          </div>
        </div>

        {store.about && (
          <p className="text-xs text-slate-400 max-w-xs line-clamp-2 px-2">
            {store.about}
          </p>
        )}
      </div>
    </div>
  );
}
