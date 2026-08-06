// product-card.tsx
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import {  Products } from "@/lib/store/productdetail/product";



interface ProductCardProps {
  item: Products;
}

export function ProductCard({ item }: ProductCardProps) {
  return (
<Card
  className="
    relative w-full overflow-hidden 
    rounded-2xl border-0 
    bg-card 
    p-5 
    shadow-sm
    sm:max-w-143 sm:h-41.25 
    lg:h-41.25 lg:w-143  ">
  <div className="flex h-full items-center justify-between gap-4">
    {/* Left Column: Details */}
    <div
      className="
        flex min-w-0 flex-1 
        flex-col justify-between 
        space-y-1.5 ">

      <CardHeader className="p-0">

        <CardTitle
          className="
            truncate 
            text-sm font-bold 
            text-foreground

            sm:text-xl " >
          {item.name}
        </CardTitle>
        <p
          className=" text-2xl font-bold 
            text-destructive sm:text-lg" >
          $ {item.price}
        </p>

        <CardDescription
          className="
            line-clamp-2 
            text-xs 
            text-muted-foreground
            sm:text-sm" >
          {item.description}
        </CardDescription>

      </CardHeader>

      <div>
        <span
          className="
            text-xs font-semibold 
            text-brand
            sm:text-sm" >
          {item.category}
        </span>
      </div>


    </div>

    <div
      className="
        relative flex 
        h-24 w-20 shrink-0 
        items-center justify-center
        sm:h-28 sm:w-24" >

      <Image
        src={item.image}
        alt={item.name}
        width={112}
        height={112}
        className="h-full w-full object-contain"
      />

      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="
          absolute 
          -bottom-1 -right-1 
          h-7 w-7 
          rounded-full
          bg-white
          text-card-foreground
          shadow-sm
          transition-transform 
          hover:scale-105 
          hover:bg-background
          sm:h-8 sm:w-8
        " aria-label={`Add ${item.name} to cart`}>
        <Plus
          className=" text-primary
            h-3.5 w-3.5 
            sm:h-4 sm:w-4
          "
        />

      </Button>
    </div>
  </div>
</Card>
  );
}