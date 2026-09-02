"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ImageOff, Loader2, LogIn, Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/features/cart/cartApi";
import { useAuth } from "@/features/auth/useAuth";
import {
  formatMoney,
  resolveMediaUrl,
  isCartLineOutOfStock,
  isCartLineAtStockCeiling,
  getCartLineStock,
  apiErrorMessage,
  formatStockErrorMessage,
  extractCartLinePrices,
  cartTotals,
  type CartLine,
  type StoreCart,
} from "@/lib/type/cartType";
import { markItemOutOfStock } from "@/lib/store/detailstore/detailstore";
import { cn } from "@/lib/utils";
import { useMiniAppMode } from "@/lib/tma/useMiniAppMode";

interface CartSidebarProps {
  slug?: string;
  businessId?: string;
  storeCurrency?: string;
}

export default function CartSidebar({ slug, businessId, storeCurrency }: CartSidebarProps) {
  const t = useTranslations("Cart");
  const { isMiniApp, queryParam } = useMiniAppMode();
  const { isAuthenticated, status: authStatus, login } = useAuth();

  const { data: cart, isLoading, isFetching } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const storeCart: StoreCart | undefined = cart?.stores.find((store) =>
    businessId ? store.businessId === businessId : slug ? store.slug === slug : false,
  );

  const lines = useMemo(() => storeCart?.items ?? [], [storeCart?.items]);

  // `storeCart.subtotal` is the server's own net total — the one figure
  // that always accounts for an order-wide promotion, which no single line
  // carries a share of on the wire. Re-summing the lines' own subtotals (as
  // this used to) silently drops that discount and overcharges.
  const { original: originalSubtotal, discount, net: effectiveSubtotal } = useMemo(
    () => cartTotals(storeCart ?? { subtotal: 0, items: [] }),
    [storeCart],
  );

  const currency = storeCurrency || storeCart?.currency || "USD";
  const itemCount = storeCart?.itemCount ?? 0;
  const otherShops = (cart?.storeCount ?? 0) - (storeCart ? 1 : 0);

  const loading = authStatus === "loading" || (isAuthenticated && isLoading);
  const canCheckout = lines.length > 0 && Boolean(slug);

  return (
    <Card className="w-full gap-0 rounded-2xl border-neutral-100 bg-white p-5 pb-7 shadow-xs sm:p-6 sm:pb-8 dark:border-neutral-800 dark:bg-card">
      <CardContent className="space-y-4 p-0">
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-neutral-900 dark:text-neutral-50">
            {t("yourOrder")}
          </p>
          {itemCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {t("itemCount", { count: itemCount })}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{t("loadingCart")}</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="flex flex-col items-center py-8 text-center">
            <p className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
              {t("hungry")}
            </p>
            <p className="mt-2 max-w-55 text-sm text-neutral-500 dark:text-neutral-400">
              {t("signInPrompt")}
            </p>
            <Button onClick={login} className="mt-4 rounded-full bg-primary text-white hover:bg-primary/90" size="sm">
              <LogIn className="mr-1.5 h-4 w-4" />
              {t("signIn")}
            </Button>
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <p className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
              {t("hungry")}
            </p>
            <p className="mt-2 max-w-55 text-sm text-neutral-500 dark:text-neutral-400">
              {t("emptySidebar")}
            </p>
          </div>
        ) : (
          <div
            className={`max-h-[45vh] space-y-3 overflow-y-auto py-2 pr-1 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"
              }`}
          >
            {lines.map((line) => (
              <CartSidebarLine key={line.cartItemId} line={line} currency={currency} />
            ))}
          </div>
        )}

        <Separator />

        {/* Summary + checkout */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">{t("total")}</span>
            <div className="flex items-baseline gap-1.5">
              {discount > 0 && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatMoney(originalSubtotal, currency)}
                </span>
              )}
              <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                {formatMoney(effectiveSubtotal, currency)}
              </span>
            </div>
          </div>

          {otherShops > 0 && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t("otherShopsInCart", { count: otherShops })}
            </p>
          )}

          <Link
            href={
              isMiniApp && slug
                ? `/store/${slug}/cart?${queryParam}`
                : slug
                  ? `/cart?shop=${encodeURIComponent(slug)}`
                  : "/cart"
            }
            className="inline-block text-sm font-medium text-primary hover:underline"
          >
            {t("seeSummary")}
          </Link>

          {canCheckout ? (
            <Link
              href={isMiniApp ? `/store/${slug}/checkout?${queryParam}` : `/store/${slug}/checkout`}
              className="flex h-12 w-full items-center justify-center rounded-full bg-primary text-base font-bold text-white transition-colors hover:bg-primary/90"
            >
              {t("reviewPayment")}
            </Link>
          ) : (
            <Button
              className="h-12 w-full rounded-full bg-primary text-base font-bold text-white disabled:opacity-50"
              disabled
            >
              {t("reviewPayment")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CartSidebarLine({
  line,
  currency,
}: {
  line: CartLine;
  currency: string;
}) {
  const t = useTranslations("Cart");
  const rootT = useTranslations();
  const [updateItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();

  const busy = isUpdating || isRemoving;
  // A link that 404s leaves the alt text sitting in the frame like a caption;
  // the placeholder says "no picture" far more clearly.
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = imageFailed ? null : resolveMediaUrl(line.imageUrl);
  const outOfStock = isCartLineOutOfStock(line);
  const atStockCeiling = isCartLineAtStockCeiling(line);
  const stockLimit = getCartLineStock(line);

  const decrease = () => {
    if (line.quantity <= 1) {
      removeItem(line.cartItemId)
        .unwrap()
        .then(() =>
          toast.info(rootT("Store.messages.removedFromCart", { name: line.name })),
        )
        .catch((err: any) => {
          toast.error(apiErrorMessage(err, "Failed to remove item"));
        });
    } else {
      const nextQty = line.quantity - 1;
      updateItem({ cartItemId: line.cartItemId, quantity: nextQty })
        .unwrap()
        .catch((err: any) => {
          toast.error(apiErrorMessage(err, "Failed to update item"));
        });
    }
  };

  const increase = () => {
    if (atStockCeiling && stockLimit !== null) {
      toast.error(`Only ${stockLimit} item(s) available in stock`);
      return;
    }
    const nextQty = line.quantity + 1;
    updateItem({ cartItemId: line.cartItemId, quantity: nextQty })
      .unwrap()
      .catch((err: any) => {
        const msg = formatStockErrorMessage(err, line.name);
        const lower = msg.toLowerCase();
        if (
          lower.includes("stock") ||
          lower.includes("enough") ||
          lower.includes("negative") ||
          lower.includes("unavailable")
        ) {
          if (line.itemId) markItemOutOfStock(line.itemId);
        }
        toast.error(msg);
      });
  };

  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const productHref = slug && line.itemId ? `/store/${slug}/product/${line.itemId}` : null;

  const handleNavigate = () => {
    if (productHref) {
      router.push(productHref);
    }
  };

  const { hasDiscount, compareAtSubtotal, subtotal: currentSubtotal } = extractCartLinePrices(line);

  return (
    <div className={cn("flex w-full items-center gap-3 rounded-xl bg-neutral-50 p-2.5 dark:bg-muted/40 relative", outOfStock && "opacity-90")}>
      <div
        onClick={handleNavigate}
        className={cn("relative h-13 w-13 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-card", productHref && "cursor-pointer")}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={line.name}
            fill
            unoptimized
            onError={() => setImageFailed(true)}
            sizes="52px"
            className={cn("object-cover", outOfStock && "filter blur-[1.5px]")}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-4 w-4 text-neutral-300" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div onClick={handleNavigate} className={cn("flex items-center gap-1.5", productHref && "cursor-pointer")}>
          <p className={cn("truncate text-sm font-semibold text-neutral-900 dark:text-neutral-50", productHref && "hover:underline")}>
            {line.name}
          </p>
          {outOfStock && (
            <span className="text-[10px] font-bold text-red-600 dark:text-red-500 shrink-0">
              • {rootT("Store.detail.outOfStock") || "Out of Stock"}
            </span>
          )}
        </div>

        {line.badges.length > 0 && (
          <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
            {line.badges.join(" · ")}
          </p>
        )}

        <div className="mt-1 flex items-center gap-2">
          <button
            type="button"
            onClick={decrease}
            disabled={busy}
            aria-label={t("decreaseQuantity")}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-red-200 dark:border-red-900/40 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-40 disabled:pointer-events-auto disabled:cursor-not-allowed cursor-pointer"
          >
            <Minus className="h-3 w-3 text-red-500" />
          </button>

          <span className="w-4 text-center text-xs font-semibold tabular-nums">
            {line.quantity}
          </span>

          <button
            type="button"
            onClick={increase}
            disabled={busy || outOfStock || atStockCeiling}
            aria-label={t("increaseQuantity")}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-green-200 dark:border-green-900/40 text-[#00932A] transition-colors hover:bg-green-50 dark:hover:bg-green-950/40 disabled:opacity-40 disabled:pointer-events-auto disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="h-3 w-3 text-[#00932A]" />
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            {hasDiscount && (
              <span className="text-[11px] text-neutral-400 line-through">
                {formatMoney(compareAtSubtotal, currency)}
              </span>
            )}
            <span className="text-sm font-semibold text-red-500 dark:text-destructive">
              {formatMoney(currentSubtotal, currency)}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          removeItem(line.cartItemId).unwrap().then(() =>
            toast.info(rootT("Store.messages.removedFromCart", { name: line.name })),
          )
        }
        disabled={busy}
        aria-label={t("removeItem", { name: line.name })}
        className="shrink-0 self-start text-neutral-400 transition-colors hover:text-red-500 disabled:opacity-40"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
