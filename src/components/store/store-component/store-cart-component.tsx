"use client";

import { CardContent } from "@/components/ui/card";
import { Clock, MapPin, Store as StoreIcon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useGetPublicStoreQuery } from "@/features/store-api/store-api";
import { formatDistance, type Store } from "@/lib/type/storeType";

export type { Store } from "@/lib/type/storeType";

export interface StoreCardComponentProps {
  store: Store;
}

export function StoreCardComponent({ store }: StoreCardComponentProps) {
  const t = useTranslations("Store");
  const {
    name,
    description,
    location,
    address,
    hours,
    openTime,
    closeTime,
    image,
    discountLabel,
    isOpen,
    distanceKm,
  } = store;
  const distanceLabel = formatDistance(distanceKm);

  const { data: storeDetail } = useGetPublicStoreQuery(store.slug || store.id, {
    skip: Boolean(address),
  });

  const displayLocation = storeDetail?.address || address || location || "";

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasError(false);
  }, [image]);

  const displayHours =
    openTime && closeTime ? `${openTime} – ${closeTime}` : hours;

  return (
    <div
      className="
        group relative mx-auto mt-3 
        h-[300px] w-[260px] cursor-pointer p-2.5 bg-white
        overflow-hidden rounded-2xl shadow-sm duration-100 hover:duration-100 hover:shadow-md hover:scale-98 ease-out transition-transform
        dark:bg-muted dark:shadow-md dark:shadow-black/40 dark:hover:shadow-sm dark:hover:shadow-black/50
      "
    >
      <div className="relative grow h-38 w-full overflow-hidden rounded-xl bg-muted flex items-center justify-center">
        {image && !hasError ? (
          <Image
            src={image}
            unoptimized
            fill
            alt={name || t("common.storeLogo")}
            onError={() => setHasError(true)}
            sizes="(max-width: 768px) 50vw, 272px"
            className="object-cover rounded-xl"
          />
        ) : (
          <StoreIcon className="h-12 w-12 text-muted-foreground" />
        )}
        {discountLabel && (
          <div
            title={discountLabel}
            className="
              absolute top-2 left-2 
              bg-red-500 
              z-10 flex 
              h-12 w-12 
              items-center justify-center 
              text-center leading-none 
              rounded-full
              text-white
              border-2 border-dashed 
              border-input
              shadow-xs p-1
              dark:bg-red-500 dark:border-foreground/80 dark:text-white
            "
          >
            <span className="text-[9px] font-black uppercase leading-tight line-clamp-2 break-words text-center">
              {discountLabel}
            </span>
          </div>
        )}
        <div
          className={`
            absolute top-2 right-2 
            z-10 rounded-full 
            px-3 py-1 
            text-xs font-semibold
            text-primary-foreground
            ${isOpen ? "bg-primary" : "bg-muted dark:bg-neutral-700 dark:text-neutral-200"}
        `}
        >
          {isOpen ? t("common.open") : t("common.closed")}
        </div>
      </div>
      <CardContent className="space-y-1 p-1 mt-2">
        <h3
          className="
            text-[18px] font-semibold 
            leading-tight 
            text-foreground
            min-h-[1.5rem]
            dark:text-white
        "
        >
          {name || "\u00A0"}
        </h3>
        <p
          className="
            line-clamp-2 
            text-[15px] 
            text-muted-foreground
            min-h-[2.5rem]
            dark:text-neutral-400
        "
        >
          {description || "\u00A0"}
        </p>
        <div className="space-y-1">
          <div
            className="
                flex items-center gap-2 
                text-sm 
                text-muted-foreground
                min-h-[1.25rem]
                dark:text-neutral-400
            "
          >
            <MapPin
              className="
                    h-4 w-4 
                    shrink-0 
                    text-primary
                    dark:text-primary
                "
            />
            <span className="min-w-0 flex-1 truncate text-[15px] text-primary dark:text-primary" title={displayLocation}>{displayLocation || "\u00A0"}</span>
            {distanceLabel && (
              <span className="shrink-0 whitespace-nowrap text-xs font-medium text-primary">
                {t("common.distanceAway", { distance: distanceLabel })}
              </span>
            )}
          </div>
          <div
            className="
                  flex items-center gap-2 
                  text-sm 
                  text-muted-foreground
                  min-h-[1.25rem]
                  dark:text-neutral-400
              "
          >
            <Clock
              className={`
                      h-4 w-4 
                      shrink-0 
                      text-primary
                      dark:text-primary
                      ${displayHours ? "" : "invisible"}
                  `}
            />
            <span className={displayHours ? "" : "invisible"}>
              {displayHours || "placeholder"}
            </span>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
