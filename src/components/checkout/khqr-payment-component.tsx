"use client";

import { useTranslations } from "next-intl";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Loader2, RefreshCw, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    useCancelCheckoutMutation,
    useGetPaymentStatusMutation,
} from "@/features/checkout/checkoutApi";
import { formatMoney } from "@/lib/type/cartType";
import {
    checkoutErrorMessage,
    type CheckoutSession,
} from "@/lib/type/checkoutType";

const POLL_INTERVAL_MS = 2000;

type Phase = "waiting" | "paid" | "expired" | "cancelled";

function secondsLeft(expiresAt: string | null): number {
    if (!expiresAt) return 180; // 3 minutes default KHQR TTL fallback
  
    const normalizedDate =
        expiresAt.endsWith("Z") || expiresAt.includes("+")
            ? expiresAt
            : `${expiresAt}Z`;

    const parsed = new Date(normalizedDate).getTime();
    if (Number.isNaN(parsed)) return 180;

    const diff = parsed - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
}

function formatCountdown(total: number): string {
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function KhqrPaymentComponent({
    session,
    onPaid,
    onCancelled,
    onRegenerate,
    regenerating,
    overrideCurrency,
}: {
    session: CheckoutSession;
    onPaid: () => void;
    onCancelled: () => void;
    onRegenerate: () => void;
    regenerating: boolean;
    overrideCurrency?: string;
}) {
  const t = useTranslations("Checkout");
  const currency = overrideCurrency || session.currency;
    const [phase, setPhase] = useState<Phase>("waiting");
    const [remaining, setRemaining] = useState(() => secondsLeft(session.expiresAt));
    const [notice, setNotice] = useState<string | null>(null);

    const [getPaymentStatus] = useGetPaymentStatusMutation();
    const [cancelCheckout, { isLoading: cancelling }] = useCancelCheckoutMutation();

    const inFlight = useRef(false);

    const { orderId, expiresAt } = session;

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPhase("waiting");
        setNotice(null);
        setRemaining(secondsLeft(expiresAt));
    }, [orderId, expiresAt]);

    // Countdown.
    useEffect(() => {
        if (phase !== "waiting") return;

        const tick = window.setInterval(() => {
            const left = secondsLeft(expiresAt);
            setRemaining(left);
            if (left <= 0 && expiresAt) setPhase("expired");
        }, 1000);

        return () => window.clearInterval(tick);
    }, [phase, expiresAt]);

    const poll = useCallback(async () => {
        if (inFlight.current) return;
        inFlight.current = true;

        try {
            const status = await getPaymentStatus(orderId).unwrap();

            const isPaid =
                Boolean(status?.paid) ||
                status?.orderStatus === "PAID" ||
                status?.qrStatus === "PAID" ||
                (status as any)?.status === "PAID";

            if (isPaid) {
                setPhase("paid");
                toast.success(t("paymentConfirmedToast"));
                onPaid();
                return;
            }

            if (status?.qrStatus === "EXPIRED") {
                setPhase("expired");
                toast.error(t("qrExpiredToast"));
                return;
            }

            if (status?.qrStatus === "CANCELLED" || status?.orderStatus === "CANCELLED") {
                setPhase("cancelled");
                toast.info(t("orderCancelledToast"));
                return;
            }
        } catch (error) {
            setNotice(
                checkoutErrorMessage(error, t("stillChecking")),
            );
        } finally {
            inFlight.current = false;
        }
    }, [getPaymentStatus, orderId, onPaid, t]);

    useEffect(() => {
        if (phase !== "waiting") return;

        const timer = window.setInterval(poll, POLL_INTERVAL_MS);
        return () => window.clearInterval(timer);
    }, [phase, poll]);

    const handleCancel = async () => {
        try {
            await cancelCheckout(orderId).unwrap();
            setPhase("cancelled");
            toast.info(t("orderCancelledToast"));
            onCancelled();
        } catch (error) {
            const msg = checkoutErrorMessage(error, t("couldNotCancel"));
            setNotice(msg);
            toast.error(msg);
        }
    };


    if (phase === "paid") {
        return (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-900 dark:bg-green-950/40">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600">
                    <Check className="h-7 w-7 text-white" strokeWidth={3} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-green-700 dark:text-green-400">
                    Payment received
                </h2>

                <p className="mt-2 text-sm text-neutral-600 dark:text-muted-foreground">
                    {t("paymentConfirmed", { amount: formatMoney(session.total, session.currency), storeName: session.storeName })}
                </p>

                <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-muted-foreground">
                    {session.invoiceNumber}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link href={`/receipt/${session.orderId}`}>
                        <Button className="w-full sm:w-auto rounded-full bg-[#00932A] font-bold text-white hover:bg-[#007d24]">
                            View E-Receipt
                        </Button>
                    </Link>

                    <Link href="/payment-history">
                        <Button variant="outline" className="w-full sm:w-auto rounded-full">
                            Payment History
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }


    if (phase === "cancelled") {
        return (
            <div className="rounded-2xl bg-gray-100 p-8 text-center dark:bg-card">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-card-foreground">
                    Order cancelled
                </h2>

                <p className="mt-2 text-sm text-neutral-600 dark:text-muted-foreground">
                    {t("cancelledDescription")}
                </p>
            </div>
        );
    }


    const expired = phase === "expired";
    const totalWindow = 5 * 60;
    const progress = Math.min(100, Math.max(0, (remaining / totalWindow) * 100));

    return (
        <div className="rounded-2xl bg-gray-100 p-6 dark:bg-card">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-card-foreground">
                        Scan to pay
                    </h2>

                    <p className="text-sm text-neutral-500 dark:text-muted-foreground">
                        {t("bankingAppDescription")}
                    </p>
                </div>

                <span className="rounded-full bg-white px-3 py-1 font-mono text-xs text-neutral-600 dark:bg-background dark:text-muted-foreground">
                    {session.invoiceNumber}
                </span>
            </div>

            {/* QR */}
            <div className="mt-6 flex flex-col items-center">
                <div className="relative rounded-2xl bg-white p-4 shadow-sm">
                    {session.qrImage ? (
                        <Image
                            src={session.qrImage}
                            alt={t("qrAlt", { amount: formatMoney(session.total, currency), storeName: session.storeName })}
                            width={240}
                            height={240}
                            unoptimized
                            className={expired ? "opacity-20 blur-[2px]" : ""}
                        />
                    ) : (
                        <div className="flex h-60 w-60 items-center justify-center text-sm text-neutral-400">
                            No QR available
                        </div>
                    )}

                    {expired && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="rounded-full bg-neutral-900/90 px-4 py-2 text-sm font-semibold text-white">
                                QR expired
                            </span>
                        </div>
                    )}
                </div>

                <p className="mt-5 text-3xl font-bold text-green-600 dark:text-primary">
                    {formatMoney(session.total, currency)}
                </p>

                <p className="mt-1 text-sm text-neutral-600 dark:text-muted-foreground">
                    {t("payTo", { storeName: session.storeName })}
                </p>
            </div>

            {!expired && (
                <div className="mt-6">
                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                            <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" />
                            Waiting for Bakong
                        </span>

                        <span className="font-mono tabular-nums">
                            {formatCountdown(remaining)}
                        </span>
                    </div>

                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-border">
                        <div
                            className="h-full rounded-full bg-green-600 transition-[width] duration-1000 ease-linear dark:bg-primary"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {notice && (
                <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-center text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                    {notice}
                </p>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3">
                {expired ? (
                    <>
                        <Button
                            variant="outline"
                            onClick={poll}
                            className="h-12 w-full rounded-full text-base font-semibold"
                        >
                            {t("alreadyPaidCheck")}
                        </Button>

                        <Button
                            onClick={onRegenerate}
                            disabled={regenerating}
                            className="h-12 w-full rounded-full bg-green-600 text-base font-semibold text-white hover:bg-green-700 dark:bg-primary dark:text-primary-foreground"
                        >
                            {regenerating ? (
                                <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                            {t("generateNewQr")}
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="outline"
                        onClick={poll}
                        className="h-12 w-full rounded-full text-base font-semibold"
                    >
                        {t("paidCheckNow")}
                    </Button>
                )}

                <Button
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="h-10 w-full rounded-full text-sm text-neutral-500 hover:text-destructive"
                >
                    <X className="h-4 w-4" />
                    {t("cancelOrder")}
                </Button>
            </div>

            <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-neutral-500 dark:text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Paid directly {t("payTo", { storeName: session.storeName })} through Bakong
            </p>
        </div>
    );
}