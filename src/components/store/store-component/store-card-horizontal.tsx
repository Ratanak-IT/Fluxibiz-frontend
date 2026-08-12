"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
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
  fallback: string,
): string => {
  if (!text?.trim()) {
    return fallback;
  }

  const trimmedText = text.trim();
  const characters = Array.from(trimmedText);

  if (characters.length <= maxLength) {
    return trimmedText;
  }

  return `${characters.slice(0, maxLength).join("")}...`;
};

const StoreCardHorizontal = ({ store }: StoreCardComponentProps) => {
  const t = useTranslations("Store.common");
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
    storeDetail?.address || address || location || t("noLocation");

  const finalGoogleMap = storeDetail?.googleMap || googleMap;

  const handleOpenMap = () => {
    if (!finalGoogleMap) return;

    window.open(finalGoogleMap as string, "_blank", "noopener,noreferrer");
  };

  return (
   <Card
  className="
    bg-white
    group
    flex
    w-full
    max-w-sm
    cursor-pointer
    flex-row
    items-start
    gap-3
    rounded-2xl
    p-2.5
    mt-3
    text-card-foreground
    shadow-sm
    transition-all
    duration-200
    ease-out
    hover:scale-[0.99]
    hover:shadow-md
    dark:bg-muted
    dark:shadow-sm
    dark:shadow-black/40
    dark:hover:shadow-sm
    dark:hover:shadow-black/50
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
      alt={name || t("storeLogo")}
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
        dark:text-white
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
        dark:text-neutral-400
      "
      title={description || ""}
    >
      {shortenText(description, DESCRIPTION_MAX_LENGTH, t("noInformation"))}
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
            dark:text-primary
          "
          title={finalAddress}
        >
          {shortenText(finalAddress, ADDRESS_MAX_LENGTH, t("noLocation"))}
        </button>
      ) : (
        <span
          className="
            min-w-0
            overflow-hidden
            whitespace-nowrap
            text-muted-foreground
            dark:text-neutral-400
          "
          title={finalAddress}
        >
          {shortenText(finalAddress, ADDRESS_MAX_LENGTH, t("noLocation"))}
        </span>
      )}
    </div>
  </div>
</Card>
  );
};

export default StoreCardHorizontal;
