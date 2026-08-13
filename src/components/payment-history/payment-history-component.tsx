"use client";

import { useLocale, useTranslations } from "next-intl";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Receipt,
  Search,
  Store,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetOrderHistoryQuery } from "@/features/checkout/checkoutApi";
import { formatMoney, resolveMediaUrl } from "@/lib/type/cartType";
import type { OrderStatus, StorefrontOrder } from "@/lib/type/checkoutType";

export default function PaymentHistoryComponent() {
  const t = useTranslations("PaymentHistory");
  const locale = useLocale();
  const { data: orders = [], isLoading, isError, refetch } = useGetOrderHistoryQuery();

  const [activeTab, setActiveTab] = useState<"ALL" | OrderStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "ALL" || order.status === activeTab;
    const matchesSearch =
      searchQuery.trim() === "" ||
      order.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const paidCount = orders.filter((o) => o.status === "PAID").length;
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const cancelledCount = orders.filter((o) => o.status === "CANCELLED").length;

  if (isLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8 animate-pulse space-y-4">
          <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-neutral-800" />
          <div className="h-4 w-72 rounded-lg bg-gray-200 dark:bg-neutral-800" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-32 rounded-2xl bg-gray-100 dark:bg-neutral-800/50"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        {/* Page Title & Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2.5 text-2xl font-black text-neutral-900 sm:text-3xl dark:text-foreground">
              <Receipt className="h-7 w-7 text-[#00932A]" />
              {t("title")}
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <Link href="/store">
            <Button className="gap-2 rounded-full bg-[#00932A] font-bold text-white shadow-sm hover:bg-[#007d24]">
              <ShoppingBag className="h-4 w-4" />
              {t("exploreStores")}
            </Button>
          </Link>
        </div>

        {/* Search & Filter Controls */}
        <div className="mb-6 flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between">
          {/* Status Tabs */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 overflow-x-auto rounded-full bg-gray-200/70 p-1 sm:p-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden dark:bg-neutral-800">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-bold transition-all sm:px-4 ${
                activeTab === "ALL"
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-card dark:text-foreground"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-muted-foreground"
              }`}
            >
              {t("all")} ({orders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("PAID")}
              className={`flex shrink-0 whitespace-nowrap items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold transition-all sm:gap-1.5 sm:px-4 ${
                activeTab === "PAID"
                  ? "bg-[#00932A] text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-muted-foreground"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("paid")} ({paidCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("PENDING")}
              className={`flex shrink-0 whitespace-nowrap items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold transition-all sm:gap-1.5 sm:px-4 ${
                activeTab === "PENDING"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-muted-foreground"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              {t("pending")} ({pendingCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("CANCELLED")}
              className={`flex shrink-0 whitespace-nowrap items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold transition-all sm:gap-1.5 sm:px-4 ${
                activeTab === "CANCELLED"
                  ? "bg-red-500 text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-muted-foreground"
              }`}
            >
              <XCircle className="h-3.5 w-3.5" />
              {t("cancelled")} ({cancelledCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:flex-1 md:max-w-md lg:max-w-lg">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-10 w-full rounded-full border border-gray-200 bg-white pl-9 text-xs transition-colors focus-visible:border-[#00932A] focus-visible:ring-1 focus-visible:ring-[#00932A]/30 dark:border-neutral-800 dark:bg-card"
            />
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-200 bg-white p-12 text-center dark:border-border dark:bg-card">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#00932A]/10 text-[#00932A]">
              <Receipt className="h-8 w-8" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-neutral-900 dark:text-foreground">
              {t("emptyTitle")}
            </h3>

            <p className="mt-1 text-sm text-neutral-500 dark:text-muted-foreground">
              {searchQuery
                ? t("noSearchResults")
                : t("noTransactions")}
            </p>

            <Link href="/store" className="mt-6 inline-block">
              <Button className="rounded-full bg-[#00932A] px-6 text-xs font-bold text-white hover:bg-[#007d24]">
                {t("startShopping")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: StorefrontOrder }) {
  const t = useTranslations("PaymentHistory");
  const locale = useLocale();
  const storeLogo = resolveMediaUrl(order.storeLogo);

  const formattedDate = order.createdDate
    ? new Date(order.createdDate).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : t("notAvailable");

  const isPaid = order.status === "PAID";
  const isPending = order.status === "PENDING";
  const isCancelled = order.status === "CANCELLED";

  return (
    <Card className="overflow-hidden border-0 bg-white shadow-sm transition-all hover:shadow-md dark:bg-card">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Store & Order Info */}
          <div className="flex items-start gap-4">
            {storeLogo ? (
              <Image
                src={storeLogo}
                alt={order.storeName}
                width={52}
                height={52}
                className="size-13 shrink-0 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-[#00932A]/10 text-[#00932A]">
                <Store className="h-6 w-6" />
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/store/${order.storeSlug}`}
                  className="font-bold text-neutral-900 transition-colors hover:text-[#00932A] dark:text-foreground"
                >
                  {order.storeName}
                </Link>

                {/* Status Pill */}
                {isPaid && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" />
                    {t("paid")}
                  </span>
                )}

                {isPending && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    <Clock className="h-3 w-3" />
                    {t("pending")}
                  </span>
                )}

                {isCancelled && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-800 dark:bg-red-950/60 dark:text-red-300">
                    <XCircle className="h-3 w-3" />
                    {t("cancelled")}
                  </span>
                )}
              </div>

              <p className="mt-1 font-mono text-xs font-medium text-neutral-400">
                {order.invoiceNumber} • {formattedDate}
              </p>

              {/* Items summary */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-neutral-600 dark:text-muted-foreground">
                <span className="font-semibold text-neutral-900 dark:text-foreground">
                  {t("itemCount", { count: order.itemCount })}:
                </span>
                <span className="truncate max-w-xs sm:max-w-md">
                  {order.items.map((i) => i.itemName).join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* Amount & Receipt Action Button */}
          <div className="flex items-center justify-between border-t border-neutral-100 pt-3 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end">
            <div className="text-right">
              <span className="text-xs text-neutral-400">{t("total")}</span>
              <p className="text-xl font-black text-[#00932A]">
                {formatMoney(order.total, order.currency)}
              </p>
            </div>

            <div className="mt-2 flex items-center gap-2">
              {isPending && (
                <Link href={`/store/${order.storeSlug}/checkout`}>
                  <Button
                    size="sm"
                    className="h-8 rounded-full bg-amber-500 text-xs font-bold text-white hover:bg-amber-600"
                  >
                    {t("finishPayment")}
                  </Button>
                </Link>
              )}

              <Link href={`/receipt/${order.orderId}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 rounded-full border-gray-200 text-xs font-semibold hover:border-[#00932A] hover:text-[#00932A]"
                >
                  <Receipt className="h-3.5 w-3.5" />
                  {t("viewReceipt")}
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
