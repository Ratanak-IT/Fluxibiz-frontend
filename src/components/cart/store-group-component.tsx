"use client";

import { useTranslations } from "next-intl";

import { Trash2 } from "lucide-react";

import { StoreCart } from "@/lib/type/cartType";
import { useGetPublicStoreQuery } from "@/features/store-api/store-api";
import { useRemoveCartStoreMutation } from "@/features/cart/cartApi";
import { Button } from "@/components/ui/button";
import ItemCardComponent from "./item-card-component";
import OrderSummaryComponent from "./order-summary-component";
import { StoreCardComponent } from "./store-card-component";

export default function StoreGroupComponent({ store }: { store: StoreCart }) {
    const t = useTranslations("Cart");
    const [removeStore, { isLoading: isRemoving }] = useRemoveCartStoreMutation();
    const { data: publicStore } = useGetPublicStoreQuery(store.slug, { skip: !store.slug });
    const effectiveCurrency = publicStore?.displayCurrency || publicStore?.baseCurrency || store.currency || "USD";

    return (
        <section aria-label={t("cartForStore", { storeName: store.name })}>
            <StoreCardComponent store={store} />

            <div className="mt-6 flex flex-col items-start gap-8 pt-2 lg:flex-row">
                <div className="flex w-full flex-1 flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-primary/15 dark:text-primary">
                            {store.itemCount} {store.itemCount === 1 ? "item" : "items"}
                        </span>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={isRemoving}
                            onClick={() => removeStore(store.businessId)}
                            className="gap-1.5 whitespace-nowrap text-xs text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 dark:hover:bg-destructive/10"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove shop
                        </Button>
                    </div>

                    {store.items.map((line) => (
                        <ItemCardComponent
                            key={line.cartItemId}
                            line={line}
                            currency={effectiveCurrency}

                        />
                    ))}
                </div>

                <OrderSummaryComponent store={store} currency={effectiveCurrency} />
            </div>
        </section>
    );
}