"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageOff, Plus } from "lucide-react";
import Image from "next/image";
import { MenuItemData, isItemOutOfStock } from "@/lib/store/detailstore/detailstore";

const LOW_STOCK_THRESHOLD = 10;
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { formatPrice } from "@/lib/store/productdetail/product";
import ProductQuickViewModal from "./product-view-modal";
import { cn } from "@/lib/utils";

interface MenuProductCardProps {
  item: MenuItemData;
}

export function MenuProductCard({ item }: MenuProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const storeSlug = (params?.slug as string) || "";
  const t = useTranslations("Store");

  // A link that 404s leaves the browser rendering the alt text in the frame,
  // which reads as a caption rather than a missing picture. Once it has
  // failed there is nothing to show, so the frame falls back to the same
  // placeholder an item with no picture at all gets.
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = item.image?.trim() ? item.image : null;
  const imageUrl = imageFailed ? null : imageSrc;
  const outOfStock = isItemOutOfStock(item);

  // A live promotion is the more urgent thing to say in the one badge slot
  // the card has, so it wins over the label the seller typed on the item.
  // It is the only signal for a storewide promotion, whose amount is worked
  // out once per order and so never shows up in this item's own price.
  const cornerBadge = item.discountLabel?.trim() || item.badge;

  // Shown only when the server actually priced the promotion into `price` —
  // the strikethrough beside it is what it was worth before.
  const compareAt = Number(item.compareAtPrice);
  const priceNow = Number(item.price);
  const isPricedDown =
    item.compareAtPrice !== undefined && compareAt > priceNow && compareAt > 0;
  const percentOff = isPricedDown
    ? Math.round(((compareAt - priceNow) / compareAt) * 100)
    : 0;

  const handleCardClick = () => {
    const itemTarget = item.rawItem?.slug || item.rawItem?.id || item.id;
    if (storeSlug && itemTarget) {
      router.push(`/store/${storeSlug}/product/${itemTarget}`);
    } else {
      setQuickViewOpen(true);
    }
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        className={cn(
          "w-full @container cursor-pointer overflow-hidden border-0 bg-white p-0 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg dark:bg-card relative",
          outOfStock && "opacity-90"
        )}
      >
        <div className="flex h-32 @xs:h-36 items-center justify-between">
          <div className={cn("flex min-w-0 flex-1 flex-col h-full p-2.5 pr-2 @xs:p-3", outOfStock && "filter blur-[0.5px]")}>
            <CardHeader className="gap-1 p-0 min-w-0">
              <CardTitle className="truncate text-[16px] @xs:text-[17px] font-bold text-text dark:text-text">
                {item.name}
              </CardTitle>
              {/* Current price, what it used to cost, and the percent off all
                  read as one line — the eye takes in the whole deal at once
                  instead of hunting a strikethrough on the row below. */}
              <div className="flex flex-wrap items-center gap-1.5">
                {item.price === undefined ? (
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {t("detail.priceNotSet")}
                  </p>
                ) : (
                  /* A span where the options differ — "8,000 ៛ – 10,000 ៛" —
                     since there is no one price such an item is sold at. */
                  <p className="text-sm font-bold text-red-500 sm:text-base dark:text-red-400">
                    {formatPrice(Number(item.price), item.currency)}
                    {item.priceMax
                      ? ` – ${formatPrice(Number(item.priceMax), item.currency)}`
                      : ""}
                  </p>
                )}
                {isPricedDown && (
                  <p className="text-[10px] font-medium text-neutral-400 line-through @xs:text-xs">
                    {formatPrice(compareAt, item.currency)}
                  </p>
                )}
                {isPricedDown && percentOff > 0 && (
                  <span className="rounded bg-red-50 px-1 py-0.5 text-[10px] font-bold text-red-600 @xs:text-xs dark:bg-red-950/50 dark:text-red-400">
                    -{percentOff}%
                  </span>
                )}
              </div>
              {item.description ? (
                <CardDescription className="line-clamp-2 text-[13px] text-neutral-500 dark:text-neutral-400">
                  {item.description}
                </CardDescription>
              ) : null}
            </CardHeader>

            
            <div className="mt-auto flex flex-wrap items-center gap-1.5">
              <span className="text-[13px] font-bold text-primary dark:text-primary">
                {item.category}
              </span>
              {outOfStock ? (
                <span className="text-[11px] font-bold text-red-600 dark:text-red-500">
                  • {t("detail.outOfStock") || "Out of Stock"}
                </span>
              ) : item.remaining !== null &&
                item.remaining !== undefined &&
                item.remaining <= LOW_STOCK_THRESHOLD ? (
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  • {t("detail.countLeft", { count: item.remaining })}
                </span>
              ) : null}
            </div>
          </div>

          <div className="relative m-2 aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100 @xs:m-2.5 @xs:w-24 @sm:w-28 dark:bg-card">
            {outOfStock ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-1 text-center">
                <span className="rounded bg-red-600 px-2 py-1 text-[10px] @xs:text-xs font-black text-white uppercase tracking-wide shadow-md border border-red-400">
                  {t("detail.outOfStock") || "Out Stock"}
                </span>
              </div>
            ) : (
              cornerBadge && (
                <div className="absolute left-0 top-0 z-10 max-w-full truncate whitespace-nowrap rounded-br-lg bg-red-500 px-1.5 py-0.5 text-[8px] font-extrabold text-white shadow-xs @xs:text-[10px]">
                  {cornerBadge}
                </div>
              )
            )}
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={item.name || t("common.productImage")}
                fill
                unoptimized
                onError={() => setImageFailed(true)}
                sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
                className={cn("h-full w-full object-cover transition-all", outOfStock && "filter blur-[3px]")}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageOff className="h-5 w-5 text-neutral-300" />
              </div>
            )}

            <div className="absolute bottom-1 right-1 z-30">
              <Button
                type="button"
                size="icon"
                variant="secondary"
                disabled={outOfStock}
                className={cn(
                  "h-6 w-6 rounded-full bg-card text-primary shadow-md hover:bg-card @xs:h-7 @xs:w-7 dark:bg-text dark:text-primary",
                  outOfStock && "opacity-50 cursor-not-allowed bg-neutral-200 text-neutral-400 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-500"
                )}
                aria-label={t("detail.addToCartAria", { name: item.name })}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!outOfStock) {
                    setQuickViewOpen(true);
                  }
                }}
              >
                <Plus className="h-3 w-3 @xs:h-3.5 @xs:w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <ProductQuickViewModal
        productId={item.id}
        item={item}
        rawItem={item.rawItem}
        currency={item.currency}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
}
