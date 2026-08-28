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

import ApiErrorFallback from "@/components/common/api-error-fallback";
import { useMiniAppMode } from "@/lib/tma/useMiniAppMode";

export default function CartList({ shopSlug }: { shopSlug?: string } = {}) {
  const t = useTranslations("Cart");
    const searchParams = useSearchParams();
    const slug = shopSlug ?? searchParams.get("shop");
    const { isMiniApp, queryParam } = useMiniAppMode();

    const { status: authStatus, isAuthenticated } = useAuth();

    const { data: cart, isLoading, isError, error, refetch } = useGetCartQuery(undefined, {
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
        return (
            <ApiErrorFallback
                title={t("couldNotLoad")}
                onRetry={() => refetch()}
                backHref={isMiniApp && slug ? `/store/${slug}?${queryParam}` : isMiniApp ? undefined : "/store"}
            />
        );
    }

    if (!cart || cart.stores.length === 0) {
        return <EmptyCartComponent shopSlug={slug ?? undefined} />;
    }

    const scoped = slug ? cart.stores.find((store) => store.slug === slug) : null;

    if (slug && !scoped) {
        return (
            <div className="rounded-2xl bg-white border border-neutral-100/80 py-16 text-center shadow-xs dark:border-neutral-800 dark:bg-card">
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
        <div className="flex flex-col gap-8">
            {scoped ? (
                otherShops > 0 && (
                    <p className="-mt-1 mb-2 text-sm text-neutral-500 dark:text-muted-foreground sm:mb-4">
                        Paying {scoped.name} ·{" "}
                        <Link href="/cart" className="text-green-600 hover:underline">
                            {otherShops} other {otherShops === 1 ? "shop" : "shops"} in your cart
                        </Link>
                    </p>
                )
            ) : (
                cart.storeCount > 1 && (
                    <p className="-mt-1 mb-2 text-sm text-neutral-500 dark:text-muted-foreground sm:mb-4">
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