import { useTranslations } from "next-intl";
// product-card.tsx
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import { Products, formatPrice } from "@/lib/store/productdetail/product";
import { isItemOutOfStock } from "@/lib/store/detailstore/detailstore";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  item: Products;
}

export function ProductCard({ item }: ProductCardProps) {
  const t = useTranslations("Store.detail");
  const outOfStock = isItemOutOfStock(item);

  return (
    <Card
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border-0 bg-card p-5 shadow-sm sm:max-w-143 sm:h-41.25 lg:h-41.25 lg:w-143",
        outOfStock && "opacity-90"
      )}>
      <div className="flex h-full items-center justify-between gap-4">
        {/* Left Column: Details */}
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col justify-between space-y-1.5",
            outOfStock && "filter blur-[0.5px]"
          )}>

          <CardHeader className="p-0">

            <CardTitle
              className="
                truncate 
                text-[17px] font-bold 
                text-foreground" >
              {item.name}
            </CardTitle>
            <p
              className=" text-2xl font-bold 
                text-destructive sm:text-lg" >
              {formatPrice(item.price, item.currency)}
            </p>

            <CardDescription
              className="
                line-clamp-2 
                text-[14px] 
                text-muted-foreground" >
              {item.description}
            </CardDescription>

          </CardHeader>

          <div className="flex items-center gap-2">
            <span
              className="
                text-[13px] font-semibold 
                text-brand" >
              {item.category}
            </span>
            {outOfStock && (
              <span className="text-xs font-bold text-red-600 dark:text-red-500 sm:text-sm">
                • {t("outOfStock") || "Out of Stock"}
              </span>
            )}
          </div>


        </div>

        <div
          className="
            relative flex 
            h-24 w-20 shrink-0 
            items-center justify-center
            sm:h-28 sm:w-24" >

          {outOfStock && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-black/40 backdrop-blur-[2px] p-1 text-center">
              <span className="rounded bg-red-600 px-2 py-1 text-[10px] sm:text-xs font-black text-white uppercase tracking-wide shadow-md border border-red-400">
                {t("outOfStock") || "Out Stock"}
              </span>
            </div>
          )}

          <Image
            src={item.image}
            alt={item.name}
            width={112}
            height={112}
            className={cn("h-full w-full object-contain transition-all", outOfStock && "filter blur-[3px]")}
          />

          <Button
            type="button"
            size="icon"
            variant="secondary"
            disabled={outOfStock}
            className={cn(
              "absolute -bottom-1 -right-1 z-30 h-7 w-7 rounded-full bg-white text-card-foreground shadow-sm transition-transform hover:scale-105 hover:bg-background sm:h-8 sm:w-8",
              outOfStock && "opacity-50 cursor-not-allowed bg-neutral-200 text-neutral-400 hover:bg-neutral-200"
            )}
            aria-label={t("addToCartAria", { name: item.name })}>
            <Plus
              className=" text-primary
                h-3.5 w-3.5 
                sm:h-4 sm:w-4
              "
            />

          </Button>
        </div>
      </div>
    </Card>
  );
}