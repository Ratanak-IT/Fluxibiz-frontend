import Image from "next/image";
import { Card, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Clock, MapPin } from "lucide-react";
import { mockStore, StoreCardData } from "@/lib/store/detailstore/store";


interface StoreCardComponentProps {
  store?: StoreCardData;
}

export default function StoreCard({
  store = mockStore,
}: StoreCardComponentProps) {
  return (
   <div className="mb-4 px-4 sm:px-6 md:px-12 lg:px-20">
  <Card className="overflow-hidden p-0 bg-card">
    <div className="flex flex-col sm:flex-row h-full">
      {/* Image Container */}
      <div className="relative shrink-0 p-3 sm:p-4 w-full sm:w-44 md:w-52 h-48 sm:h-auto">
        <Image
          src={store.image}
          alt={store.name}
          height={176}
          width={156}
          className="h-full w-full rounded-lg object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center gap-3 p-4 sm:p-6 sm:pl-0">
        <CardHeader className="gap-1 p-0">
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            {store.category}
          </CardDescription>

          <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
            {store.name}
          </CardTitle>
        </CardHeader>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="h-4 w-4 text-primary dark:text-primary shrink-0" />
            <span className="truncate">{store.location}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Clock className="h-4 w-4 text-primary dark:text-primary shrink-0" />
            <span>{store.hours}</span>
          </div>
        </div>
      </div>
    </div>
  </Card>

  <div className="mt-4 text-xs sm:text-sm text-muted-foreground">
    {store.description}
  </div>
</div>
  );
}
