"use client";

import { useTranslations } from "next-intl";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Store } from "lucide-react";

import { useGetCartQuery } from "@/features/cart/cartApi";
import { useAuth } from "@/features/auth/useAuth";
import StoreGroupComponent from "./store-group-component";
import EmptyCartComponent from "./empty-cart-component";
import CartSkeletonComponent from "./cart-skeleton-component";

export default function CartList({ shopSlug }: { shopSlug?: string } = {}) {
  const t = useTranslations("Cart");
    const searchParams = useSearchParams();
    const slug = shopSlug ?? searchParams.get("shop");

    const { status: authStatus, isAuthenticated } = useAuth();

    const { data: cart, isLoading, isError, error } = useGetCartQuery(undefined, {
        // Don't fire until we know the real auth state. While AuthProvider's
        // session fetch is still in flight (authStatus === "loading"), skip
        // entirely instead of firing an unauthenticated request that would
        // 401 and get stuck cached as an error forever.
        skip: authStatus === "loading" || !isAuthenticated,
    });

    // Auth itself still resolving, or user genuinely not logged in and about
    // to be redirected — show the skeleton instead of a scary error.
    if (authStatus === "loading" || !isAuthenticated) {
        return <CartSkeletonComponent />;
    }

    if (isLoading) {
        return <CartSkeletonComponent />;
    }

    if (isError) {
        // TEMP DEBUG: remove this console.error once the root cause is confirmed.
        // Shows the real HTTP status + body instead of the generic message below.
        console.error("[CartList] getCart failed:", error);

        return (
            <div className="rounded-2xl bg-gray-100 py-16 text-center dark:bg-card">
                <p className="text-sm text-destructive">
                    Could not load your cart. Please refresh the page.
                </p>
                {process.env.NODE_ENV !== "production" && (
                    <pre className="mx-auto mt-3 max-w-md overflow-auto text-left text-xs text-neutral-500">
                        {JSON.stringify(error, null, 2)}
                    </pre>
                )}
            </div>
        );
    }

    if (!cart || cart.stores.length === 0) {
        return <EmptyCartComponent />;
    }

    const scoped = slug ? cart.stores.find((store) => store.slug === slug) : null;

    if (slug && !scoped) {
        return (
            <div className="rounded-2xl bg-gray-100 py-16 text-center dark:bg-card">
                <Store className="mx-auto h-8 w-8 text-neutral-300 dark:text-muted-foreground" />

                <p className="mt-3 text-base font-medium text-neutral-700 dark:text-card-foreground">
                    {t("noItemsFromShop")}
                </p>

                {cart.storeCount > 0 && (
                    <Link
                        href="/cart"
                        className="mt-4 inline-block text-sm font-medium text-green-600 hover:underline"
                    >
                        {t("seeOtherShops")} ({cart.storeCount})
                    </Link>
                )}
            </div>
        );
    }

    const stores = scoped ? [scoped] : cart.stores;
    const otherShops = scoped ? cart.storeCount - 1 : 0;

    return (
        <div className="flex flex-col gap-12">
            {scoped ? (
                otherShops > 0 && (
                    <p className="-mt-8 text-sm text-neutral-500 dark:text-muted-foreground">
                        Paying {scoped.name} ·{" "}
                        <Link href="/cart" className="text-green-600 hover:underline">
                            {otherShops} other {otherShops === 1 ? "shop" : "shops"} in your cart
                        </Link>
                    </p>
                )
            ) : (
                cart.storeCount > 1 && (
                    <p className="-mt-8 text-sm text-neutral-500 dark:text-muted-foreground">
                        {cart.storeCount} shops · you pay one shop at a time
                    </p>
                )
            )}

            {stores.map((store, index) => (
                <div key={store.businessId}>
                    {index > 0 && (
                        <div className="mb-12 border-t border-neutral-200 dark:border-border" />
                    )}

                    <StoreGroupComponent store={store} />
                </div>
            ))}
        </div>
    );
}