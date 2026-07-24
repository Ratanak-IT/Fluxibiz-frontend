
'use client'


import CartList from "@/components/CartComponent/CartListComponent";
import OrderSummaryComponent from "@/components/CartComponent/OrderSummaryComponent";
import { StoreCardComponent } from "@/components/CartComponent/StoreCardComponent";
import { ChevronLeft } from "lucide-react";



export default function CartPage(){
    return (
        <>

        {/* <div className="mx-25 py-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-600">Your Cart</h1>
        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-green-600 hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Continue shopping
        </button>
      </div> */}
        <StoreCardComponent/>
        <CartList/>
        <OrderSummaryComponent/>
   
       
     
        </>
    )
}