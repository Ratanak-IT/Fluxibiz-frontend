import { useTranslations } from "next-intl";
import Image from "next/image";
import { Card } from "../../ui/card";
import { Clock, ImageOff, MapPin, Phone } from "lucide-react";
import { TbBrandFacebook } from "react-icons/tb";
import { StoreCardData } from "@/lib/store/detailstore/store";
import { StoreCardSkeleton } from "@/components/common/Skeletons";
import { formatDistance, formatStoreTime } from "@/lib/type/storeType";
import StoreHours from "./store-hours";

interface StoreCardComponentProps {
  store?: StoreCardData;
}

export default function StoreCard({ store }: StoreCardComponentProps) {
  const t = useTranslations("Store.common");
  if (!store) {
    return <StoreCardSkeleton />;
  }

  const imageUrl = store.image?.trim() ? store.image : null;
  const distanceLabel = formatDistance(store.distanceKm);

  return (
    <div className="mb-4 px-4 sm:px-6 md:px-12 lg:px-20">
      <Card className="overflow-hidden bg-card p-0">
        <div className="flex flex-col sm:h-auto md:h-48 md:flex-row">
          <div className="relative flex h-60 w-full shrink-0 items-center justify-center p-3.5 sm:h-48 sm:w-48 md:h-48 md:w-52">
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-white p-2 dark:bg-card">
              {imageUrl ? (
                <div className="relative h-full w-full overflow-hidden rounded-md">
                  <Image
                    src={imageUrl}
                    alt={store.name || t("storeLogo")}
                    fill
                    unoptimized
                    priority
                    sizes="(max-width: 640px) 100vw, 192px"
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

         
          <div className="flex flex-1 flex-col justify-start gap-2.5 p-3.5 sm:px-6 sm:py-3.5 md:justify-between md:gap-0 min-w-0">
            {/* 1. Category & Promotion */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[14px] sm:text-[16px] font-medium text-muted-foreground leading-tight">
                {store.category}
              </span>

              {store.discountLabel && (
                <div className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-[12px] font-bold text-red-600 dark:bg-red-500/20 dark:text-red-400">
                  PROMOTION: {store.discountLabel}
                </div>
              )}
            </div>

            {/* 2. Store Name */}
            <div className="flex items-center">
              <h1 className="text-[19px] font-bold leading-tight tracking-tight text-foreground sm:text-2xl md:text-3xl">
                {store.name}
              </h1>
            </div>

            {/* 3. Location */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm min-w-0">
              {store.googleMap ? (
                <a
                  href={store.googleMap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/loc flex min-w-0 flex-1 items-center gap-1.5 text-[14px] sm:text-[16px] text-muted-foreground transition-colors hover:text-primary hover:underline leading-tight"
                  title={store.address || store.location}
                >
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover/loc:text-primary" />
                  <span className="min-w-0 flex-1 truncate">
                    {store.address || store.location}
                  </span>
                </a>
              ) : (
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate text-[14px] sm:text-[16px] text-muted-foreground leading-tight" title={store.address || store.location}>
                    {store.address || store.location}
                  </span>
                </div>
              )}
            </div>

            {/* 4. Phone Number & Facebook Link */}
            {(store.phoneNumber || store.facebookUrl) && (
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:text-sm">
                {store.phoneNumber && (
                  <a
                    href={`tel:${store.phoneNumber}`}
                    className="group/phone flex shrink-0 items-center gap-1.5 text-[14px] sm:text-[15px] font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover/phone:text-primary" />
                    <span>{store.phoneNumber}</span>
                  </a>
                )}
                {store.phoneNumber && store.facebookUrl && (
                  <span className="text-muted-foreground/40">·</span>
                )}
                {store.facebookUrl && (
                  <a
                    href={store.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/fb flex shrink-0 items-center gap-1.5 text-[14px] sm:text-[15px] font-medium text-muted-foreground transition-colors hover:text-primary"
                    title={store.facebookName || store.name || "Facebook Page"}
                  >
                    <TbBrandFacebook className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover/fb:text-primary" />
                    <span>{store.facebookName || store.name || "Facebook Page"}</span>
                  </a>
                )}
              </div>
            )}

            {/* 5. Operating Hours / Open 24/7 & Distance Away */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-primary font-medium sm:text-sm">
              {store.onlineHours ? (
                <StoreHours
                  onlineHours={store.onlineHours}
                  isOpen={store.isOpen}
                  className="shrink-0 text-primary"
                />
              ) : (
                <div className="flex shrink-0 items-center gap-1.5 text-primary">
                  <Clock className="h-4 w-4 shrink-0 text-primary" />
                  <span className="leading-tight font-medium text-primary">
                    {store.openTime && store.closeTime
                      ? `${formatStoreTime(store.openTime)} – ${formatStoreTime(store.closeTime)}`
                      : store.hours || t("openAllDay")}
                  </span>
                </div>
              )}

              {distanceLabel && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-muted-foreground/60">·</span>
                  <span className="font-medium text-primary">
                    {t("distanceAway", { distance: distanceLabel })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {store.description && (
        <div className="mt-4 text-[14px] sm:text-[15px] text-muted-foreground">
          {store.description}
        </div>
      )}
    </div>
  );
}