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
  title = "Product Overview",
  description,
  features,
  imageSrc,
  imageAlt = "Product Overview",
}: DescriptionCardProps) {
  if (!description && (!features || features.length === 0)) {
    return null;
  }

  return (
    <div className="mx-auto my-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <Card className={`grid grid-cols-1 overflow-hidden rounded-3xl border-border bg-card p-0 shadow-sm ${imageSrc ? "md:min-h-80 md:grid-cols-2" : "grid-cols-1"}`}>
        <div className="flex min-h-0 flex-col justify-center p-6 sm:p-8 lg:p-10">
          <CardHeader className="p-0">
            <CardTitle className="text-xl font-bold text-[#00932A]">
              {title}
            </CardTitle>
            <span className="mt-2 block h-1 w-10 rounded-full bg-[#00932A]/30" />
            {description && (
              <CardDescription className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {description}
              </CardDescription>
            )}
          </CardHeader>

          {features && features.length > 0 && (
            <CardContent className="mt-6 space-y-3 p-0">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00932A]" />
                  <span className="text-sm text-foreground sm:text-base">
                    {feature}
                  </span>
                </div>
              ))}
            </CardContent>
          )}
        </div>

        {imageSrc && (
          <div className="relative min-h-64 w-full shrink-0 overflow-hidden bg-muted md:min-h-0">
            <Image
              src={imageSrc}
              alt={imageAlt}
              height={368}
              width={658}
              unoptimized
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </Card>
    </div>
  );
}