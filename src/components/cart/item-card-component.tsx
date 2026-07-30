import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Minus, Plus, X } from "lucide-react"
import Image from "next/image"
import ItemCardData from "@/lib/cart/cart"

interface ItemCardComponentProps {
  item: ItemCardData
}

export default function ItemCardComponent({
  item,
}: ItemCardComponentProps) {
  return (
 <Card
      className="
        h-auto w-full flex-col gap-4 overflow-hidden border-0 bg-gray-100 p-4
        dark:bg-card
        md:h-auto md:w-full md:flex-col md:gap-3 md:p-4
        lg:flex lg:h-33.5 lg:w-204.75 lg:flex-row lg:p-0
      "
    >
      <div
        className="
          flex flex-col gap-4
          md:flex-row md:items-center md:gap-4
          lg:grid lg:h-full lg:grid-cols-[110px_1fr_96px_150px] lg:items-center lg:gap-4 lg:px-4
        "
      >
        {/* Top row on mobile: image + title/desc/badges side by side */}
        <div className="flex gap-4 md:contents lg:contents">
          {/* Image — fixed column */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg md:h-25 md:w-25 lg:h-25 lg:w-full">
            <Image
              src={item.image}
              alt={item.name}
              width={110}
              height={110}
              className="h-full w-full object-cover"
            />
          </div>
 
          {/* Title, description, badges — the ONLY flexible column */}
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 overflow-hidden md:flex-1 lg:flex-none">
            <CardHeader className="gap-1 p-0">
              <CardTitle className="truncate text-base font-semibold dark:text-card-foreground md:text-lg lg:text-xl">
                {item.name}
              </CardTitle>
 
              <CardDescription className="truncate text-xs dark:text-muted-foreground md:text-sm lg:text-sm">
                {item.description}
              </CardDescription>
            </CardHeader>
 
            <div className="flex flex-nowrap gap-2 overflow-x-auto [scrollbar-width] [&::-webkit-scrollbar]:hidden">
              {item.badges.map((badge: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="shrink-0 whitespace-nowrap rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-50 dark:border-primary/30 dark:bg-primary/15 dark:text-primary dark:hover:bg-primary/20"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </div>
 
        {/* Bottom row on mobile: quantity stepper + price/remove side by side */}
        <div className="flex items-center justify-between md:contents lg:contents">
          {/* Quantity stepper — fixed column */}
          <div className="flex items-center justify-center gap-3 md:gap-4 lg:gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-6 w-6 text-yellow-400 dark:border-border dark:bg-card dark:text-secondary"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
 
            <span className="w-4 text-center text-sm font-medium dark:text-card-foreground md:text-md lg:text-md">
              1
            </span>
 
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-6 w-6 text-green-600 dark:border-border dark:bg-card dark:text-primary"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
 
          {/* Price + remove */}
          <div className="flex items-center justify-end gap-3 md:gap-6 lg:gap-6">
            <span className="whitespace-nowrap text-lg font-semibold text-red-500 dark:text-destructive md:text-xl lg:text-xl">
              ${item.price.toFixed(2)}
            </span>
 
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-200 dark:text-destructive dark:hover:bg-destructive/10 dark:hover:text-destructive"
              aria-label="Remove item"
            >
              <X className="h-6 w-6 stroke-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
   
  )
}