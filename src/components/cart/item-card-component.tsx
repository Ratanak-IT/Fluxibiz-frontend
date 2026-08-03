"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { formatMoney, resolveMediaUrl, type CartLine } from "@/lib/type/cartType";
import {
    useRemoveCartItemMutation,
    useUpdateCartItemMutation,
} from "@/features/cart/cartApi";

export default function ItemCardComponent({
    line,
    currency = "USD",
}: {
    line: CartLine;
    currency?: string;
}) {
    const [updateItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
    const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();

    const imageUrl = resolveMediaUrl(line.imageUrl);
    const busy = isUpdating || isRemoving;

    return (
        <Card className="w-full overflow-hidden border-0 bg-gray-100 p-0 sm:h-33.5 dark:bg-card">
            <div className="grid h-full grid-cols-[80px_1fr] items-center gap-4 p-4 sm:grid-cols-[110px_1fr_96px_150px] sm:px-4 sm:py-0">
                {/* Image */}
                <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-white sm:h-25 sm:w-full">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={line.name}
                            width={110}
                            height={110}
                            className="h-full w-full object-cover"
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
                        <CardTitle className="truncate text-base font-semibold sm:text-xl dark:text-card-foreground">
                            {line.name}
                        </CardTitle>

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
                        <Stepper line={line} busy={busy} onChange={updateItem} />

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
                    <Stepper line={line} busy={busy} onChange={updateItem} />
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
    onChange,
}: {
    line: CartLine;
    busy: boolean;
    onChange: (args: { cartItemId: string; quantity: number }) => void;
}) {
    const [pendingQty, setPendingQty] = useState(line.quantity);

    useEffect(() => {
        setPendingQty(line.quantity);
    }, [line.quantity]);

    const handleDecrease = () => {
        const nextQty = Math.max(1, pendingQty - 1);
        setPendingQty(nextQty);
        onChange({ cartItemId: line.cartItemId, quantity: nextQty });
    };

    const handleIncrease = () => {
        const nextQty = pendingQty + 1;
        setPendingQty(nextQty);
        onChange({ cartItemId: line.cartItemId, quantity: nextQty });
    };

    return (
        <div className="flex items-center gap-4">
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDecrease}
                className="h-6 w-6 text-yellow-400 dark:border-border dark:bg-card dark:text-secondary"
                aria-label="Decrease quantity"
            >
                <Minus className="h-3.5 w-3.5" />
            </Button>

            <span className="text-md w-4 text-center font-medium dark:text-card-foreground">
                {pendingQty}
            </span>

            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleIncrease}
                className="h-6 w-6 text-green-600 dark:border-border dark:bg-card dark:text-primary"
                aria-label="Increase quantity"
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
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={busy}
            onClick={onRemove}
            className="text-red-500 hover:text-red-200 disabled:opacity-40 dark:text-destructive dark:hover:bg-destructive/10 dark:hover:text-destructive"
            aria-label={`Remove ${line.name}`}
        >
            <X className="h-6 w-6 stroke-3" />
        </Button>
    );
}