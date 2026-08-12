"use client";

import { useTranslations } from "next-intl";

import Image from "next/image";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { formatMoney, resolveMediaUrl, isCartLineOutOfStock, apiErrorMessage, formatStockErrorMessage, type CartLine } from "@/lib/type/cartType";
import { markItemOutOfStock } from "@/lib/store/detailstore/detailstore";
import { toast } from "sonner";
import {
    useRemoveCartItemMutation,
    useUpdateCartItemMutation,
} from "@/features/cart/cartApi";
import { cn } from "@/lib/utils";

export default function ItemCardComponent({
    line,
    currency = "USD",
}: {
    line: CartLine;
    currency?: string;
}) {
    const tStore = useTranslations("Store");
    const [updateItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
    const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();

    const imageUrl = resolveMediaUrl(line.imageUrl);
    const busy = isUpdating || isRemoving;
    const outOfStock = isCartLineOutOfStock(line);

    return (
        <Card className={cn("w-full overflow-hidden border border-neutral-100/80 bg-white p-0 shadow-xs sm:h-33.5 dark:border-neutral-800 dark:bg-card relative", outOfStock && "opacity-90")}>
            <div className="grid h-full grid-cols-[80px_1fr] items-center gap-4 p-4 sm:grid-cols-[110px_1fr_96px_150px] sm:px-4 sm:py-0">
                {/* Image */}
                <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-neutral-100 sm:h-25 sm:w-full">
                    {outOfStock && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/25 backdrop-blur-[1.5px]">
                            <span className="rounded bg-red-600/90 px-1 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-xs">
                                {tStore("detail.outOfStock") || "Out of Stock"}
                            </span>
                        </div>
                    )}
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={line.name}
                            width={110}
                            height={110}
                            className={cn("h-full w-full object-cover", outOfStock && "filter blur-[1.5px]")}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-neutral-300" />
                        </div>
                    )}
                </div>

                {/* Title, description, badges — the only flexible column */}
                <div className="flex min-w-0 flex-col gap-1.5 overflow-hidden">
                    <CardHeader className="gap-1 p-0">
                        <div className="flex items-center gap-2">
                            <CardTitle className="truncate text-base font-semibold sm:text-xl dark:text-card-foreground">
                                {line.name}
                            </CardTitle>
                            {outOfStock && (
                                <span className="text-xs font-bold text-red-600 dark:text-red-500 shrink-0">
                                    • {tStore("detail.outOfStock") || "Out of Stock"}
                                </span>
                            )}
                        </div>

                        {line.description && (
                            <CardDescription className="truncate text-sm dark:text-muted-foreground">
                                {line.description}
                            </CardDescription>
                        )}
                    </CardHeader>

                    {line.badges.length > 0 && (
                        <div className="flex flex-nowrap gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                            {line.badges.map((badge, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="shrink-0 whitespace-nowrap rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-50 dark:border-primary/30 dark:bg-primary/15 dark:text-primary dark:hover:bg-primary/20"
                                >
                                    {badge}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <div className="mt-1 flex items-center gap-4 sm:hidden">
                        <Stepper line={line} busy={busy} outOfStock={outOfStock} onChange={updateItem} />

                        <span className="ml-auto whitespace-nowrap text-lg font-semibold text-red-500 dark:text-destructive">
                            {formatMoney(line.subtotal, currency)}
                        </span>

                        <RemoveButton
                            line={line}
                            busy={busy}
                            onRemove={() => removeItem(line.cartItemId)}
                        />
                    </div>
                </div>

                {/* Desktop columns */}
                <div className="hidden items-center justify-center gap-4 sm:flex">
                    <Stepper line={line} busy={busy} outOfStock={outOfStock} onChange={updateItem} />
                </div>

                <div className="hidden items-center justify-end gap-6 sm:flex">
                    <span className="whitespace-nowrap text-xl font-semibold text-red-500 dark:text-destructive">
                        {formatMoney(line.subtotal, currency)}
                    </span>

                    <RemoveButton
                        line={line}
                        busy={busy}
                        onRemove={() => removeItem(line.cartItemId)}
                    />
                </div>
            </div>
        </Card>
    );
}

function Stepper({
    line,
    busy,
    outOfStock,
    onChange,
}: {
    line: CartLine;
    busy: boolean;
    outOfStock?: boolean;
    onChange: (args: { cartItemId: string; quantity: number }) => any;
}) {
    const t = useTranslations("Cart");

    const handleDecrease = () => {
        const nextQty = Math.max(1, line.quantity - 1);
        const res = onChange({ cartItemId: line.cartItemId, quantity: nextQty });
        if (res && typeof res.unwrap === "function") {
            res.unwrap().catch((err: any) => {
                toast.error(apiErrorMessage(err, "Failed to update item"));
            });
        }
    };

    const handleIncrease = () => {
        const nextQty = line.quantity + 1;
        const res = onChange({ cartItemId: line.cartItemId, quantity: nextQty });
        if (res && typeof res.unwrap === "function") {
            res.unwrap().catch((err: any) => {
                const msg = formatStockErrorMessage(err, line.name);
                const lower = msg.toLowerCase();
                if (
                    lower.includes("stock") ||
                    lower.includes("enough") ||
                    lower.includes("negative") ||
                    lower.includes("unavailable")
                ) {
                    if (line.itemId) markItemOutOfStock(line.itemId);
                }
                toast.error(msg);
            });
        }
    };

    return (
        <div className="flex items-center gap-4">
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDecrease}
                disabled={busy}
                className="h-6 w-6 border-red-200/80 text-red-500 hover:bg-red-50 dark:border-red-950 dark:bg-card dark:text-red-400"
                aria-label={t("decreaseQuantity")}
            >
                <Minus className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
            </Button>

            <span className="text-md w-4 text-center font-medium dark:text-card-foreground">
                {line.quantity}
            </span>

            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleIncrease}
                disabled={busy || outOfStock}
                className="h-6 w-6 text-green-600 dark:border-border dark:bg-card dark:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={t("increaseQuantity")}
            >
                <Plus className="h-3.5 w-3.5" />
            </Button>
        </div>
    );
}

function RemoveButton({
    line,
    busy,
    onRemove,
}: {
    line: CartLine;
    busy: boolean;
    onRemove: () => void;
}) {
    const t = useTranslations("Cart");

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={busy}
            onClick={onRemove}
            className="text-red-500 hover:text-red-200 disabled:opacity-40 dark:text-destructive dark:hover:bg-destructive/10 dark:hover:text-destructive"
            aria-label={t("removeItem", { name: line.name })}
        >
            <X className="h-6 w-6 stroke-3" />
        </Button>
    );
}
