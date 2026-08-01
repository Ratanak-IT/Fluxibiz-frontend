"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2, Store, TriangleAlert } from "lucide-react";

import KhqrPaymentComponent from "@/components/checkout/khqr-payment-component";
import { Button } from "@/components/ui/button";
import { useGetCartQuery } from "@/features/cart/cartApi";
import {
    useCancelCheckoutMutation,
    useCreateCheckoutMutation,
    useGetActiveCheckoutQuery,
} from "@/features/checkout/checkoutApi";
import { formatMoney } from "@/lib/type/cartType";
import {
    checkoutErrorMessage,
    type CheckoutSession,
} from "@/lib/type/checkoutType";

export default function CheckoutPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);

    const { data: cart, isLoading: cartLoading } = useGetCartQuery();
    const {
        data: active,
        isLoading: activeLoading,
        refetch: refetchActive,
    } = useGetActiveCheckoutQuery();

    const [createCheckout, { isLoading: creating }] = useCreateCheckoutMutation();
    const [cancelCheckout, { isLoading: cancelling }] = useCancelCheckoutMutation();

    const [session, setSession] = useState<CheckoutSession | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [paid, setPaid] = useState(false);

    const store = cart?.stores.find((s) => s.slug === slug);

    const backToCart = `/cart?shop=${encodeURIComponent(slug)}`;

    const pending = active?.hasPendingCheckout ? active.checkout : null;
    const pendingIsThisStore = pending?.storeSlug === slug;
    const blockedBy = pending && !pendingIsThisStore ? pending : null;

    useEffect(() => {
        if (pending && pendingIsThisStore && pending.qr && !session) {
            setSession(pending);
        }
    }, [pending, pendingIsThisStore, session]);

    const startPayment = async () => {
        if (!store) return;
        setError(null);

        try {
            const created = await createCheckout({
                businessId: store.businessId,
            }).unwrap();

            setSession(created);
        } catch (err) {
            setError(
                checkoutErrorMessage(err, "Could not start the payment. Try again."),
            );
        }
    };

    const releaseOtherOrder = async () => {
        if (!blockedBy) return;
        setError(null);

        try {
            await cancelCheckout(blockedBy.orderId).unwrap();
            await refetchActive();
        } catch (err) {
            setError(
                checkoutErrorMessage(err, "Could not cancel the other order."),
            );
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
                <p className="text-lg font-medium">Nothing to check out</p>

                <p className="mt-2 text-sm text-muted-foreground">
                    Your cart has no items from this shop.
                </p>

                <Link
                    href={backToCart}
                    className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:underline"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to cart
                </Link>
            </div>
        );
    }

    const storeName = store?.name ?? session?.storeName ?? "this shop";
    const currency = store?.currency ?? session?.currency ?? "USD";

    return (
        <div className="mx-auto max-w-3xl px-6 py-10">
            <Link
                href={backToCart}
                className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:underline"
            >
                <ChevronLeft className="h-4 w-4" />
                Back to cart
            </Link>

            <h1 className="text-3xl font-bold text-green-600">Checkout</h1>

            <p className="mt-1 text-sm text-muted-foreground">{storeName}</p>

            {blockedBy && !session && (
                <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/40">
                    <div className="flex items-start gap-3">
                        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                        <div className="flex-1">
                            <p className="font-semibold text-amber-900 dark:text-amber-200">
                                You have a payment open at {blockedBy.storeName}
                            </p>

                            <p className="mt-1 text-sm text-amber-800 dark:text-amber-300/90">
                                You can pay one shop at a time — each shop receives its
                                own KHQR. Finish that payment or cancel it to pay{" "}
                                {storeName}.
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <Link href={`/store/${blockedBy.storeSlug}/checkout`}>
                                    <Button
                                        size="sm"
                                        className="rounded-full bg-amber-600 text-white hover:bg-amber-700"
                                    >
                                        <Store className="h-4 w-4" />
                                        Go to {blockedBy.storeName}
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
                                    Cancel that order
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!session && store && (
                <div className="mt-8 rounded-xl bg-gray-100 p-5 dark:bg-card">
                    <div className="flex flex-col gap-3">
                        {store.items.map((line) => (
                            <div
                                key={line.cartItemId}
                                className="flex items-center justify-between text-sm"
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

                    <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-5 dark:border-border">
                        <span className="text-base font-bold text-neutral-900 dark:text-card-foreground">
                            Total
                        </span>

                        <span className="text-2xl font-bold text-green-600 dark:text-primary">
                            {formatMoney(store.subtotal, currency)}
                        </span>
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </p>
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
                        ? "Shop is closed"
                        : `Pay ${formatMoney(store?.subtotal ?? 0, currency)} with Bakong`}
                </Button>
            )}

            {session && (
                <div className="mt-8">
                    <KhqrPaymentComponent
                        session={session}
                        regenerating={creating}
                        onPaid={() => setPaid(true)}
                        onCancelled={() => {
                            setSession(null);
                            refetchActive();
                        }}
                        onRegenerate={startPayment}
                    />
                </div>
            )}

            {paid && (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link href="/store" className="flex-1">
                        <Button
                            variant="outline"
                            className="h-12 w-full rounded-full text-base font-semibold"
                        >
                            Keep shopping
                        </Button>
                    </Link>

                    <Link href="/cart" className="flex-1">
                        <Button className="h-12 w-full rounded-full bg-green-600 text-base font-semibold text-white hover:bg-green-700 dark:bg-primary dark:text-primary-foreground">
                            Back to cart
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}