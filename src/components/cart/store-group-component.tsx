"use client";

import { useTranslations } from "next-intl";

import { StoreCart } from "@/lib/type/cartType";
import ItemCardComponent from "./item-card-component";
import OrderSummaryComponent from "./order-summary-component";
import { StoreCardComponent } from "./store-card-component";

export default function StoreGroupComponent({ store }: { store: StoreCart }) {
  const t = useTranslations("Cart");
    return (
        <section aria-label={t("cartForStore", { storeName: store.name })}>
            <StoreCardComponent store={store} />

            <div className="mt-6 flex flex-col items-start gap-8 pt-2 lg:flex-row">
                <div className="flex w-full flex-1 flex-col gap-4">
                    {store.items.map((line) => (
                        <ItemCardComponent
                            key={line.cartItemId}
                            line={line}
                            currency={store.currency}
                        />
                    ))}
                </div>

                <OrderSummaryComponent store={store} />
            </div>
        </section>
    );
}