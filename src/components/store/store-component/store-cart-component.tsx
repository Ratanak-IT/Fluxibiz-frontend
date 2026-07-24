import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";

export interface Store {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  hours: string;
  image: string;
  discountLabel?: string;
  isOpen: boolean;
}

export interface StoreCardComponentProps {
  store: Store;
}

export function StoreCardComponent({ store }: StoreCardComponentProps) {
  const {
    name,
    category,
    description,
    location,
    hours,
    image,
    discountLabel,
    isOpen,
  } = store;

  return (
    <div className="group relative mx-auto mt-3 w-68 cursor-pointer overflow-hidden pt-0 transition-shadow ">
      {/* Store Image */}

      <div className="relative grow h-38 w-full overflow-hidden rounded-lg ">
        <Image
          src={image}
          fill
          alt={`${name} cover`}
          sizes="(max-width: 768px) 50vw, 272px"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
        />
        {/* Discount Label */}
        {discountLabel && (
          <div className="absolute top-2 left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white text-xs font-bold border-2 border-dashed border-white/80">
            {discountLabel}
          </div>
        )}
        {/* Open and Close Store Label */}
        <div
          className={`absolute top-2 right-2 z-10 rounded-full px-3 py-1 text-xs font-semibold text-white ${
            isOpen ? "bg-primary" : "bg-gray-500"
          }`}
        >
          {isOpen ? "Open" : "Closed"}
        </div>
      </div>
      {/* Some Information On Store Card */}
      <CardContent className="p-1 space-y-1">
        <h3 className="text-lg font-semibold leading-tight">{name}</h3>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {description}
        </p>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <span>{hours}</span>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
