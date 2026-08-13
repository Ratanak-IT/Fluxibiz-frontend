import { useTranslations } from "next-intl";
import Image from "next/image";
import { Card } from "../../ui/card";
import { Clock, ImageOff, MapPin } from "lucide-react";
import { StoreCardData } from "@/lib/store/detailstore/store";
import { StoreCardSkeleton } from "@/components/common/Skeletons";

interface StoreCardComponentProps {
  store?: StoreCardData;
}

export default function StoreCard({ store }: StoreCardComponentProps) {
  const t = useTranslations("Store.common");
  if (!store) {
    return <StoreCardSkeleton />;
  }

  const imageUrl = store.image?.trim() ? store.image : null;

  return (
    <div className="mb-4 px-4 sm:px-6 md:px-12 lg:px-20">
      <Card className="overflow-hidden bg-card p-0">
        <div className="flex flex-col sm:h-44 md:flex-row">
          <div className="relative flex h-56 w-full shrink-0 items-center justify-center p-3.5 sm:h-44 sm:w-44 md:w-48">
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-white p-2 dark:bg-card">
              {imageUrl ? (
                <div className="relative h-full w-full overflow-hidden rounded-md">
                  <Image
                    src={imageUrl}
                    alt={store.name || t("storeLogo")}
                    fill
                    unoptimized
                    className="h-full w-full rounded-md object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
                  <ImageOff className="h-6 w-6 text-neutral-300" />
                </div>
              )}
            </div>
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
                {store.googleMap ? (
                  <a
                    href={store.googleMap}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-primary hover:underline"
                    title={store.address || store.location}
                  >
                    {store.address || store.location}
                  </a>
                ) : (
                  <span className="truncate" title={store.address || store.location}>
                    {store.address || store.location}
                  </span>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <span>
                  {store.openTime && store.closeTime
                    ? `${store.openTime} – ${store.closeTime}`
                    : store.hours || t("openAllDay")}
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