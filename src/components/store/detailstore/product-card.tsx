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

/** Matches the product page: the count only earns its place when it is small. */
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

  const imageUrl = item.image?.trim() ? item.image : null;
  const outOfStock = isItemOutOfStock(item);

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
          "w-full cursor-pointer overflow-hidden border-0 bg-white p-0 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg dark:bg-card relative",
          outOfStock && "opacity-90"
        )}
      >
        <div className="flex h-full min-h-25 sm:min-h-30">
          <div className={cn("flex min-w-0 flex-1 flex-col justify-between p-2.5 pr-2 sm:p-3", outOfStock && "filter blur-[0.5px]")}>
            <CardHeader className="gap-0.5 p-0">
              <CardTitle className="truncate text-sm font-bold text-text sm:text-base dark:text-text">
                {item.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                {item.price === undefined ? (
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {t("detail.priceNotSet")}
                  </p>
                ) : (
                  <p className="text-sm font-bold text-red-500 sm:text-base dark:text-red-400">
                    {formatPrice(Number(item.price), item.currency)}
                  </p>
                )}
                {item.compareAtPrice && Number(item.compareAtPrice) > Number(item.price) && (
                  <p className="text-xs font-medium text-neutral-400 line-through">
                    {formatPrice(Number(item.compareAtPrice), item.currency)}
                  </p>
                )}
              </div>
              <CardDescription className="line-clamp-2 text-[11px] text-neutral-500 sm:text-xs dark:text-neutral-400">
                {item.description}
              </CardDescription>
            </CardHeader>

            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-primary sm:text-xs dark:text-primary">
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

          <div className="relative m-2 aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:m-2.5 sm:w-24 md:w-28 dark:bg-card">
            {outOfStock ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-1 text-center">
                <span className="rounded bg-red-600 px-2 py-1 text-[10px] sm:text-xs font-black text-white uppercase tracking-wide shadow-md border border-red-400">
                  {t("detail.outOfStock") || "Out Stock"}
                </span>
              </div>
            ) : (
              item.badge && (
                <div className="absolute left-0 top-0 z-10 max-w-full truncate whitespace-nowrap rounded-br-lg bg-red-500 px-1.5 py-0.5 text-[8px] font-extrabold text-white shadow-xs sm:text-[10px]">
                  {item.badge}
                </div>
              )
            )}
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={item.name || t("common.productImage")}
                fill
                unoptimized
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
                  "h-6 w-6 rounded-full bg-card text-primary shadow-md hover:bg-card sm:h-7 sm:w-7 dark:bg-text dark:text-primary",
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
                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
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
