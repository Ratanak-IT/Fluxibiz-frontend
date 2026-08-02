import CartList from "@/components/cart/cart-list-component";
import OrderSummaryComponent from "@/components/cart/order-summary-component";
import { StoreCardComponent } from "@/components/cart/store-card-component";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
    return (
        <div className="mx-auto min-h-screen max-w-362.5 dark:bg-background">
            <div className="px-4 py-5 sm:px-6 sm:py-6 md:px-10 md:py-7 lg:mx-25 lg:px-0 lg:py-7.5">
                <div className="mb-4 flex items-center justify-between sm:mb-6">
                    <h1 className="text-xl font-bold text-primary sm:text-2xl lg:text-3xl">
                        Your Cart
                    </h1>
                    <Link href={"/store/storeDetail"}>
                        <button
                            type="button"
                            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline sm:text-sm"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Continue shopping
                        </button>
                        
                    </Link>
                </div>
                <StoreCardComponent />

                <div className="mt-6 flex flex-col items-stretch gap-6 pt-2 lg:flex-row lg:items-start lg:gap-8">
                    <div className="flex flex-1 flex-col gap-4">
                        <CartList />
                    </div>

                    <OrderSummaryComponent />
                </div>
            </div>
        </div>
    );
}