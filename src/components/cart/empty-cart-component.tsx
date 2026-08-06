import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptyCartComponent() {
  const t = useTranslations("Cart");
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-gray-100 py-24 dark:bg-card">
            <ShoppingCart className="h-12 w-12 text-neutral-300 dark:text-muted-foreground" />

            <p className="text-lg font-medium text-neutral-700 dark:text-card-foreground">
                {t("emptyTitle")}
            </p>

            <p className="max-w-sm text-center text-sm text-neutral-500 dark:text-muted-foreground">
                {t("emptyDescription")}
            </p>

            <Link href="/store">
                <Button className="mt-2 h-11 rounded-full bg-green-600 px-8 font-semibold text-white hover:bg-green-700 dark:bg-primary dark:hover:bg-primary/90">
                    {t("browseShops")}
                </Button>
            </Link>
        </div>
    );
}