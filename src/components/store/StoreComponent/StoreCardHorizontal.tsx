import { Card, CardTitle } from "@/components/ui/card";
import { StoreCardComponentProps } from "./StoreCartComponent";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const StoreCardHorizontal = ({ store }: StoreCardComponentProps) => {
  const { name, category,description, location, image, isOpen } = store;

  return (
    <Card className="max-w-sm flex-row items-start gap-3 rounded-xl   ">
      {/* Logo */}
      <div className="shrink-0 overflow-hidden rounded-xl ">
        <Image
          src={image}
          width={100}
          height={100}
          alt={name}
          className="size-20 "
        />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center ">
          <CardTitle className="truncate text-base font-semibold">
            {name}
          </CardTitle>
          <span
            className={cn(
              "ml-auto size-2 shrink-0 self-center rounded-full",
              isOpen ? "bg-green-500" : "bg-muted-foreground",
            )}
          />
        </div>

        <div className="line-clamp-1 truncate text-sm text-muted-foreground">{description}</div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate">{location}</span>
        </div>
      </div>
    </Card>
  );
};

export default StoreCardHorizontal;
