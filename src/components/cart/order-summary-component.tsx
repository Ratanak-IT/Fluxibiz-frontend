"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "../ui/skeleton"

interface CartItem {
  id: string
  price: number
  quantity: number
}

interface OrderSummaryData {
  items: CartItem[]
  discountAmount: number
}

export default function OrderSummaryComponent() {

  const [data, setData] = useState<OrderSummaryData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    async function fetchCartData() {
      try {
        setIsLoading(true)

        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock payload structure
        const mockPayload: OrderSummaryData = {
          items: [
            { id: "prod-1", price: 37.00, quantity: 2 }
          ],
          discountAmount: 0.00
        }

        setData(mockPayload)
      } catch (error) {
        console.error("Failed to load order summary:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCartData()
  }, [])


  const totalItemCount = data?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
  const subtotal = data?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0
  const discount = data?.discountAmount || 0
  const total = Math.max(0, subtotal - discount)

  const handleCheckout = async () => {
    setIsSubmitting(true)
    // Simulate payment gateway handoff
    await new Promise((resolve) => setTimeout(resolve, 1200))
    alert(`Proceeding to checkout with total: $${total.toFixed(2)}`)
    setIsSubmitting(false)
  }


  if (isLoading) {
    return (
      <Card className="w-full max-w-sm border-none  p-4 space-y-6">
        <Skeleton className="h-7 w-1/2 bg-neutral-200" />
        <div className="space-y-4">
          <div className="flex justify-between"><Skeleton className="h-4 w-12" /><Skeleton className="h-4 w-6" /></div>
          <div className="flex justify-between"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-12" /></div>
          <div className="flex justify-between pb-4 border-b"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-10" /></div>
          <div className="flex justify-between pt-2"><Skeleton className="h-5 w-14" /><Skeleton className="h-7 w-20" /></div>
        </div>
        <Skeleton className="h-12 w-full rounded-full bg-neutral-200" />
      </Card>
    )
  }


  return (
    <Card className=" h-85 w-100 p-4 bg-gray-100">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-xl font-bold tracking-tight text-neutral-900">
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-4 text-sm text-neutral-600">
        <div className="flex justify-between items-center">
          <span>item</span>
          <span className="font-bold text-neutral-900">{totalItemCount}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="font-bold text-neutral-900">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
          <span>Discount</span>
          <span className="font-bold text-neutral-900">${discount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-base font-bold text-neutral-900">Total</span>
          <span className="text-2xl font-bold text-emerald-600">${total.toFixed(2)}</span>
        </div>
      </CardContent>

      <CardAction className="p-0 mt-6">
        <Button
          onClick={handleCheckout}
          disabled={isSubmitting || totalItemCount === 0}
          className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors"
        >
          {isSubmitting ? "Processing..." : "Checkout"}
        </Button>
      </CardAction>
    </Card>
  )
}
