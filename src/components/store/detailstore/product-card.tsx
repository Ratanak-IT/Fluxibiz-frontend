import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Image from "next/image"
import { MenuItemData } from "@/lib/store/detailstore/detailstore"



interface MenuProductCardProps {
  item: MenuItemData
}

export function MenuProductCard({ item }: MenuProductCardProps) {
  return (
    <Card className="group h-41.25 w-143 overflow-hidden border-0 bg-white p-0 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg dark:bg-neutral-900 sm:max-w-143">
      <div className="flex h-full">
        {/* Left: text content */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-4 pl-5 pr-3">
          <CardHeader className="gap-1 p-0">
            <CardTitle className="truncate text-3xl font-bold text-neutral-900 dark:text-neutral-50">
              {item.name}
            </CardTitle>
            <p className="text-2xl font-bold text-red-500">
              $ {item.price}
            </p>
            <CardDescription className="line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
              {item.description}
            </CardDescription>
          </CardHeader>
          <span className="text-sm font-semibold text-green-600 dark:text-green-500">
            {item.category}
          </span>
        </div>

        {/* Right: image + add button */}
        <div className="relative m-3 aspect-square h-[calc(100%-1.5rem)] shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="142px"
            className="h-full w-full object-cover"
          />
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-white text-neutral-900 shadow-md hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-800"
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

