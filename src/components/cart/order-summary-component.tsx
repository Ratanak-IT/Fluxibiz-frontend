"use client";

import { useTranslations } from "next-intl";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { useGetActiveCheckoutQuery } from "@/features/checkout/checkoutApi";
import { useGetPublicStoreQuery } from "@/features/store-api/store-api";
import { computeTax, formatMoney, type StoreCart } from "@/lib/type/cartType";

export default function OrderSummaryComponent({
    store,
    currency,
    storeItems = [],
}: {
    store: StoreCart;
    currency?: string;
    storeItems?: any[];
}) {
    const t = useTranslations("Cart");
    const activeCurrency = currency || store.currency;
    const discount = store.items.reduce((acc, item) => acc + (item.discountAmount ?? 0), 0);
    const netAmount = Math.max(0, store.subtotal - discount);
    const freeItemCount = store.items.reduce((acc, item) => acc + (item.freeQuantity ?? 0), 0);
    // `store.subtotal` is already the pre-discount gross total (netAmount above
    // is what subtracts the discount from it) — the "subtotal" row shows this
    // number as-is, with the discount broken out on its own line below.
    const originalSubtotal = store.subtotal;

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
                        {formatMoney(originalSubtotal, activeCurrency)}
                    </span>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-border">
                    <span className="flex items-center gap-1.5">
                        {t("discount")}
                        {freeItemCount > 0 && (
                            <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                🎁 {freeItemCount} FREE
                            </span>
                        )}
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-card-foreground">
                        {discount > 0 ? `-${formatMoney(discount, activeCurrency)}` : formatMoney(0, activeCurrency)}
                    </span>
                </div>

                {isTaxActive && !isTaxInclusive && (
                    <div className="flex items-center justify-between">
                        <span>
                            {effectiveTaxName} {taxRate > 0 ? `(${taxRate}%)` : ""}
                        </span>
                        <span className="font-bold text-neutral-900 dark:text-card-foreground">
                            +{formatMoney(taxAmount, activeCurrency)}
                        </span>
                    </div>
                )}

                {isTaxActive && isTaxInclusive && (
                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-muted-foreground">
                        <span>
                            {effectiveTaxName} {taxRate > 0 ? `(${taxRate}% Incl.)` : "(Incl.)"}
                        </span>
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                            {formatMoney(taxAmount, activeCurrency)}
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between pt-2">
                    <span className="text-base font-bold text-neutral-900 dark:text-card-foreground">
                        Total
                    </span>

                    <span className="text-2xl font-bold text-green-600 dark:text-primary">
                        {formatMoney(total, activeCurrency)}
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
                        <Button className="h-13 sm:h-14 w-full rounded-full bg-green-600 text-base sm:text-lg font-bold text-white transition-colors hover:bg-green-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90">
                            {pendingHere ? t("finishPayment") : t("checkout")}
                        </Button>
                    </Link>
                )}
            </div>
        </Card>
    );
}