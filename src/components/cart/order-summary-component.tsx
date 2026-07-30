"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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


  // if (isLoading) {
  //   return (
  //     <Card className="w-full max-w-sm border-none  p-4 space-y-6">
  //       <Skeleton className="h-7 w-1/2 bg-neutral-200" />
  //       <div className="space-y-4">
  //         <div className="flex justify-between"><Skeleton className="h-4 w-12" /><Skeleton className="h-4 w-6" /></div>
  //         <div className="flex justify-between"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-12" /></div>
  //         <div className="flex justify-between pb-4 border-b"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-10" /></div>
  //         <div className="flex justify-between pt-2"><Skeleton className="h-5 w-14" /><Skeleton className="h-7 w-20" /></div>
  //       </div>
  //       <Skeleton className="h-12 w-full rounded-full bg-neutral-200" />
  //     </Card>
  //   )
  // }


  return (
      <Card
        className="
          h-auto w-full bg-gray-100 p-4
          dark:bg-card
          md:h-auto md:w-full md:p-5
          lg:h-85 lg:w-100 lg:p-4
        "
      >
  <CardHeader className="mb-4 p-0 md:mb-5 lg:mb-5">
    <CardTitle className="text-lg font-bold tracking-tight text-neutral-900 dark:text-card-foreground md:text-xl lg:text-xl">
      Order Summary
    </CardTitle>
  </CardHeader>

  <CardContent className="space-y-3 p-0 text-sm text-neutral-600 dark:text-muted-foreground md:space-y-4 lg:space-y-4">
    <div className="flex items-center justify-between">
      <span>item</span>
      <span className="font-bold text-neutral-900 dark:text-card-foreground">
        {totalItemCount}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span>Subtotal</span>
      <span className="font-bold text-neutral-900 dark:text-card-foreground">
        ${subtotal.toFixed(2)}
      </span>
    </div>

    <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-border md:pb-4 lg:pb-4">
      <span>Discount</span>
      <span className="font-bold text-neutral-900 dark:text-card-foreground">
        ${discount.toFixed(2)}
      </span>
    </div>

    <div className="flex items-center justify-between pt-2">
      <span className="text-sm font-bold text-neutral-900 dark:text-card-foreground md:text-base lg:text-base">
        Total
      </span>

      <span className="text-xl font-bold text-green-600 dark:text-primary md:text-2xl lg:text-2xl">
        ${total.toFixed(2)}
      </span>
    </div>
  </CardContent>

  <CardFooter className="mt-4 p-0 md:mt-6 lg:mt-6">
    <Button
      onClick={handleCheckout}
      disabled={isSubmitting || totalItemCount === 0}
      className="h-11 w-full rounded-full bg-green-600 text-sm font-semibold text-white transition-colors hover:bg-green-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 md:h-12 md:text-base lg:h-12 lg:text-base"
    >
      {isSubmitting ? "Processing..." : "Checkout"}
    </Button>
  </CardFooter>
</Card>

  )
}