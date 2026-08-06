"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { StoreCardComponentProps } from "./store-cart-component";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useGetPublicStoreQuery } from "@/features/store-api/store-api";

const DEFAULT_STORE_IMAGE = "/image/card/defaultstore.png";

const StoreCardHorizontal = ({ store }: StoreCardComponentProps) => {
  const { name, description, location, address, googleMap, image, isOpen } = store;
  const [imgSrc, setImgSrc] = useState<string>(
    image && image.trim() ? image : DEFAULT_STORE_IMAGE
  );

  useEffect(() => {
    setImgSrc(image && image.trim() ? image : DEFAULT_STORE_IMAGE);
  }, [image]);

  const { data: storeDetail } = useGetPublicStoreQuery(store.slug || store.id, {
    skip: !!address && !!googleMap,
  });

  const finalAddress = storeDetail?.address || address || location;
  const finalGoogleMap = storeDetail?.googleMap || googleMap;

  return (
    <Card
      className="
        group max-w-sm 
        cursor-pointer 
        flex-row items-start 
        gap-3 
        p-2
        rounded-xl
        text-card-foreground

        hover:duration-100 hover:shadow-sm  hover:scale-99 ease-out transition-transform
    "
    >
      {/* Logo */}

      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
  {store.discountLabel && (
    <div className="absolute top-1 left-1 z-10 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
      {store.discountLabel}
    </div>
  )}

  <Image
    src={imgSrc}
    alt={name}
    fill
    sizes="80px"
    onError={() => setImgSrc(DEFAULT_STORE_IMAGE)}
    className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
  />
</div>

      {/* Content */}

      <div
        className="
            flex min-w-0 
            flex-col 
            gap-1
        "
      >
        <div className="flex items-center">
          <CardTitle
            className="
                    truncate 
                    text-base 
                    font-semibold
                    text-card-foreground
                "
          >
            {name}
          </CardTitle>

          <span
            className={cn(
              `ml-auto 
                    size-2 
                    shrink-0 
                    self-center 
                    rounded-full
                    `,
              isOpen ? "bg-primary" : "bg-muted-foreground",
            )}
          />
        </div>

        <div
          className="
                line-clamp-1 
                truncate 
                text-sm 
                text-muted-foreground"
        >
          {description}
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
          {finalGoogleMap ? (
            <span
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(finalGoogleMap, "_blank");
              }}
              className="truncate text-primary hover:underline cursor-pointer"
              title={finalAddress || location}
            >
              {finalAddress || location}
            </span>
          ) : (
            <span className="truncate" title={finalAddress || location}>
              {finalAddress || location}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StoreCardHorizontal;