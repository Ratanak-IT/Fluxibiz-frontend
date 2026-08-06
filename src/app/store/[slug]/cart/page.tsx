"use client";

import { useTranslations } from "next-intl";

import { Suspense, use } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import CartList from "@/components/cart/cart-list-component";
import CartSkeletonComponent from "@/components/cart/cart-skeleton-component";

export default function StoreCartPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
  const t = useTranslations("Cart");
    const { slug } = use(params);

    return (
        <div className="mx-auto min-h-screen max-w-362.5 dark:bg-background">
            <div className="px-4 py-5 sm:px-6 sm:py-6 md:px-10 md:py-7 lg:mx-25 lg:px-0 lg:py-7.5">
                <div className="mb-4 flex items-center justify-between sm:mb-6">
                    <h1 className="text-xl font-bold text-primary sm:text-2xl lg:text-3xl">
                        {t("title")}
                    </h1>

                    <Link href={`/store/${slug}`}>
                        <button
                            type="button"
                            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline sm:text-sm"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            {t("continueShopping")}
                        </button>
                        
                    </Link>
                </div>

                <Suspense fallback={<CartSkeletonComponent />}>
                    <CartList shopSlug={slug} />
                </Suspense>
            </div>
        </div>
    );
}