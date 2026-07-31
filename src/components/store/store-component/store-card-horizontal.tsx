"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { StoreCardComponentProps } from "./store-cart-component";
import Image from "next/image";
import { MapPin, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const StoreCardHorizontal = ({ store }: StoreCardComponentProps) => {
  const { name, description, location, image, isOpen } = store;
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [image]);

  return (
    <Card
      className="
        group max-w-sm 
        cursor-pointer 
        flex-row items-start 
        gap-3 
        p-2
        rounded-xl
        text-card-foreground

        hover:duration-100 hover:shadow-sm  hover:scale-99 ease-out transition-transform
    "
    >
      {/* Logo */}

      <div
        className="
            relative size-20 
            shrink-0 
            overflow-hidden 
            rounded-xl
            bg-muted flex items-center justify-center
        "
      >
        {image && !hasError ? (
          <Image
            src={image}
            unoptimized
            width={100}
            height={100}
            alt={name}
            onError={() => setHasError(true)}
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-110 h-full w-full"
          />
        ) : (
          <StoreIcon className="h-8 w-8 text-muted-foreground" />
        )}
      </div>

      {/* Content */}

      <div
        className="
            flex min-w-0 
            flex-col 
            gap-1
        "
      >
        <div className="flex items-center">
          <CardTitle
            className="
                    truncate 
                    text-base 
                    font-semibold
                    text-card-foreground
                "
          >
            {name}
          </CardTitle>

          <span
            className={cn(
              `ml-auto 
                    size-2 
                    shrink-0 
                    self-center 
                    rounded-full
                    `,
              isOpen ? "bg-primary" : "bg-muted-foreground",
            )}
          />
        </div>

        <div
          className="
                line-clamp-1 
                truncate 
                text-sm 
                text-muted-foreground"
        >
          {description}
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate">{location}</span>
        </div>
      </div>
    </Card>
  );
};

export default StoreCardHorizontal;
