"use client";

import { use, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetOrderReceiptQuery } from "@/features/checkout/checkoutApi";
import { formatMoney, resolveMediaUrl } from "@/lib/type/cartType";

import { useTranslations } from "next-intl";
import ApiErrorFallback from "@/components/common/api-error-fallback";
import { useMiniAppMode } from "@/lib/tma/useMiniAppMode";

/** A row/column label shown as "English / Khmer" on one line — this receipt is
 * always bilingual regardless of the site's language toggle, the way a printed
 * receipt in Cambodia normally is. */
function BiLabel({ en, km, className }: { en: string; km: string; className?: string }) {
  return (
    <span className={className}>
      {en}{" "}
      <span className="text-[0.85em] font-normal text-neutral-400 dark:text-muted-foreground">
        / {km}
      </span>
    </span>
  );
}

function storeInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function ReceiptComponent({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const t = useTranslations("Common");
  const { orderId } = use(params);
  const receiptRef = useRef<HTMLDivElement>(null);
  const { isMiniApp: isTma } = useMiniAppMode();

  const { data: order, isLoading, isError, refetch } = useGetOrderReceiptQuery(orderId);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[500px] max-w-3xl items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00932A] border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">
            {t("loading")}
          </p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <ApiErrorFallback
          title={t("receiptNotFound")}
          description={t("receiptNotFoundDesc")}
          onRetry={() => refetch()}
          backHref="/payment-history"
          backLabel={t("viewPaymentHistory")}
        />
      </div>
    );
  }

  const isPayLater = order.paymentMethod === "Pay Later";
  const isCancelled = order.status === "CANCELLED";
  const isPending = order.status === "PENDING" && !isCancelled;
  const isPaid = order.status === "PAID" && !isPayLater;

  // No separate "amount collected" field from the backend — derive it from the
  // same status/paymentMethod the app already has: a settled order is paid in
  // full unless it was placed Pay Later, in which case nothing has been collected.
  const amountPaid = isPaid ? order.total : 0;
  const balanceDue = Math.max(order.total - amountPaid, 0);
  const isTaxInclusive = order.taxInclusionType === "INCLUSIVE";
  const taxAmount = order.taxAmount ?? 0;
  const taxRate = order.taxRate ?? 0;
  const isTaxActive = taxAmount > 0;
  const effectiveTaxName = order.taxLabel?.trim() || "VAT";
  const afterDiscount = Math.max(0, order.subtotal - (order.discountAmount ?? 0));

  const formattedDate = order.createdDate
    ? new Date(order.createdDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const storeLogo = resolveMediaUrl(order.storeLogo);

  const status = isCancelled
    ? {
        box: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
        title: "text-red-800 dark:text-red-300",
        subtitle: "text-red-700/80 dark:text-red-400/80",
        icon: <XCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />,
        titleText: "ORDER CANCELLED",
        subtitleText: "ការបញ្ជាទិញត្រូវបានបោះបង់",
      }
    : isPayLater
      ? {
          box: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
          title: "text-amber-800 dark:text-amber-300",
          subtitle: "text-amber-700/80 dark:text-amber-400/80",
          icon: <Clock className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />,
          titleText: "PAYMENT DUE",
          subtitleText: "មិនទាន់ទូទាត់ · balance due at settlement",
        }
      : isPending
        ? {
            box: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
            title: "text-amber-800 dark:text-amber-300",
            subtitle: "text-amber-700/80 dark:text-amber-400/80",
            icon: <Clock className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />,
            titleText: "PAYMENT PENDING",
            subtitleText: "ការទូទាត់កំពុងរង់ចាំ",
          }
        : {
            box: "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30",
            title: "text-emerald-800 dark:text-emerald-300",
            subtitle: "text-emerald-700/80 dark:text-emerald-400/80",
            icon: <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />,
            titleText: "PAYMENT SUCCESSFUL",
            subtitleText: "ការទូទាត់បានជោគជ័យ",
          };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8 md:py-12 dark:bg-background print:bg-white print:p-0">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="mx-auto mb-8 max-w-xl flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/payment-history"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition-colors hover:text-green-600 dark:text-muted-foreground dark:hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payment History
        </Link>

        {/* window.print() has nothing to do inside Telegram's in-app
            WebView — there is no printer dialog to open there. */}
        {!isTma && (
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              className="h-11 gap-2 rounded-full bg-green-600 px-5 text-sm font-semibold text-white shadow-md hover:bg-green-700 dark:bg-primary dark:text-primary-foreground"
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </Button>
          </div>
        )}
      </div>

      {/* Main E-Receipt Card */}
      <div
        ref={receiptRef}
        className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-neutral-100/80 bg-white shadow-xl dark:border-border dark:bg-card print:border-none print:shadow-none print:w-full print:max-w-none"
      >
        <div className="p-6 sm:p-8">
          {/* Store Branding Header */}
          <div className="flex flex-col items-center text-center border-b border-dashed border-neutral-200 pb-6 dark:border-border">
            {storeLogo ? (
              <Image
                src={storeLogo}
                alt={order.storeName}
                width={80}
                height={80}
                className="mb-3 size-16 rounded-2xl object-cover"
              />
            ) : (
              <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-green-50 text-lg font-black text-green-700 dark:bg-primary/10 dark:text-primary">
                {storeInitials(order.storeName)}
              </div>
            )}

            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-foreground">
              {order.storeName}
            </h1>

            {order.storeAddress && (
              <p className="mt-1 text-xs text-neutral-500 dark:text-muted-foreground">
                {order.storeAddress}
              </p>
            )}

            {order.storePhone && (
              <p className="text-xs text-neutral-500 dark:text-muted-foreground">
                Phone: {order.storePhone}
              </p>
            )}
          </div>

          {/* Receipt Title */}
          <div className="pt-5 pb-1 text-center">
            <p className="text-lg font-black tracking-[0.25em] text-neutral-900 dark:text-foreground">
              RECEIPT
            </p>
            <p className="text-xs text-neutral-400 dark:text-muted-foreground">
              បង្កាន់ដៃ
            </p>
          </div>

          {/* Status Banner */}
          <div className={`mt-4 flex items-center justify-center gap-2.5 rounded-2xl border p-3 text-center ${status.box}`}>
            {status.icon}
            <div>
              <p className={`text-sm font-black tracking-wide ${status.title}`}>
                {status.titleText}
              </p>
              <p className={`text-[11px] ${status.subtitle}`}>{status.subtitleText}</p>
            </div>
          </div>

          {/* Invoice Information */}
          <div className="my-6 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <BiLabel en="Receipt No." km="លេខវិក្កយបត្រ" className="text-neutral-400" />
              <span className="font-mono text-sm font-bold text-neutral-900 dark:text-foreground">
                {order.invoiceNumber}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <BiLabel en="Date" km="កាលបរិច្ឆេទ" className="text-neutral-400" />
              <span className="font-medium text-neutral-900 dark:text-foreground">
                {formattedDate}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <BiLabel en="Ref" km="លេខយោង" className="text-neutral-400" />
              <span className="font-medium text-neutral-900 dark:text-foreground">
                {order.channel === "WEB" ? "Storefront web order" : order.channel}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <BiLabel en="Payment" km="វិធីទូទាត់" className="text-neutral-400" />
              <span
                className={`flex items-center gap-1.5 font-semibold ${isPayLater ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-primary"}`}
              >
                {order.paymentMethod || "Bakong KHQR"}
                {isPayLater && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                    UNPAID
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <BiLabel en="Customer" km="អតិថិជន" className="text-neutral-400" />
              <span className="font-medium text-neutral-900 dark:text-foreground">
                {order.customerName || "Valued Customer"}
              </span>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="my-6">
            <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              <span>Item / Service</span>
              <div className="flex gap-6">
                <span className="w-8 text-right">Qty</span>
                <span className="w-16 text-right">Amount</span>
              </div>
            </div>

            <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 dark:divide-border dark:border-border dark:bg-neutral-900/30">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="flex-1 pr-4">
                    <p className="text-sm font-semibold text-neutral-800 dark:text-foreground">
                      {item.itemName}
                    </p>
                    {item.selections && item.selections.length > 0 ? (
                      <p className="text-xs text-neutral-500 dark:text-muted-foreground">
                        {item.selections.join(" · ")}
                      </p>
                    ) : null}
                    <p className="text-xs text-neutral-400">
                      {formatMoney(item.unitPrice, order.currency)} ea
                    </p>
                    {item.freeQuantity && item.freeQuantity > 0 ? (
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {item.freeQuantity} FREE
                      </p>
                    ) : item.discountAmount && item.discountAmount > 0 ? (
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.discountLabel ? `${item.discountLabel} · ` : ""}
                        -{formatMoney(item.discountAmount, order.currency)}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex gap-6">
                    <span className="w-8 text-right text-sm text-neutral-500 dark:text-muted-foreground">
                      {item.quantity}
                    </span>
                    <span className="w-16 text-right font-bold text-neutral-900 dark:text-foreground">
                      {formatMoney(item.lineTotal, order.currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary Breakdown */}
          <div className="space-y-2 border-t border-dashed border-neutral-200 pt-4 dark:border-border">
            <div className="flex justify-between text-xs text-neutral-500 dark:text-muted-foreground">
              <BiLabel en="Subtotal" km="សរុបដើម" />
              <span className="font-medium text-neutral-900 dark:text-foreground">
                {formatMoney(order.subtotal, order.currency)}
              </span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between items-center text-xs text-emerald-600 dark:text-emerald-400">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <BiLabel en="Discount" km="បញ្ចុះតម្លៃ" />
                  <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    {order.discountLabel || (order.subtotal > 0 ? `${Math.round((order.discountAmount / order.subtotal) * 100)}% OFF` : "Savings")}
                  </span>
                </div>
                <span className="font-semibold">
                  -{formatMoney(order.discountAmount, order.currency)}
                </span>
              </div>
            )}

            {isTaxActive && !isTaxInclusive && (
              <div className="flex justify-between text-xs text-neutral-500 dark:text-muted-foreground">
                <BiLabel en="Amount Excl. Tax" km="សរុបមិនទាន់គិតអាករ" />
                <span className="font-medium text-neutral-900 dark:text-foreground">
                  {formatMoney(afterDiscount, order.currency)}
                </span>
              </div>
            )}

            {isTaxActive && !isTaxInclusive && (
              <div className="flex justify-between items-center text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                <BiLabel
                  en={`+ ${effectiveTaxName}${taxRate > 0 ? ` (${taxRate}%)` : ""}`}
                  km="អាករ"
                />
                <span className="font-bold">
                  +{formatMoney(taxAmount, order.currency)}
                </span>
              </div>
            )}
          </div>

          {/* Total Box */}
          <div
            className={`mt-3 flex items-center justify-between rounded-2xl border p-4 ${
              isPayLater
                ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
                : "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
            }`}
          >
            <BiLabel
              en="TOTAL"
              km="សរុប"
              className={`text-base font-bold ${isPayLater ? "text-amber-800 dark:text-amber-300" : "text-emerald-800 dark:text-emerald-300"}`}
            />
            <span
              className={`text-2xl font-black ${isPayLater ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}
            >
              {formatMoney(order.total, order.currency)}
            </span>
          </div>

          {/* Inclusive Tax Notice */}
          {isTaxActive && isTaxInclusive && (
            <p className="mt-2 text-center text-[11px] font-medium text-neutral-500 dark:text-muted-foreground italic">
              * Product prices include {effectiveTaxName} {taxRate > 0 ? `(${taxRate}%)` : ""} · តម្លៃរួមបញ្ចូលអាកររួចជាស្រេច
            </p>
          )}

          {/* Amount Paid / Balance Due */}
          <div className="mt-4 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <BiLabel en="Amount paid" km="បានទូទាត់" className="text-neutral-500 dark:text-muted-foreground" />
              <span className="font-medium text-neutral-900 dark:text-foreground">
                {formatMoney(amountPaid, order.currency)}
              </span>
            </div>

            <div className="flex justify-between">
              <BiLabel
                en="Balance due"
                km="ចំនួនជំពាក់"
                className={`font-bold ${balanceDue > 0 ? "text-amber-600 dark:text-amber-400" : "text-neutral-500 dark:text-muted-foreground"}`}
              />
              <span
                className={`font-bold ${balanceDue > 0 ? "text-amber-600 dark:text-amber-400" : "text-neutral-500 dark:text-muted-foreground"}`}
              >
                {formatMoney(balanceDue, order.currency)}
              </span>
            </div>
          </div>

          {/* Verification Footer & QR Stamp */}
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl bg-emerald-50/60 p-4 text-center dark:bg-emerald-950/20">
            <ShieldCheck className="h-6 w-6 text-green-600 dark:text-primary" />
            <p className="mt-1 text-xs font-semibold text-green-600 dark:text-primary">
              Official Digital Receipt Verified by FluxiBiz
            </p>
            <p className="text-[11px] text-neutral-400">
              Thank you for shopping with {order.storeName}! · សូមអរគុណ
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Links (Hidden when printing) */}
      <div className="mx-auto mt-8 flex max-w-xl justify-center gap-4 print:hidden">
        <Link href={`/store/${order.storeSlug}`}>
          <Button
            variant="outline"
            className="h-11 rounded-full border-primary bg-white px-6 font-semibold text-primary transition-colors hover:bg-primary/5 dark:bg-transparent dark:text-primary dark:hover:bg-primary/10"
          >
            Back to {order.storeName}
          </Button>
        </Link>

        <Link href="/payment-history">
          <Button className="h-11 rounded-full bg-green-600 px-6 font-semibold text-white shadow-sm hover:bg-green-700 dark:bg-primary dark:text-primary-foreground">
            View All Payments
          </Button>
        </Link>
      </div>
    </div>
  );
}