"use client";

import { useTranslations } from "next-intl";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Copy, Download, Loader2, QrCode, RefreshCw, ShieldCheck, X } from "lucide-react";
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
import { cn } from "@/lib/utils";

const POLL_INTERVAL_MS = 2000;

type Phase = "waiting" | "paid" | "expired" | "cancelled";

function secondsLeft(expiresAt: string | null): number {
    if (!expiresAt) return 180; // 3 minutes default KHQR TTL fallback

    // The backend's timestamps are LocalDateTime — a bare string with no
    // timezone marker, captured in the server's own local wall-clock time
    // (Asia/Phnom_Penh, see the api container's TZ setting). Appending "Z"
    // here used to be correct back when the server ran in UTC, but now it
    // makes the browser (also Phnom Penh time) misread the value as UTC and
    // add a further 7 hours on top — inflating a ~2 minute countdown to
    // ~422 minutes. Parsing the bare string directly lets `Date` read it as
    // local time, which is what it already is.
    const parsed = new Date(expiresAt).getTime();
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

    const handleDownloadQr = () => {
        if (!session.qrImage) return;
        const link = document.createElement("a");
        link.href = session.qrImage;
        link.download = `KHQR_${session.invoiceNumber || "payment"}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("QR code saved to device");
    };

    const handleCopyMd5 = () => {
        const textToCopy = session.md5 || session.invoiceNumber;
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy);
        toast.success("Payment code copied");
    };

    if (phase === "paid") {
        return (
            <div className="rounded-2xl border border-green-200/80 bg-green-50/60 p-7 sm:p-8 text-center dark:border-green-900/60 dark:bg-green-950/30">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#00932A] shadow-md">
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

                <div className="mt-6 flex justify-center">
                    <Link href={`/receipt/${session.orderId}`}>
                        <Button className="h-11 w-full rounded-full bg-[#00932A] px-8 font-semibold text-white shadow-sm hover:bg-[#007a22] sm:w-auto">
                            View E-Receipt
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
    const totalWindow = 3 * 60;
    const progress = Math.min(100, Math.max(0, (remaining / totalWindow) * 100));

    const isRiel = currency?.toUpperCase() === "KHR" || currency?.toUpperCase() === "RIEL";
    const currencySymbol = isRiel ? "៛" : "$";
    const formattedAmount = isRiel
        ? Number(session.total).toLocaleString()
        : Number(session.total).toFixed(2);

    return (
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xl sm:p-7 dark:border-neutral-800 dark:bg-card">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 pb-5 border-b border-neutral-100 dark:border-neutral-800/80">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E11B22] dark:bg-red-950/40">
                        <QrCode className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-neutral-900 dark:text-card-foreground">
                            Scan to pay
                        </h2>
                        <p className="text-xs text-neutral-500 dark:text-muted-foreground">
                            {t("bankingAppDescription")}
                        </p>
                    </div>
                </div>

                <span className="shrink-0 rounded-lg bg-neutral-100 px-3 py-1 font-mono text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    {session.invoiceNumber}
                </span>
            </div>

            {/* Official Bakong KHQR Stand Card */}
            <div className="mt-6 flex flex-col items-center">
                <div className="relative w-full max-w-[320px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-white dark:text-neutral-900">
                    {/* KHQR Official Red Top Banner */}
                    <div className="relative flex h-14 w-full items-center justify-center bg-[#E11B22] px-6 rounded-t-2xl">
                        <span className="font-sans text-xl font-extrabold tracking-widest text-white uppercase">
                            KHQR
                        </span>
                    </div>

                    {/* Merchant & Amount Info Section */}
                    <div className="px-6 pt-5 pb-3 bg-white">
                        <p className="text-xs font-medium text-neutral-500">
                            {session.storeName}
                        </p>

                        <div className="mt-1 flex items-baseline gap-1.5">
                            <span className="text-3xl font-black text-neutral-900 tracking-tight">
                                {formattedAmount}
                            </span>
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                {currency}
                            </span>
                        </div>
                    </div>

                    {/* Dashed Separator */}
                    <div className="px-6 bg-white">
                        <div className="w-full border-b border-dashed border-neutral-300" />
                    </div>

                    {/* QR Code Canvas with Sleek Official Center Currency Icon ($ / ៛) */}
                    <div className="relative flex flex-col items-center bg-white p-6">
                        {session.qrImage ? (
                            <div className="relative flex items-center justify-center rounded-xl bg-white p-1">
                                <Image
                                    src={session.qrImage}
                                    alt={t("qrAlt", { amount: formatMoney(session.total, currency), storeName: session.storeName })}
                                    width={240}
                                    height={240}
                                    unoptimized
                                    className={cn("h-60 w-60 object-contain", expired && "opacity-15 blur-[3px]")}
                                />

                                {/* Black Circular Currency Badge Overlay ($ / ៛) */}
                                {!expired && (
                                    <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white border-2 border-white shadow-md font-extrabold text-sm select-none pointer-events-none">
                                        {currencySymbol}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex h-60 w-60 items-center justify-center text-sm text-neutral-400">
                                No QR available
                            </div>
                        )}

                        {expired && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/85 backdrop-blur-xs">
                                <span className="rounded-full bg-[#E11B22] px-4 py-1.5 text-xs font-bold text-white shadow-md">
                                    QR Expired
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Live Polling Status & Timer Bar */}
            {!expired && (
                <div className="mt-6">
                    <div className="flex items-center justify-between text-xs text-neutral-700 dark:text-neutral-300">
                        <span className="inline-flex items-center gap-2 font-medium">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#E11B22]"></span>
                            </span>
                            Waiting for Bakong payment
                        </span>

                        <span className="font-mono text-xs font-bold tabular-nums text-red-600 dark:text-red-400">
                            {formatCountdown(remaining)}
                        </span>
                    </div>

                    <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#E11B22] to-amber-500 transition-[width] duration-1000 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {notice && (
                <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-center text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                    {notice}
                </p>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3">
                {expired ? (
                    <>
                        <Button
                            onClick={poll}
                            className="h-12 w-full rounded-full bg-[#00932A] text-base font-bold text-white shadow-md hover:bg-[#007a22] transition-colors"
                        >
                            {t("alreadyPaidCheck")}
                        </Button>

                        <Button
                            onClick={onRegenerate}
                            disabled={regenerating}
                            className="h-12 w-full rounded-full bg-[#00932A] text-base font-bold text-white shadow-md hover:bg-[#007a22] transition-colors"
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
                        className="h-12 w-full rounded-full bg-[#00932A] text-base font-bold text-white shadow-md hover:bg-[#007a22] transition-all hover:scale-[1.01]"
                    >
                        {t("paidCheckNow")}
                    </Button>
                )}

                <Button
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="h-10 w-full rounded-full text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/20"
                >
                    {cancelling ? (
                        <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                    ) : (
                        <X className="h-4 w-4 text-red-500 dark:text-red-400" />
                    )}
                    {t("cancelOrder")}
                </Button>
            </div>

            <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-neutral-400 dark:text-neutral-500">
                <ShieldCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                Paid directly {t("payTo", { storeName: session.storeName })} through Bakong
            </p>
        </div>
    );
}