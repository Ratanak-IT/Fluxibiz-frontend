import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMiniAppMode } from "@/lib/tma/useMiniAppMode";

export default function EmptyCartComponent({ shopSlug }: { shopSlug?: string } = {}) {
  const t = useTranslations("Cart");
    const { isMiniApp, queryParam } = useMiniAppMode();
    const browseHref = isMiniApp && shopSlug ? `/store/${shopSlug}?${queryParam}` : "/store";
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-gray-100 py-24 dark:bg-card">
            <ShoppingCart className="h-12 w-12 text-neutral-300 dark:text-muted-foreground" />

            <p className="text-lg font-medium text-neutral-700 dark:text-card-foreground">
                {t("emptyTitle")}
            </p>

            <p className="max-w-sm text-center text-sm text-neutral-500 dark:text-muted-foreground">
                {t("emptyDescription")}
            </p>

            <Link href={browseHref}>
                <Button className="mt-2 h-11 rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary/90">
                    {t("browseShops")}
                </Button>
            </Link>
        </div>
    );
}