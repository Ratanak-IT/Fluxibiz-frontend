"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import CartList from "@/components/cart/cart-list-component";

export default function CartPage() {
    return (
        <div className="mx-auto min-h-screen max-w-362.5">
            <div className="px-6 py-7.5 lg:mx-25">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-green-600">Your Cart</h1>

                    <Link href="/store">
                        <button
                            type="button"
                            className="flex items-center gap-1 text-xs font-medium text-green-600 hover:underline sm:text-sm"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Continue shopping
                        </button>
                    </Link>
                </div>

                <CartList />
            </div>
        </div>
    );
}