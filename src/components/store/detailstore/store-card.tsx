import Image from "next/image";
import { Card, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Clock, ImageOff, MapPin } from "lucide-react";
import { StoreCardData } from "@/lib/store/store";

interface StoreCardComponentProps {
  store?: StoreCardData;
}

export default function StoreCard({ store }: StoreCardComponentProps) {
  if (!store) {
    return (
      <div className="mb-4 px-4 sm:px-6 md:px-12 lg:px-20">
        <Card className="overflow-hidden bg-card p-0">
          <div className="flex h-40 animate-pulse flex-col gap-3 p-4 sm:flex-row">
            <div className="h-32 w-full rounded-lg bg-muted sm:w-44" />
            <div className="flex flex-1 flex-col justify-center gap-3">
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-5 w-48 rounded bg-muted" />
              <div className="h-3 w-64 rounded bg-muted" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const imageUrl = store.image?.trim() ? store.image : null;

  return (
    <div className="mb-4 px-4 sm:px-6 md:px-12 lg:px-20">
      <Card className="overflow-hidden bg-card p-0">
        <div className="flex flex-col sm:h-44 sm:flex-row">
          <div className="relative h-44 w-full shrink-0 p-3 sm:w-44 md:w-48">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={store.name || "Store logo"}
                fill
                unoptimized
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted">
                <ImageOff className="h-6 w-6 text-neutral-300" />
              </div>
            )}
          </div>

          {/* Content — 3 Vertical Sections: Top, Middle, Bottom */}
          <div className="flex flex-1 flex-col justify-between p-4 sm:px-6 sm:py-3.5">
            {/* 1. Top Section: Category & Promotion */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                {store.category}
              </span>

              {store.discountLabel && (
                <div className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:bg-red-500/20 dark:text-red-400">
                  🏷️ PROMOTION: {store.discountLabel}
                </div>
              )}
            </div>

            {/* 2. Middle Section: Store Name */}
            <div className="my-1">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                {store.name}
              </h1>
            </div>

            {/* 3. Bottom Section: Location & Operating Hours */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground sm:gap-6 sm:text-sm">
              <div className="flex min-w-0 items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{store.location}</span>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <span>
                  {store.openTime && store.closeTime
                    ? `${store.openTime} – ${store.closeTime}`
                    : store.hours || "Open 24/7"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {store.description && (
        <div className="mt-4 text-xs text-muted-foreground sm:text-sm">
          {store.description}
        </div>
      )}
    </div>
  );
}