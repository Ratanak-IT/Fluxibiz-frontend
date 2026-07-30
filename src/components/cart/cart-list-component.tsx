"use client";

import { useGetCartQuery } from "@/features/cart/cartApi";
import StoreGroupComponent from "./store-group-component";
import EmptyCartComponent from "./empty-cart-component";
import CartSkeletonComponent from "./cart-skeleton-component";


export default function CartList() {
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

    return (
        <div className="flex flex-col gap-12">
            {cart.storeCount > 1 && (
                <p className="-mt-8 text-sm text-neutral-500 dark:text-muted-foreground">
                    {cart.storeCount} shops · you pay one shop at a time
                </p>
            )}

            {cart.stores.map((store, index) => (
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