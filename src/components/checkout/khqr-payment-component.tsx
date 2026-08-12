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
            <div className="rounded-2xl border border-green-200/80 bg-green-50/60 p-7 sm:p-8 text-center dark:border-green-900/60 dark:bg-green-950/30">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 shadow-md">
                    <Check className="h-7 w-7 text-white" strokeWidth={3} />
                </div>

                <h2 className="mt-4 text-xl font-bold tracking-tight text-green-700 dark:text-green-400 sm:text-2xl">
                    Payment received
                </h2>

                <p className="mt-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                    {t("paymentConfirmed", { amount: formatMoney(session.total, session.currency), storeName: session.storeName })}
                </p>

                <p className="mt-1 font-mono text-xs text-neutral-400 dark:text-neutral-500">
                    {session.invoiceNumber}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link href={`/receipt/${session.orderId}`}>
                        <Button className="h-11 w-full rounded-full bg-green-600 px-6 font-semibold text-white shadow-sm hover:bg-green-700 sm:w-auto dark:bg-primary dark:text-primary-foreground">
                            View E-Receipt
                        </Button>
                    </Link>

                    <Link href="/payment-history">
                        <Button variant="outline" className="h-11 w-full rounded-full border-primary bg-white px-6 font-semibold text-primary transition-colors hover:bg-primary/5 sm:w-auto dark:bg-transparent dark:text-primary dark:hover:bg-primary/10">
                            Payment History
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }


    if (phase === "cancelled") {
        return (
            <div className="rounded-2xl bg-white border border-neutral-100/80 p-8 text-center shadow-xs dark:border-neutral-800 dark:bg-card">
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
        <div className="rounded-2xl bg-white border border-neutral-100/80 p-6 sm:p-7 shadow-xs dark:border-neutral-800 dark:bg-card">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-card-foreground">
                        Scan to pay
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500 dark:text-muted-foreground">
                        {t("bankingAppDescription")}
                    </p>
                </div>

                <span className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 font-mono text-xs font-semibold text-neutral-600 dark:bg-background dark:text-muted-foreground">
                    {session.invoiceNumber}
                </span>
            </div>

            {/* QR Code Container with official KHQR Red Label */}
            <div className="mt-6 flex flex-col items-center">
                <div className="relative flex flex-col items-center overflow-hidden rounded-2xl bg-white border border-neutral-200/80 p-4 shadow-xs dark:border-neutral-800 dark:bg-background">
                    {/* Official KHQR Red Badge Header */}
                    <div className="mb-3 flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-1.5 shadow-xs">
                        <span className="font-sans text-xs font-black tracking-widest text-white uppercase">
                            KHQR
                        </span>
                    </div>

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

                <p className="mt-1 text-sm font-medium text-neutral-500 dark:text-muted-foreground">
                    {t("payTo", { storeName: session.storeName })}
                </p>
            </div>

            {/* Timer Status Bar in Accent Red Color */}
            {!expired && (
                <div className="mt-6">
                    <div className="flex items-center justify-between text-xs text-red-500 dark:text-red-400">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-red-500 dark:text-red-400 motion-reduce:animate-none" />
                            Waiting for Bakong
                        </span>

                        <span className="font-mono text-xs font-bold tabular-nums">
                            {formatCountdown(remaining)}
                        </span>
                    </div>

                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-red-100 dark:bg-red-950/40">
                        <div
                            className="h-full rounded-full bg-red-500 transition-[width] duration-1000 ease-linear dark:bg-red-500"
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
                            onClick={poll}
                            className="h-12 w-full rounded-full bg-green-600 text-base font-semibold text-white shadow-md hover:bg-green-700 dark:bg-primary dark:text-primary-foreground"
                        >
                            {t("alreadyPaidCheck")}
                        </Button>

                        <Button
                            onClick={onRegenerate}
                            disabled={regenerating}
                            className="h-12 w-full rounded-full bg-green-600 text-base font-semibold text-white shadow-md hover:bg-green-700 dark:bg-primary dark:text-primary-foreground"
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
                        onClick={poll}
                        className="h-12 w-full rounded-full bg-green-600 text-base font-semibold text-white shadow-md hover:bg-green-700 dark:bg-primary dark:text-primary-foreground"
                    >
                        {t("paidCheckNow")}
                    </Button>
                )}

                <Button
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="h-10 w-full rounded-full text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/20"
                >
                    {cancelling ? (
                        <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                    ) : (
                        <X className="h-4 w-4 text-red-500 dark:text-red-400" />
                    )}
                    {t("cancelOrder")}
                </Button>
            </div>

            <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-neutral-500 dark:text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-neutral-400" />
                Paid directly {t("payTo", { storeName: session.storeName })} through Bakong
            </p>
        </div>
    );
}