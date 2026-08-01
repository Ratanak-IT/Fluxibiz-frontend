"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Store } from "lucide-react";

import { useGetCartQuery } from "@/features/cart/cartApi";
import StoreGroupComponent from "./store-group-component";
import EmptyCartComponent from "./empty-cart-component";
import CartSkeletonComponent from "./cart-skeleton-component";

export default function CartList({ shopSlug }: { shopSlug?: string } = {}) {
    const searchParams = useSearchParams();
    const slug = shopSlug ?? searchParams.get("shop");

    const { data: cart, isLoading, isError } = useGetCartQuery();

    if (isLoading) {
        return <CartSkeletonComponent />;
    }

    if (isError) {
        return (
            <div className="rounded-2xl bg-gray-100 py-16 text-center dark:bg-card">
                <p className="text-sm text-destructive">
                    Could not load your cart. Please refresh the page.
                </p>
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
                    No items from this shop
                </p>

                {cart.storeCount > 0 && (
                    <Link
                        href="/cart"
                        className="mt-4 inline-block text-sm font-medium text-green-600 hover:underline"
                    >
                        See your other shops ({cart.storeCount})
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