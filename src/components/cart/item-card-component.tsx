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
    <Card className=" h-33.5  overflow-hidden border-0 p-0 bg-gray-100">
      <div className="flex h-full items-center gap-5 px-4">
        {/* Image */}
        <div className="relative shrink-0 overflow-hidden rounded-lg h-25">
          <Image
            src={item.image}
            alt={item.name}
            width={110}
            height={110}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Everything to the right of the image */}
        <div className="flex flex-1 items-center gap-20">
          {/* Title, description, badges */}
          <div className="flex flex-col gap-1.5">
            <CardHeader className="gap-1 p-0">
              <CardTitle className=" font-semibold text-xl">
                {item.name}
              </CardTitle>
              <CardDescription className="text-sm">
                {item.description}
              </CardDescription>
            </CardHeader>
            <div className="max-w-87.5 flex flex-wrap gap-2 ">
              {item.badges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-50 text-green-600  text-sm">
                    {badge}
                  </Badge>
                ))}
              {/* <Badge
                variant="outline"
                className="bg-green-50 text-green-600"
              >
                {item.badges}
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-600"
              >
                {item.badges}
              </Badge> */}
            </div>
          </div>

          {/* Quantity stepper */}
          <div className="flex items-center gap-5 ">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-6 w-6  text-yellow-400"
              aria-label="Decrease quantity"
              
            >
              <Minus className="h-3.5 w-3.5"  />
            </Button>
            <span className="w-4 text-center  text-md font-medium">1</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-6 w-6  text-green-600"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5"/>
            </Button>
          </div>

          <div className="flex items-center gap-30">
             {/* Price */}
          <span className="text-xl font-semibold text-red-500">${item.price.toFixed(2)}</span>

          {/* Remove */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-200"
            aria-label="Remove item"
          >
            <X className="h-6 w-6" />
          </Button>
            
          </div>

         
        </div>
      </div>
    </Card>
  )
}