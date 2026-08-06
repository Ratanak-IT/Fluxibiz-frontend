"use client";

import { useTranslations } from "next-intl";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { useGetActiveCheckoutQuery } from "@/features/checkout/checkoutApi";
import { formatMoney, type StoreCart } from "@/lib/type/cartType";

export default function OrderSummaryComponent({ store }: { store: StoreCart }) {
  const t = useTranslations("Cart");
    const discount = 0;
    const total = Math.max(0, store.subtotal - discount);

    const { data: active } = useGetActiveCheckoutQuery();

    const pending = active?.hasPendingCheckout ? active.checkout : null;
    const pendingElsewhere = pending && pending.storeSlug !== store.slug ? pending : null;
    const pendingHere = pending?.storeSlug === store.slug;

    return (
        <Card className="w-full bg-gray-100 p-4 lg:w-100 dark:bg-card">
            <CardHeader className="mb-5 p-0">
                <CardTitle className="text-xl font-bold tracking-tight text-neutral-900 dark:text-card-foreground">
                    {t("yourOrder")}
                </CardTitle>

                <p className="text-sm text-neutral-500 dark:text-muted-foreground">
                    {store.name}
                </p>
            </CardHeader>

            <CardContent className="space-y-4 p-0 text-sm text-neutral-600 dark:text-muted-foreground">
                <div className="flex items-center justify-between">
                    <span>{t("itemsLabel")}</span>
                    <span className="font-bold text-neutral-900 dark:text-card-foreground">
                        {store.itemCount}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span>{t("subtotal")}</span>
                    <span className="font-bold text-neutral-900 dark:text-card-foreground">
                        {formatMoney(store.subtotal, store.currency)}
                    </span>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-border">
                    <span>{t("discount")}</span>
                    <span className="font-bold text-neutral-900 dark:text-card-foreground">
                        {formatMoney(discount, store.currency)}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <span className="text-base font-bold text-neutral-900 dark:text-card-foreground">
                        Total
                    </span>

                    <span className="text-2xl font-bold text-green-600 dark:text-primary">
                        {formatMoney(total, store.currency)}
                    </span>
                </div>
            </CardContent>

            <CardFooter className="mt-6 flex-col gap-3 p-0">
                {!store.open ? (
                    <Button
                        disabled
                        className="h-12 w-full rounded-full bg-neutral-300 text-base font-semibold text-neutral-500"
                    >
                        Shop is closed
                    </Button>
                ) : pendingElsewhere ? (
                    <Button
                        disabled
                        className="h-12 w-full rounded-full bg-neutral-300 text-base font-semibold text-neutral-500"
                    >
                        {t("payingFirst", { storeName: pendingElsewhere.storeName })}
                    </Button>
                ) : (
                    <Link href={`/store/${store.slug}/checkout`} className="w-full">
                        <Button className="h-12 w-full rounded-full bg-green-600 text-base font-semibold text-white transition-colors hover:bg-green-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90">
                            {pendingHere ? t("finishPayment") : t("checkout")}
                        </Button>
                    </Link>
                )}

                {/* <p className="text-center text-xs text-neutral-500 dark:text-muted-foreground">
                    {pendingElsewhere
                        ? `Finish or cancel your payment at ${pendingElsewhere.storeName} to pay ${store.name}.`
                        : `This pays ${store.name} only.`}
                </p> */}
            </CardFooter>
        </Card>
    );
}