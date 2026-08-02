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
    
   <Card className="h-auto overflow-hidden p-0 sm:h-36 md:h-45">
  <div className="flex h-full flex-row items-center">
    {/* Image */}
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg sm:h-full sm:w-40 md:h-40 md:w-40">
      <Image
        src={store.image}
        alt={store.name}
        width={180}
        height={180}
        className="h-full w-full object-cover"
      />
    </div>

    {/* Content */}
    <div className="flex flex-1 flex-col justify-center gap-1 px-3 py-3 sm:gap-2 sm:px-5 sm:py-5 md:px-6 md:py-6">
      <CardHeader className="gap-0.5 p-0 sm:gap-1">
        <CardDescription className="text-xs text-muted-foreground sm:text-sm">
          {store.category}
        </CardDescription>

        <CardTitle className="text-base font-semibold sm:text-lg md:text-xl">
          {store.name}
        </CardTitle>
      </CardHeader>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:gap-3 sm:text-sm md:gap-4">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-green-600 sm:h-4 sm:w-4" />
          <span>{store.location}</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <Clock className="h-3.5 w-3.5 text-green-600 sm:h-4 sm:w-4" />
          <span>{store.hours}</span>
        </div>
      </div>
    </div>
  </div>
</Card>
    </>
  )
}