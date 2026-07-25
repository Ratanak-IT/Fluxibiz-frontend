import Image from "next/image";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Clock, MapPin } from "lucide-react";
import { StoreCardData } from "@/lib/store/store";



export function StoreCardComponent() {
  return (
    <>
    
    <Card className=" h-45  overflow-hidden p-0 bg-gray-100">
      <div className="flex h-full">
        {/* Image */}
        <div className="relative h-40 w-40 overflow-hidden rounded-lg">
          <Image
            src="https://www.koithe.com/en/images/a-event-7.jpg"
            alt=""
            width={180}
            height={180}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center gap-2 px-6 py-6">
          <CardHeader className="gap-1 p-0">
            <CardDescription className="text-sm text-muted-foreground">
              description
            </CardDescription>

            <CardTitle className="text-xl font-semibold">
              title 
            </CardTitle>
          </CardHeader>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-green-600" />
              <span>location</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-green-600" />
              <span>hours</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
    </>
  )
}