"use client";

import { use, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  Receipt,
  ShieldCheck,
  Store,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetOrderReceiptQuery } from "@/features/checkout/checkoutApi";
import { formatMoney, resolveMediaUrl } from "@/lib/type/cartType";

export default function ReceiptComponent({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const receiptRef = useRef<HTMLDivElement>(null);

  const { data: order, isLoading, isError } = useGetOrderReceiptQuery(orderId);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[500px] max-w-3xl items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00932A] border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading receipt details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>

        <h1 className="mt-4 text-2xl font-bold text-neutral-900 dark:text-foreground">
          Receipt Not Found
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't retrieve the details for this receipt. Please check your order history.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link href="/payment-history">
            <Button variant="outline" className="rounded-full">
              View Payment History
            </Button>
          </Link>

          <Link href="/store">
            <Button className="rounded-full bg-[#00932A] text-white hover:bg-[#007d24]">
              Return to Store
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.status === "PAID";
  const isPending = order.status === "PENDING";
  const isCancelled = order.status === "CANCELLED";

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

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8 md:py-12 dark:bg-background print:bg-white print:p-0">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="mx-auto mb-8 max-w-xl flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/payment-history"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition-colors hover:text-[#00932A] dark:text-muted-foreground dark:hover:text-[#00932A]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payment History
        </Link>

        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrint}
            className="gap-2 rounded-full bg-[#00932A] font-bold text-white shadow-sm hover:bg-[#007d24]"
          >
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
        </div>
      </div>

      {/* Main E-Receipt Card */}
      <div
        ref={receiptRef}
        className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl dark:border-border dark:bg-card print:border-none print:shadow-none print:w-full print:max-w-none"
      >
        {/* Decorative Top Banner */}
        <div className="h-3 bg-[#00932A] print:hidden" />

        <div className="p-6 sm:p-8">
          {/* Store Branding Header */}
          <div className="flex flex-col items-center text-center border-b border-dashed border-neutral-200 pb-6 dark:border-border">
            {storeLogo ? (
              <Image
                src={storeLogo}
                alt={order.storeName}
                width={80}
                height={80}
                className="mb-3 size-16 rounded-2xl object-cover shadow-sm"
              />
            ) : (
              <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-[#00932A]/10 text-[#00932A]">
                <Store className="h-7 w-7" />
              </div>
            )}

            <h1 className="text-2xl font-black text-neutral-900 dark:text-foreground">
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

            {/* Status Pill Badge */}
            <div className="mt-4">
              {isPaid && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  PAYMENT SUCCESSFUL
                </span>
              )}

              {isPending && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  <Clock className="h-4 w-4" />
                  PAYMENT PENDING
                </span>
              )}

              {isCancelled && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-4 py-1 text-xs font-bold text-red-800 dark:bg-red-950/60 dark:text-red-300">
                  <XCircle className="h-4 w-4" />
                  ORDER CANCELLED
                </span>
              )}
            </div>
          </div>

          {/* Invoice Information Grid */}
          <div className="my-6 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-medium text-neutral-400">Invoice Number</p>
              <p className="font-mono text-sm font-bold text-neutral-900 dark:text-foreground">
                {order.invoiceNumber}
              </p>
            </div>

            <div className="text-right">
              <p className="font-medium text-neutral-400">Date & Time</p>
              <p className="font-medium text-neutral-900 dark:text-foreground">
                {formattedDate}
              </p>
            </div>

            <div>
              <p className="font-medium text-neutral-400">Payment Method</p>
              <p className="font-semibold text-[#00932A]">
                {order.paymentMethod || "Bakong KHQR"}
              </p>
            </div>

            <div className="text-right">
              <p className="font-medium text-neutral-400">Customer</p>
              <p className="font-medium text-neutral-900 dark:text-foreground">
                {order.customerName || "Valued Customer"}
              </p>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="my-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
              Purchased Items
            </h3>

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
                    <p className="text-xs text-neutral-400">
                      {item.quantity} × {formatMoney(item.unitPrice, order.currency)}
                    </p>
                  </div>

                  <p className="font-bold text-neutral-900 dark:text-foreground">
                    {formatMoney(item.lineTotal, order.currency)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary Breakdown */}
          <div className="space-y-2 border-t border-dashed border-neutral-200 pt-4 dark:border-border">
            <div className="flex justify-between text-xs text-neutral-500 dark:text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-medium text-neutral-900 dark:text-foreground">
                {formatMoney(order.subtotal, order.currency)}
              </span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-xs text-emerald-600">
                <span>Discount</span>
                <span className="font-medium">
                  -{formatMoney(order.discountAmount, order.currency)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-base font-bold text-neutral-900 dark:text-foreground">
                Total Paid
              </span>
              <span className="text-2xl font-black text-[#00932A]">
                {formatMoney(order.total, order.currency)}
              </span>
            </div>
          </div>

          {/* Verification Footer & QR Stamp */}
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl bg-emerald-50/60 p-4 text-center dark:bg-emerald-950/20">
            <ShieldCheck className="h-6 w-6 text-[#00932A]" />
            <p className="mt-1 text-xs font-semibold text-[#00932A]">
              Official Digital Receipt Verified by FluxiBiz
            </p>
            <p className="text-[11px] text-neutral-400">
              Thank you for shopping with {order.storeName}!
            </p>
          </div>
        </div>

        {/* Receipt Cutout Edge Effect (Printed paper style) */}
        <div className="relative h-4 overflow-hidden bg-neutral-100 dark:bg-neutral-800 print:hidden">
          <div className="absolute inset-x-0 -bottom-2 flex justify-between gap-1">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="size-3 rotate-45 bg-white dark:bg-card" />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Links (Hidden when printing) */}
      <div className="mx-auto mt-8 flex max-w-xl justify-center gap-4 print:hidden">
        <Link href={`/store/${order.storeSlug}`}>
          <Button variant="outline" className="rounded-full">
            Back to {order.storeName}
          </Button>
        </Link>

        <Link href="/payment-history">
          <Button className="rounded-full bg-[#00932A] font-bold text-white hover:bg-[#007d24]">
            View All Payments
          </Button>
        </Link>
      </div>
    </div>
  );
}
