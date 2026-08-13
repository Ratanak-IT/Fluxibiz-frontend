"use client";

import { useTranslations } from "next-intl";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2, Store, TriangleAlert } from "lucide-react";

import { toast } from "sonner";
import KhqrPaymentComponent from "@/components/checkout/khqr-payment-component";
import { Button } from "@/components/ui/button";
import { useGetCartQuery } from "@/features/cart/cartApi";
import {
    useCancelCheckoutMutation,
    useCreateCheckoutMutation,
    useGetActiveCheckoutQuery,
} from "@/features/checkout/checkoutApi";
import { formatMoney, formatStockErrorMessage } from "@/lib/type/cartType";
import {
    checkoutErrorMessage,
    type CheckoutSession,
} from "@/lib/type/checkoutType";
import { markItemOutOfStock } from "@/lib/store/detailstore/detailstore";
import { useGetPublicStoreQuery } from "@/features/store-api/store-api";
import ApiErrorFallback from "@/components/common/api-error-fallback";

export default function CheckoutPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
  const t = useTranslations("Checkout");
    const { slug } = use(params);

    const { data: cart, isLoading: cartLoading } = useGetCartQuery();
    const { data: publicStore } = useGetPublicStoreQuery(slug, { skip: !slug });
    const {
        data: active,
        isLoading: activeLoading,
        refetch: refetchActive,
    } = useGetActiveCheckoutQuery();

    const [createCheckout, { isLoading: creating }] = useCreateCheckoutMutation();
    const [cancelCheckout, { isLoading: cancelling }] = useCancelCheckoutMutation();

    const [session, setSession] = useState<CheckoutSession | null>(null);
    const [cancelledOrderId, setCancelledOrderId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [paid, setPaid] = useState(false);

    const store = cart?.stores.find((s) => s.slug === slug);

    const backToCart = `/cart?shop=${encodeURIComponent(slug)}`;

    const pending = active?.hasPendingCheckout ? active.checkout : null;
    const pendingIsThisStore = pending?.storeSlug === slug;
    const blockedBy = pending && !pendingIsThisStore ? pending : null;

    useEffect(() => {
        if (
            pending &&
            pendingIsThisStore &&
            pending.qr &&
            !session &&
            cancelledOrderId !== pending.orderId
        ) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSession(pending);
        }
    }, [pending, pendingIsThisStore, session, cancelledOrderId]);

    const startPayment = async () => {
        if (!store) return;
        setError(null);

        try {
            const created = await createCheckout({
                businessId: store.businessId,
            }).unwrap();

            setSession(created);
        } catch (err) {
            const msg = formatStockErrorMessage(err) || checkoutErrorMessage(err, t("couldNotStart"));
            const lower = msg.toLowerCase();
            if (lower.includes("stock") || lower.includes("enough") || lower.includes("negative") || lower.includes("unavailable")) {
                if (store?.items) {
                    store.items.forEach((line) => {
                        markItemOutOfStock(line.itemId);
                    });
                }
            }
            setError(msg);
            toast.error(msg);
        }
    };

    const releaseOtherOrder = async () => {
        if (!blockedBy) return;
        setError(null);

        try {
            await cancelCheckout(blockedBy.orderId).unwrap();
            await refetchActive();
        } catch (err) {
            const msg = checkoutErrorMessage(err, t("couldNotCancelOther"));
            setError(msg);
            toast.error(msg);
        }
    };


    if (cartLoading || activeLoading) {
        return (
            <div className="mx-auto max-w-3xl px-6 py-16 text-center">
                <Loader2 className="mx-auto h-5 w-5 animate-spin text-neutral-400 motion-reduce:animate-none" />
            </div>
        );
    }

    if (!store && !paid && !session) {
        return (
            <div className="mx-auto max-w-2xl px-6 py-16 text-center">
                <p className="text-lg font-medium">{t("nothingToCheckout")}</p>

                <p className="mt-2 text-sm text-muted-foreground">
                    {t("noItemsFromShop")}
                </p>

                <Link
                    href={backToCart}
                    className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:underline"
                >
                    <ChevronLeft className="h-4 w-4" />
                    {t("backToCart")}
                </Link>
            </div>
        );
    }

    const storeName = store?.name ?? session?.storeName ?? publicStore?.name ?? t("thisShop");
    const storeCurrency = publicStore?.displayCurrency || publicStore?.baseCurrency;
    const currency = storeCurrency || (store?.currency !== "USD" ? store?.currency : undefined) || session?.currency || "KHR";

    return (
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-24 sm:pt-8 sm:pb-12">
            <div className="mb-2 flex items-center justify-between sm:mb-3">
                <h1 className="text-3xl font-bold text-green-600 dark:text-primary">{t("title")}</h1>

                <Link
                    href={backToCart}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 transition-colors hover:underline dark:text-primary"
                >
                    <ChevronLeft className="h-4 w-4" />
                    {t("backToCart")}
                </Link>
            </div>

            <p className="mt-1 mb-6 text-sm text-muted-foreground">{storeName}</p>

            {blockedBy && !session && (
                <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/40">
                    <div className="flex items-start gap-3">
                        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                        <div className="flex-1">
                            <p className="font-semibold text-amber-900 dark:text-amber-200">
                                {t("paymentOpenAt", { storeName: blockedBy.storeName })}
                            </p>

                            <p className="mt-1 text-sm text-amber-800 dark:text-amber-300/90">
                                {t("paymentOpenDescription", { storeName })}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <Link href={`/store/${blockedBy.storeSlug}/checkout`}>
                                    <Button
                                        size="sm"
                                        className="rounded-full bg-amber-600 text-white hover:bg-amber-700"
                                    >
                                        <Store className="h-4 w-4" />
                                        {t("goToStore", { storeName: blockedBy.storeName })}
                                    </Button>
                                </Link>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={cancelling}
                                    onClick={releaseOtherOrder}
                                    className="rounded-full"
                                >
                                    {cancelling && (
                                        <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                                    )}
                                    {t("cancelThatOrder")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!session && store && (
                <div className="rounded-2xl bg-white border border-neutral-100/80 p-6 sm:p-7 shadow-xs dark:border-neutral-800 dark:bg-card">
                    <div className="flex flex-col gap-4">
                        {store.items.map((line) => (
                            <div
                                key={line.cartItemId}
                                className="flex items-center justify-between text-base"
                            >
                                <span className="text-neutral-700 dark:text-card-foreground">
                                    {line.name} × {line.quantity}
                                </span>

                                <span className="font-semibold text-neutral-900 dark:text-card-foreground">
                                    {formatMoney(line.subtotal, currency)}
                                </span>
                            </div>
                        ))}
                        
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-border">
                        <span className="text-base font-bold text-neutral-900 dark:text-card-foreground">
                            {t("total")}
                        </span>

                        <span className="text-2xl font-bold text-green-600 dark:text-primary">
                            {formatMoney(store.subtotal, currency)}
                        </span>
                    </div>
                </div>
            )}

            {error && (
                <ApiErrorFallback
                    variant="compact"
                    title={error}
                    className="mt-4"
                />
            )}

            {/* Pay */}
            {!session && (
                <Button
                    onClick={startPayment}
                    disabled={creating || !!blockedBy || store?.open === false}
                    className="mt-6 h-12 w-full rounded-full bg-green-600 text-base font-semibold text-white hover:bg-green-700 disabled:bg-neutral-300 disabled:text-neutral-500 dark:bg-primary dark:text-primary-foreground"
                >
                    {creating && (
                        <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                    )}
                    {store?.open === false
                        ? t("shopClosed")
                        : t("payWithBakong", { amount: formatMoney(store?.subtotal ?? 0, currency) })}
                </Button>
            )}

            {session && (
                <div className="mt-8">
                    <KhqrPaymentComponent
                        session={session}
                        overrideCurrency={currency}
                        regenerating={creating}
                        onPaid={() => setPaid(true)}
                        onCancelled={() => {
                            if (session?.orderId) {
                                setCancelledOrderId(session.orderId);
                            }
                            setSession(null);
                            refetchActive();
                        }}
                        onRegenerate={startPayment}
                    />
                </div>
            )}

            {paid && (
                <div className="mt-6">
                    <Link href="/store" className="block w-full">
                        <Button
                            variant="outline"
                            className="h-12 w-full rounded-full border-primary bg-white text-base font-semibold text-primary transition-colors hover:bg-primary/5 dark:bg-transparent dark:text-primary dark:hover:bg-primary/10"
                        >
                            Keep shopping
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}