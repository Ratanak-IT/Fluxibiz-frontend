import Image from "next/image";
import { Card, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Clock, ImageOff, MapPin } from "lucide-react";
import { StoreCardData } from "@/lib/store/store";

interface StoreCardComponentProps {
  store?: StoreCardData;
}

export default function StoreCard({ store }: StoreCardComponentProps) {
  if (!store) {
    return (
      <div className="mb-4 px-4 sm:px-6 md:px-12 lg:px-20">
        <Card className="overflow-hidden bg-card p-0">
          <div className="flex h-40 animate-pulse flex-col gap-3 p-4 sm:flex-row">
            <div className="h-32 w-full rounded-lg bg-muted sm:w-44" />
            <div className="flex flex-1 flex-col justify-center gap-3">
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-5 w-48 rounded bg-muted" />
              <div className="h-3 w-64 rounded bg-muted" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const imageUrl = store.image?.trim() ? store.image : null;

  return (
    <div className="mb-4 px-4 sm:px-6 md:px-12 lg:px-20">
      <Card className="overflow-hidden bg-card p-0">
        <div className="flex h-full flex-col sm:flex-row">
          <div className="relative h-48 w-full shrink-0 p-3 sm:h-auto sm:w-44 sm:p-4 md:w-52">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={store.name || "Store logo"}
                height={176}
                width={156}
                unoptimized
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted">
                <ImageOff className="h-6 w-6 text-neutral-300" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-center gap-3 p-4 sm:p-6 sm:pl-0">
            <CardHeader className="gap-1 p-0">
              <CardDescription className="text-xs text-muted-foreground sm:text-sm">
                {store.category}
              </CardDescription>

              <CardTitle className="text-lg font-semibold sm:text-xl md:text-2xl">
                {store.name}
              </CardTitle>
            </CardHeader>

            <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-6 sm:text-sm">
              <div className="flex min-w-0 items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0 text-primary dark:text-primary" />
                <span className="truncate">{store.location}</span>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <Clock className="h-4 w-4 shrink-0 text-primary dark:text-primary" />
                <span>{store.hours}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {store.description && (
        <div className="mt-4 text-xs text-muted-foreground sm:text-sm">
          {store.description}
        </div>
      )}
    </div>
  );
}