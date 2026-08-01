"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff, Loader2, LogIn, Minus, Plus, X } from "lucide-react";

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
  type CartLine,
  type StoreCart,
} from "@/lib/type/cartType";

interface CartSidebarProps {
  slug?: string;
  businessId?: string;
}

export default function CartSidebar({ slug, businessId }: CartSidebarProps) {
  const { isAuthenticated, status: authStatus, login } = useAuth();

  const { data: cart, isLoading, isFetching } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const storeCart: StoreCart | undefined = cart?.stores.find((store) =>
    businessId ? store.businessId === businessId : slug ? store.slug === slug : false,
  );

  const lines = storeCart?.items ?? [];
  const subtotal = storeCart?.subtotal ?? 0;
  const currency = storeCart?.currency ?? "USD";
  const itemCount = storeCart?.itemCount ?? 0;
  const otherShops = (cart?.storeCount ?? 0) - (storeCart ? 1 : 0);

  const loading = authStatus === "loading" || (isAuthenticated && isLoading);
  const canCheckout = lines.length > 0 && Boolean(slug);

  return (
    <Card className="w-full gap-0 rounded-2xl border-neutral-100 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-card">
      <CardContent className="space-y-4 p-0">
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-neutral-900 dark:text-neutral-50">
            Your Order
          </p>
          {itemCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Loading your cart...</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="flex flex-col items-center py-8 text-center">
            <p className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
              Hungry?
            </p>
            <p className="mt-2 max-w-55 text-sm text-neutral-500 dark:text-neutral-400">
              Sign in to start adding items to your cart!
            </p>
            <Button onClick={login} className="mt-4 rounded-full" size="sm">
              <LogIn className="mr-1.5 h-4 w-4" />
              Sign in
            </Button>
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <p className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
              Hungry?
            </p>
            <p className="mt-2 max-w-55 text-sm text-neutral-500 dark:text-neutral-400">
              You haven&apos;t added anything to your cart!
            </p>
          </div>
        ) : (
          <div
            className={`max-h-[45vh] space-y-3 overflow-y-auto py-2 pr-1 transition-opacity ${
              isFetching ? "opacity-60" : "opacity-100"
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
            <span className="text-neutral-500 dark:text-neutral-400">Total</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-50">
              {formatMoney(subtotal, currency)}
            </span>
          </div>

          {otherShops > 0 && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {otherShops} other {otherShops === 1 ? "shop" : "shops"} in your cart
            </p>
          )}

          <Link
            href={slug ? `/cart?shop=${encodeURIComponent(slug)}` : "/cart"}
            className="inline-block text-sm font-medium text-primary hover:underline"
          >
            See Summary
          </Link>

          {canCheckout ? (
            <Link
              href={`/store/${slug}/checkout`}
              className="flex h-9 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Review Payment
            </Link>
          ) : (
            <Button
              className="w-full rounded-full bg-primary"
              variant="secondary"
              disabled
            >
              Review Payment
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
  const [updateItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();

  const busy = isUpdating || isRemoving;
  const imageUrl = resolveMediaUrl(line.imageUrl);

  const decrease = () => {
    if (line.quantity <= 1) {
      removeItem(line.cartItemId);
    } else {
      updateItem({ cartItemId: line.cartItemId, quantity: line.quantity - 1 });
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-2 dark:bg-muted/40">
      <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-card">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={line.name}
            fill
            unoptimized
            sizes="52px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-4 w-4 text-neutral-300" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-50">
          {line.name}
        </p>

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
            aria-label={`Decrease ${line.name}`}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-40 dark:text-neutral-300 dark:hover:bg-card"
          >
            <Minus className="h-3 w-3" />
          </button>

          <span className="w-4 text-center text-xs font-semibold tabular-nums">
            {line.quantity}
          </span>

          <button
            type="button"
            onClick={() =>
              updateItem({ cartItemId: line.cartItemId, quantity: line.quantity + 1 })
            }
            disabled={busy}
            aria-label={`Increase ${line.name}`}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-primary transition-colors hover:bg-primary/10 disabled:opacity-40"
          >
            <Plus className="h-3 w-3" />
          </button>

          <span className="ml-auto text-sm font-semibold text-red-500 dark:text-destructive">
            {formatMoney(line.subtotal, currency)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => removeItem(line.cartItemId)}
        disabled={busy}
        aria-label={`Remove ${line.name}`}
        className="shrink-0 self-start text-neutral-400 transition-colors hover:text-red-500 disabled:opacity-40"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}