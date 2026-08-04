"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { StoreCardComponentProps } from "./store-cart-component";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const DEFAULT_STORE_IMAGE = "/image/card/defaultstore.png";

const StoreCardHorizontal = ({ store }: StoreCardComponentProps) => {
  const { name, description, location, image, isOpen } = store;
  const [imgSrc, setImgSrc] = useState<string>(
    image && image.trim() ? image : DEFAULT_STORE_IMAGE
  );

  useEffect(() => {
    setImgSrc(image && image.trim() ? image : DEFAULT_STORE_IMAGE);
  }, [image]);

  return (
  <Card
  className="
    group
    w-full
    max-w-full
    cursor-pointer
    flex-row items-start
    gap-3
    rounded-xl
    p-2.5
    text-card-foreground

    sm:max-w-sm
    sm:p-2

    hover:scale-99 hover:shadow-sm hover:duration-100
    ease-out transition-transform
  "
>
  {/* Logo */}
  <div
    className="
      relative
      size-16
      shrink-0
      overflow-hidden
      rounded-xl

      sm:size-20
    "
  >
    {store.discountLabel && (
      <div className="absolute top-1 left-1 z-10 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
        {store.discountLabel}
      </div>
    )}

    <Image
      src={imgSrc}
      alt={name}
      fill
      sizes="(max-width: 640px) 64px, 80px"
      onError={() => setImgSrc(DEFAULT_STORE_IMAGE)}
      className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
    />
  </div>

  {/* Content */}
  <div
    className="
      flex min-w-0
      flex-1
      flex-col
      gap-1
    "
  >
    <div className="flex items-center">
      <CardTitle
        className="
          truncate
          text-sm
          font-semibold
          text-card-foreground

          sm:text-base
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
        text-xs
        text-muted-foreground

        sm:text-sm
      "
    >
      {description}
    </div>

    <div className="flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
      <MapPin className="h-4 w-4 shrink-0 text-primary" />
      <span className="truncate">{location}</span>
    </div>
  </div>
</Card>
  );
};

export default StoreCardHorizontal;
