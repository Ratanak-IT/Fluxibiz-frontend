import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock } from "lucide-react"
import Image from "next/image"

export function StoreCardComponent() {
  return (
    <>
    
    <Card className=" h-45 w-309.75 overflow-hidden p-0">
      <div className="flex h-full">
        {/* Image */}
        <div className="relative h-45 w-45 shrink-0 bg-white">
          <Image
            src="https://i.pinimg.com/control1/1200x/3a/63/13/3a63135dd9749486af01c7acdb321c5e.jpg"
            alt="KFC Cambodia logo"
            width={180}
            height={180}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center gap-2 px-6 py-6">
          <CardHeader className="gap-1 p-0">
            <CardDescription className="text-sm text-muted-foreground">
              Fast Food
            </CardDescription>

            <CardTitle className="text-xl font-semibold">
              KFC Cambodia
            </CardTitle>
          </CardHeader>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-green-600" />
              <span>Boeng Keng Kang 1</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-green-600" />
              <span>07:00 AM – 10:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
    </>
  )
}