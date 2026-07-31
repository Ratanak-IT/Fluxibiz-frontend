"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";


interface CartSidebarProps {
  subtotal?: number;
}

export default function CartSidebar({ subtotal = 0 }: CartSidebarProps) {
  return (
   <Card className="w-full  gap-0 rounded-2xl border-neutral-100  shadow-sm dark:border-neutral-800 dark:bg-card sm:p-5">
      <CardContent className="space-y-4 p-0">
 
        {/* Empty cart state */}
        {subtotal === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <p className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
              Hungry?
            </p>
            <p className="mt-2 max-w-55 text-sm text-neutral-500 dark:text-neutral-400">
              You haven&apos;t added anything to your cart!
            </p>
          </div>
        ) : (
          <div className="py-4">{/* cart line items go here */}</div>
        )}
 
        <Separator />
 
        {/* Summary + checkout */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Total</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-50">
              $ {subtotal.toFixed(2)}
            </span>
          </div>
 
          <Button
            variant="link"
            className="h-auto p-0 text-sm font-medium text-primary"
          >
            See Summary
          </Button>
 
          <Button
            className="w-full rounded-full bg-primary"
           
            variant="secondary"
            disabled={subtotal === 0}
          >
            Review Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}