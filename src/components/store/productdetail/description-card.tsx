
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import Image from "next/image";

interface DescriptionCardProps {
  title?: string;
  description?: string;
  features?: string[];
  imageSrc?: string;
  imageAlt?: string;
}

export default function DescriptionCard({
  title = "Description",
  description = "Crafted from high-quality aerospace-grade titanium, this handset delivers unmatched comfort and durability. The advanced 48MP camera system redefines photography and video.",
  features = [
    "A17 Pro chip with 6-core GPU",
    "48MP Pro camera system",
    "Titanium design, lightweight & durable",
    "All-day battery life",
    "iOS 17 with new features",
  ],
  imageSrc = "https://i.pinimg.com/1200x/89/d6/d8/89d6d825d108ec83e64725b1d49684c9.jpg",
  imageAlt = "Product",
}: DescriptionCardProps) {
  return (
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

  <Card
    className="
      grid grid-cols-1 
      overflow-hidden 
      rounded-3xl 
      border-border
      bg-card
      p-0 
      shadow-sm

      md:min-h-92 
      md:grid-cols-2
    "
  >

    <div
      className="
        flex min-h-0 flex-col 
        justify-center 
        p-6 sm:p-8 lg:p-10
      "
    >

      <CardHeader className="p-0">

        <CardTitle
          className="
            text-xl font-bold 
            text-brand
          "
        >
          {title}
        </CardTitle>


        <span
          className="
            mt-2 block h-1 
            w-10 rounded-full 
            bg-secondary
          "
        />


        <CardDescription
          className="
            mt-5 line-clamp-3 
            text-sm leading-relaxed 
            text-muted-foreground

            sm:text-base
          "
        >
          {description}
        </CardDescription>


      </CardHeader>



      <CardContent className="mt-6 space-y-3 p-0">

        {features.map((feature) => (

          <div
            key={feature}
            className="
              flex items-start 
              gap-2.5
            "
          >

            <Check
              className="
                mt-0.5 h-4 w-4 
                shrink-0 
                text-brand
              "
            />


            <span
              className="
                line-clamp-1 
                text-sm 
                text-foreground

                sm:text-base
              "
            >
              {feature}
            </span>


          </div>

        ))}

      </CardContent>

    </div>



    <div
      className="
        relative min-h-64 
        w-full shrink-0 
        overflow-hidden 
        bg-muted

        md:min-h-0
      "
    >

      <Image
        src={imageSrc}
        alt={imageAlt}
        height={368}
        width={658}
        className="h-full w-full object-cover"
      />

    </div>


  </Card>

</div>
  );
}