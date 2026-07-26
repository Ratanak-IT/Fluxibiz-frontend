import CartList from "@/components/cart/cart-list-component";
import OrderSummaryComponent from "@/components/cart/order-summary-component";
import { StoreCardComponent } from "@/components/cart/store-card-component";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
    return (
        <div className="bg--description min-h-screen bg-gray-100">
            <div className="mx-25 py-10 ">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-green-600">
                        Your Cart
                    </h1>
                    <Link href={"/store/storeDetail"}>
                        <button
                            type="button"
                            className="flex items-center gap-1 text-sm font-medium text-green-600 hover:underline"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Continue shopping
                        </button>
                    </Link>
                </div>
                <StoreCardComponent />

                <div className="mt-6 flex items-start gap-8 pt-4">
                    <div className="flex flex-1 flex-col gap-4">
                        <CartList />
                    </div>

                    <OrderSummaryComponent />
                </div>
            </div>
        </div>
    );
}
