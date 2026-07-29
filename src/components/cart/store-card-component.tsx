import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockStore, StoreCardData } from "@/lib/cart/cart"
import { MapPin, Clock } from "lucide-react"
import Image from "next/image"

interface StoreCardComponentProps {
  store?: StoreCardData
}
 

export function StoreCardComponent({ store = mockStore }: StoreCardComponentProps) {
  return (
    <>
    
    <Card className="h-45 overflow-hidden p-0 dark:border-neutral-700 dark:bg-[#1b1b1b]">
  <div className="flex h-full">
    {/* Image */}
    <div className="relative h-40 w-40 overflow-hidden rounded-lg">
      <Image
        src={store.image}
        alt={store.name}
        width={180}
        height={180}
        className="h-full w-full object-cover"
      />
    </div>

    {/* Content */}
    <div className="flex flex-1 flex-col justify-center gap-2 px-6 py-6">
      <CardHeader className="gap-1 p-0">
        <CardDescription className="text-sm text-muted-foreground dark:text-[#a7b4ad]">
          {store.category}
        </CardDescription>

        <CardTitle className="text-xl font-semibold dark:text-[#f3f7f4]">
          {store.name}
        </CardTitle>
      </CardHeader>

      <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-[#a7b4ad]">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-green-600 dark:text-[#21b94b]" />
          <span>{store.location}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-green-600 dark:text-[#21b94b]" />
          <span>{store.hours}</span>
        </div>
      </div>
    </div>
  </div>
</Card>
    </>
  )
}