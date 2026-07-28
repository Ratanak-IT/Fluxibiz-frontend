import Image from "next/image";
import { Card, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Clock, MapPin } from "lucide-react";
import { mockStore, StoreCardData } from "@/lib/store/store";

interface StoreCardComponentProps {
  store?: StoreCardData;
}

export default function StoreCard({
  store = mockStore,
}: StoreCardComponentProps) {
  return (
    <div className="mb-4 px-4 sm:px-8 md:px-16 lg:px-25 ">
      <Card className="h-auto md:h-45 overflow-hidden p-0  dark:bg-neutral-900">
        <div className="flex  flex-col md:flex-row h-full">
          {/* Image */}
          <div className="relative m-2 ml-2 h-full overflow-hidden rounded-lg sm:h-56 md:h-40 w-full md:w-40  rounded-t-lg md:rounded-l-lg md:rounded-r-none">
            <Image
              src={store.image}
              alt={store.name}
              height={176}
              width={156}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-center gap-2 p-4 sm:p-6">
            <CardHeader className="gap-1 p-0">
              <CardDescription className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground">
                {store.category}
              </CardDescription>

            <CardTitle className="text-xl font-semibold">
              {store.name}
            </CardTitle>
          </CardHeader>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-green-600 dark:text-green-500 shrink-0" />
                <span className="truncate">{store.location}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-green-600 dark:text-green-500 shrink-0" />
                <span>{store.hours}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <div className="mt-4 text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground">
        {store.description}
      </div>
    </div>
  );
}
