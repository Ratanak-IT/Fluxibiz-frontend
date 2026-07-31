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
    <div
      className="
        group relative mx-auto mt-3 
        w-65 cursor-pointer p-2
        overflow-hidden  rounded-lg duration-100 hover:duration-100 hover:shadow-sm  hover:scale-98 ease-out transition-transform
      
    "
    >
      {/* Store Image */}

      <div className="  relative grow  h-38 w-full overflow-hidden rounded-lg   ">
        <Image
          src={image}
          fill
          alt={`${name} cover`}
          sizes="(max-width: 768px) 50vw, 272px"
          className=" object-cover   "
        />

        {/* Discount Label */}

        {discountLabel && (
          <div
            className="
                    absolute top-2 left-2 
                    z-10 flex 
                    h-11 w-11 
                    items-center justify-center

                    rounded-full
                    text-foreground

                    text-xs font-bold

                    border-2 border-dashed 
                    border-input
                    bg-accent
                "
          >
            {discountLabel}
          </div>
        )}

        {/* Open / Closed Label */}

        <div
          className={`
                absolute top-2 right-2 
                z-10 rounded-full 
                px-3 py-1 

                text-xs font-semibold
                text-primary-foreground

                ${isOpen ? "bg-primary" : "bg-muted"}
            `}
        >
          {isOpen ? "Open" : "Closed"}
        </div>
      </div>

      {/* Store Information */}

      <CardContent className="space-y-1 p-1">
        <h3
          className="
                text-lg font-semibold 
                leading-tight 
                text-foreground
            "
        >
          {name}
        </h3>

        <p
          className="
                line-clamp-1 
                text-sm 
                text-muted-foreground
            "
        >
          {description}
        </p>

        <div className="space-y-1">
          <div
            className="
                    flex items-center gap-2 
                    text-sm 
                    text-muted-foreground
                "
          >
            <MapPin
              className="
                        h-4 w-4 
                        shrink-0 
                        text-primary
                    "
            />

            <span>{location}</span>
          </div>

          <div
            className="
                    flex items-center gap-2 
                    text-sm 
                    text-muted-foreground
                "
          >
            <Clock
              className="
                        h-4 w-4 
                        shrink-0 
                        text-primary
                    "
            />
            <span>{hours}</span>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
