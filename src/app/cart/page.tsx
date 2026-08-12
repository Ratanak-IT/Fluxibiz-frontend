"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import CartList from "@/components/cart/cart-list-component";
import CartSkeletonComponent from "@/components/cart/cart-skeleton-component";

export default function CartPage() {
    const t = useTranslations("Cart");

    return (
        <div className="mx-auto min-h-screen max-w-362.5">
            <div className="px-6 py-7.5 lg:mx-25">
                <div className="mb-2 flex items-center justify-between sm:mb-3">
                    <h1 className="text-3xl font-bold text-green-600">{t("title")}</h1>

                    <Link href="/store">
                        <button
                            type="button"
                            className="flex items-center gap-1 text-sm font-medium text-green-600 hover:underline"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            {t("continueShopping")}
                        </button>
                    </Link>
                </div>

                <Suspense fallback={<CartSkeletonComponent />}>
                    <CartList />
                </Suspense>
            </div>
        </div>
    );
}