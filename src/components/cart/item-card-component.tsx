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
  <Card className="h-33.5 w-204.75 overflow-hidden border-0 bg-gray-100 p-0 dark:bg-card">
  <div className="grid h-full grid-cols-[110px_1fr_96px_150px] items-center gap-4 px-4">
    {/* Image — fixed column */}
    <div className="relative h-25 w-full overflow-hidden rounded-lg">
      <Image
        src={item.image}
        alt={item.name}
        width={110}
        height={110}
        className="h-full w-full object-cover"
      />
    </div>

    {/* Title, description, badges — the ONLY flexible column */}
    <div className="flex min-w-0 flex-col gap-1.5 overflow-hidden">
      <CardHeader className="gap-1 p-0">
        <CardTitle className="truncate text-xl font-semibold dark:text-card-foreground">
          {item.name}
        </CardTitle>

        <CardDescription className="truncate text-sm dark:text-muted-foreground">
          {item.description}
        </CardDescription>
      </CardHeader>

      <div className="flex flex-nowrap gap-2 overflow-x-auto [scrollbar-width] [&::-webkit-scrollbar]:hidden">
        {item.badges.map((badge, index) => (
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

    {/* Quantity stepper — fixed column */}
    <div className="flex items-center justify-center gap-4">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-6 w-6 text-yellow-400 dark:border-border dark:bg-card dark:text-secondary"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>

      <span className="w-4 text-center text-md font-medium dark:text-card-foreground">
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
    <div className="flex items-center justify-end gap-6">
      <span className="whitespace-nowrap text-xl font-semibold text-red-500 dark:text-destructive">
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
</Card>
   
  )
}