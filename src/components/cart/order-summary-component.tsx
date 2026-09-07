"use client";

import { useTranslations } from "next-intl";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { useGetActiveCheckoutQuery } from "@/features/checkout/checkoutApi";
import { useGetPublicStoreQuery } from "@/features/store-api/store-api";
import { cartTotals, computeTax, formatMoney, type StoreCart } from "@/lib/type/cartType";

export default function OrderSummaryComponent({
    store,
    currency,
    exchangeRate: exchangeRateProp,
    storeItems = [],
}: {
    store: StoreCart;
    currency?: string;
    exchangeRate?: number | null;
    storeItems?: any[];
}) {
    const t = useTranslations("Cart");
    const activeCurrency = currency || store.currency;
    const { original: originalSubtotal, discount, net: netAmount } = cartTotals(store);
    const freeItemCount = store.items.reduce((acc, item) => acc + (item.freeQuantity ?? 0), 0);

    // A discount the cart has but no line claims is a storewide one, worked
    // out once against the order. Nothing on the item rows can show it — they
    // each still cost what they cost — so this is the only place the shopper
    // can be told which promotion took the money off.
    const lineAttributed = store.items.reduce((acc, item) => acc + (item.discountAmount ?? 0), 0);
    const isOrderWideDiscount = discount > 0 && lineAttributed === 0;

    const { data: publicStore } = useGetPublicStoreQuery(store.slug, { skip: !store.slug });
    const { taxAmount, total } = computeTax(
        netAmount,
        publicStore?.taxRate,
        publicStore?.taxInclusionType,
        publicStore?.taxEnabled,
    );
    const isTaxInclusive = publicStore?.taxInclusionType === "INCLUSIVE";
    const taxRate = publicStore?.taxRate ?? 0;
    const isTaxActive = Boolean(publicStore?.taxEnabled) && taxAmount > 0;
    const effectiveTaxName = publicStore?.taxLabel?.trim() || "VAT";
    const promotionName = publicStore?.discountLabel?.trim();
    const exchangeRate = exchangeRateProp ?? publicStore?.displayExchangeRate;

    const { data: active } = useGetActiveCheckoutQuery();

    const pending = active?.hasPendingCheckout ? active.checkout : null;
    const pendingElsewhere = pending && pending.storeSlug !== store.slug ? pending : null;
    const pendingHere = pending?.storeSlug === store.slug;

    return (
        <Card className="w-full rounded-2xl bg-white pb-6 border border-neutral-100/80 p-6 sm:p-7 shadow-xs lg:w-100 dark:border-neutral-800 dark:bg-card">
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
                        {formatMoney(originalSubtotal, activeCurrency, exchangeRate)}
                    </span>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-border">
                    <span className="flex items-center gap-1.5">
                        {t("discount")}
                        {/* Named only for a storewide promotion. A line-level
                            one is already named on the row it applies to, and
                            the store's headline promotion may not even be the
                            one that row used. */}
                        {isOrderWideDiscount && promotionName && (
                            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                                {promotionName}
                            </span>
                        )}
                        {freeItemCount > 0 && (
                            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                                {freeItemCount} FREE
                            </span>
                        )}
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-card-foreground">
                        {discount > 0 ? `-${formatMoney(discount, activeCurrency, exchangeRate)}` : formatMoney(0, activeCurrency, exchangeRate)}
                    </span>
                </div>

                {isTaxActive && !isTaxInclusive && (
                    <div className="flex items-center justify-between">
                        <span>
                            {effectiveTaxName} {taxRate > 0 ? `(${taxRate}%)` : ""}
                        </span>
                        <span className="font-bold text-neutral-900 dark:text-card-foreground">
                            +{formatMoney(taxAmount, activeCurrency, exchangeRate)}
                        </span>
                    </div>
                )}

                {isTaxActive && isTaxInclusive && (
                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-muted-foreground">
                        <span>
                            {effectiveTaxName} {taxRate > 0 ? `(${taxRate}% Incl.)` : "(Incl.)"}
                        </span>
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                            {formatMoney(taxAmount, activeCurrency, exchangeRate)}
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between pt-2">
                    <span className="text-base font-bold text-neutral-900 dark:text-card-foreground">
                        Total
                    </span>

                    <span className="text-2xl font-bold text-primary">
                        {formatMoney(total, activeCurrency, exchangeRate)}
                    </span>
                </div>

                {isTaxActive && isTaxInclusive && (
                    <p className="mt-1 text-right text-[11px] font-medium text-neutral-400 dark:text-muted-foreground italic">
                        * Prices include {effectiveTaxName} {taxRate > 0 ? `(${taxRate}%)` : ""}
                    </p>
                )}
            </CardContent>

            <div className="mt-6 flex flex-col gap-3">
                {!store.open ? (
                    <Button
                        disabled
                        className="h-13 sm:h-14 w-full rounded-full bg-neutral-300 text-base sm:text-lg font-bold text-neutral-500"
                    >
                        Shop is closed
                    </Button>
                ) : pendingElsewhere ? (
                    <Button
                        disabled
                        className="h-13 sm:h-14 w-full rounded-full bg-neutral-300 text-base sm:text-lg font-bold text-neutral-500"
                    >
                        {t("payingFirst", { storeName: pendingElsewhere.storeName })}
                    </Button>
                ) : (
                    <Link href={`/store/${store.slug}/checkout`} className="w-full">
                        <Button className="h-13 sm:h-14 w-full rounded-full bg-primary text-base sm:text-lg font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                            {pendingHere ? t("finishPayment") : t("checkout")}
                        </Button>
                    </Link>
                )}
            </div>
        </Card>
    );
}