"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

import { Card, CardTitle } from "@/components/ui/card";
import { useGetPublicStoreQuery } from "@/features/store-api/store-api";

import type { StoreCardComponentProps } from "./store-cart-component";

const DEFAULT_STORE_IMAGE = "/image/card/defaultstore.png";

const DESCRIPTION_MAX_LENGTH = 18;
const ADDRESS_MAX_LENGTH = 20;

/**
 * Shorten long text and add "..."
 * Array.from() handles Khmer Unicode characters better.
 */
const shortenText = (
  text: string | null | undefined,
  maxLength: number,
): string => {
  if (!text?.trim()) {
    return "No information";
  }

  const trimmedText = text.trim();
  const characters = Array.from(trimmedText);

  if (characters.length <= maxLength) {
    return trimmedText;
  }

  return `${characters.slice(0, maxLength).join("")}...`;
};

const StoreCardHorizontal = ({ store }: StoreCardComponentProps) => {
  const {
    name,
    description,
    location,
    address,
    googleMap,
    image,
    discountLabel,
  } = store;

  const [imgSrc, setImgSrc] = useState(
    image?.trim() ? image : DEFAULT_STORE_IMAGE,
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImgSrc(image?.trim() ? image : DEFAULT_STORE_IMAGE);
  }, [image]);

  const { data: storeDetail } = useGetPublicStoreQuery(
    store.slug || store.id,
    {
      skip: Boolean(address && googleMap),
    },
  );

  const finalAddress =
    storeDetail?.address || address || location || "No location";

  const finalGoogleMap = storeDetail?.googleMap || googleMap;

  const handleOpenMap = () => {
    if (!finalGoogleMap) return;

    window.open(finalGoogleMap as string, "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      className="
        group
        flex
        w-full
        max-w-sm
        cursor-pointer
        flex-row
        items-start
        gap-3
        rounded-xl
        p-2
        text-card-foreground
        transition-all
        duration-200
        ease-out
        hover:scale-[0.99]
        hover:shadow-sm
      "
    >
      {/* Store logo */}
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
        {discountLabel && (
          <div className="absolute left-1 top-1 z-10 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
            {discountLabel}
          </div>
        )}

        <Image
          src={imgSrc}
          alt={name || "Store"}
          fill
          sizes="80px"
          onError={() => setImgSrc(DEFAULT_STORE_IMAGE)}
          className="
            object-cover
            transition-transform
            duration-300
            ease-out
            group-hover:scale-110
          "
        />
      </div>

      {/* Store information */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Store name */}
        <CardTitle
          className="
            truncate
            text-base
            font-semibold
            text-card-foreground
          "
          title={name}
        >
          {name}
        </CardTitle>

        {/* Short description */}
        <p
          className="
            overflow-hidden
            whitespace-nowrap
            text-sm
            text-muted-foreground
          "
          title={description || ""}
        >
          {shortenText(description, DESCRIPTION_MAX_LENGTH)}
        </p>

        {/* Short location */}
        <div className="flex min-w-0 items-center gap-1 text-sm">
          <MapPin className="size-4 shrink-0 text-primary" />

          {finalGoogleMap ? (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleOpenMap();
              }}
              className="
                min-w-0
                overflow-hidden
                whitespace-nowrap
                text-left
                text-primary
                hover:underline
              "
              title={finalAddress}
            >
              {shortenText(finalAddress, ADDRESS_MAX_LENGTH)}
            </button>
          ) : (
            <span
              className="
                min-w-0
                overflow-hidden
                whitespace-nowrap
                text-muted-foreground
              "
              title={finalAddress}
            >
              {shortenText(finalAddress, ADDRESS_MAX_LENGTH)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StoreCardHorizontal;