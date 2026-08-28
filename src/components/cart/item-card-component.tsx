"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { formatMoney, resolveMediaUrl, isCartLineOutOfStock, apiErrorMessage, formatStockErrorMessage, freeUnitsOnLine, type CartLine } from "@/lib/type/cartType";
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
    storeSlug,
}: {
    line: CartLine;
    currency?: string;
    storeSlug?: string;
}) {
    const router = useRouter();
    const tStore = useTranslations("Store");
    const [updateItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
    const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();

    const imageUrl = resolveMediaUrl(line.imageUrl);
    const busy = isUpdating || isRemoving;
    const outOfStock = isCartLineOutOfStock(line);

    const productHref = storeSlug && line.itemId ? `/store/${storeSlug}/product/${line.itemId}` : null;
    const freeUnits = freeUnitsOnLine(line);

    const handleNavigate = () => {
        if (productHref) {
            router.push(productHref);
        }
    };

    return (
        <Card className={cn("relative w-full overflow-hidden rounded-2xl border-0 bg-gray-100 p-0 dark:bg-card", outOfStock && "opacity-90")}>
            <div className="grid h-auto grid-cols-[80px_1fr] items-center gap-3.5 p-3.5 sm:grid-cols-[100px_1fr_96px_150px] sm:gap-4 sm:p-4">
                {/* Image */}
                <div
                    onClick={handleNavigate}
                    className={cn("relative h-20 w-20 overflow-hidden rounded-xl bg-white sm:h-24 sm:w-24 shrink-0", productHref && "cursor-pointer")}
                >
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

                {/* Title, description, badges — mobile & desktop flexible column */}
                <div className="flex min-w-0 flex-col gap-1.5 overflow-hidden">
                    <CardHeader className="gap-1 p-0">
                        <div className="flex items-start justify-between gap-2">
                            <div onClick={handleNavigate} className={cn("min-w-0 flex-1", productHref && "cursor-pointer")}>
                                <CardTitle className={cn("truncate text-base font-semibold sm:text-xl dark:text-card-foreground", productHref && "hover:underline")}>
                                    {line.name}
                                </CardTitle>
                                {line.description && (
                                    <CardDescription className="truncate text-xs sm:text-sm dark:text-muted-foreground">
                                        {line.description}
                                    </CardDescription>
                                )}
                            </div>

                            {outOfStock && (
                                <span className="text-xs font-bold text-red-600 dark:text-red-500 shrink-0">
                                    • {tStore("detail.outOfStock") || "Out of Stock"}
                                </span>
                            )}

                            <RemoveButton
                                line={line}
                                busy={busy}
                                onRemove={() => removeItem(line.cartItemId)}
                                className="sm:hidden shrink-0 h-8 w-8"
                            />
                        </div>
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

                    {freeUnits > 0 ? (
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {freeUnits} FREE{line.discountLabel ? ` · ${line.discountLabel}` : ""}
                        </p>
                    ) : line.discountAmount && line.discountAmount > 0 ? (
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            {line.discountLabel ? `${line.discountLabel} · ` : ""}
                            -{formatMoney(line.discountAmount, currency)}
                        </p>
                    ) : null}

                    <div className="mt-2 flex items-center justify-between gap-2 sm:hidden">
                        <Stepper
                            line={line}
                            busy={busy}
                            outOfStock={outOfStock}
                            onChange={updateItem}
                            onRemove={() => removeItem(line.cartItemId)}
                        />

                        <span className="whitespace-nowrap text-base font-semibold text-red-500 dark:text-destructive">
                            {formatMoney(line.subtotal, currency)}
                        </span>
                    </div>
                </div>

                {/* Desktop columns — untouched */}
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
    onRemove,
}: {
    line: CartLine;
    busy: boolean;
    outOfStock?: boolean;
    onChange: (args: { cartItemId: string; quantity: number }) => any;
    onRemove?: () => { unwrap: () => Promise<unknown> };
}) {
    const t = useTranslations("Cart");

    const handleDecrease = () => {
        // Pressing "-" at 1 removes the line — the same behavior the
        // sidebar's mini-cart already has, and the more expected one
        // (the X button doing this is easy to miss, especially on the
        // narrow mobile-only layout this stepper renders in).
        if (line.quantity <= 1 && onRemove) {
            onRemove().unwrap().catch((err: unknown) => {
                toast.error(apiErrorMessage(err, "Failed to remove item"));
            });
            return;
        }
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
                variant="ghost"
                size="icon"
                onClick={handleDecrease}
                disabled={busy}
                className="h-6 w-6 border-0 text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/30 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={t("decreaseQuantity")}
            >
                <Minus className="h-3.5 w-3.5 " />
            </Button>

            <span className="text-md w-4 text-center font-medium dark:text-card-foreground">
                {line.quantity}
            </span>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleIncrease}
                disabled={busy || outOfStock}
                className="h-6 w-6 border-0 text-green-600 dark:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
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
    className,
}: {
    line: CartLine;
    busy: boolean;
    onRemove: () => void;
    className?: string;
}) {
    const t = useTranslations("Cart");

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={busy}
            onClick={onRemove}
            className={cn("text-red-500 hover:text-red-200 disabled:opacity-40 dark:text-destructive dark:hover:bg-destructive/10 dark:hover:text-destructive", className)}
            aria-label={t("removeItem", { name: line.name })}
        >
            <X className="h-4 w-4 stroke-2.5 sm:h-6 sm:w-6 sm:stroke-3" />
        </Button>
    );
}