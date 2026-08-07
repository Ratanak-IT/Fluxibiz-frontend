"use client";

import { CardContent } from "@/components/ui/card";
import { Clock, MapPin, Store as StoreIcon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useGetPublicStoreQuery } from "@/features/store-api/store-api";
import type { Store } from "@/lib/type/storeType";

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
  } = store;

  const { data: storeDetail } = useGetPublicStoreQuery(
    store.slug || store.id,
    {
      skip: Boolean(address),
    }
  );

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
        w-65 cursor-pointer p-2
        overflow-hidden  rounded-lg duration-100 hover:duration-100 hover:shadow-sm  hover:scale-98 ease-out transition-transform
      
    "
    >

      <div className="relative grow h-38 w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
        {image && !hasError ? (
          <Image
            src={image}
            unoptimized
            fill
            alt={name || t("common.storeLogo")}
            onError={() => setHasError(true)}
            sizes="(max-width: 768px) 50vw, 272px"
            className="object-cover"
          />
        ) : (
          <StoreIcon className="h-12 w-12 text-muted-foreground" />
        )}


        {discountLabel && (
          <div
            className="
              absolute top-2 left-2 
              z-10 flex flex-col 
              h-12 w-12 
              items-center justify-center 
              text-center leading-none 
              rounded-full
              text-foreground
              border-2 border-dashed 
              border-input
              bg-accent shadow-xs p-0.5
            "
          >
            {discountLabel.includes(" ") ? (
              discountLabel.split(" ").map((part, idx) => (
                <span
                  key={idx}
                  className={
                    idx === 0
                      ? "text-[11px] font-extrabold leading-tight tracking-tight"
                      : "text-[9px] font-bold opacity-90 leading-tight uppercase"
                  }
                >
                  {part}
                </span>
              ))
            ) : (
              <span className="text-[11px] font-extrabold leading-tight">
                {discountLabel}
              </span>
            )}
          </div>
        )}


        <div
          className={`
                absolute top-2 right-2 
                z-10 rounded-full 
                px-3 py-1 

                text-xs font-semibold
                text-primary-foreground

                ${isOpen ? "bg-primary" : "bg-muted"}
            `}
        >
          {isOpen ? t("common.open") : t("common.closed")}
        </div>
      </div>


      <CardContent className="space-y-1 p-1">
        <h3
          className="
                text-lg font-semibold 
                leading-tight 
                text-foreground
            "
        >
          {name}
        </h3>

        <p
          className="
                line-clamp-1 
                text-sm 
                text-muted-foreground
            "
        >
          {description}
        </p>

        <div className="space-y-1">
          <div
            className="
                    flex items-center gap-2 
                    text-sm 
                    text-muted-foreground
                "
          >
            <MapPin
              className="
                        h-4 w-4 
                        shrink-0 
                        text-primary
                    "
            />

            <span className="line-clamp-1">{displayLocation}</span>
          </div>

          {displayHours && (
            <div
              className="
                      flex items-center gap-2 
                      text-sm 
                      text-muted-foreground
                  "
            >
              <Clock
                className="
                          h-4 w-4 
                          shrink-0 
                          text-primary
                      "
              />
              <span>{displayHours}</span>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
}
