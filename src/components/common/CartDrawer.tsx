"use client";

import { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    MapPin,
    Minus,
    Plus,
    ShoppingBag,
    ShoppingCart,
    Store,
    Trash2,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import {
    useGetCartQuery,
    useRemoveCartItemMutation,
    useRemoveCartStoreMutation,
    useUpdateCartItemMutation,
} from "@/features/cart/cartApi";
import { useGetActiveCheckoutQuery } from "@/features/checkout/checkoutApi";
import { useGetPublicStoreQuery } from "@/features/store-api/store-api";
import { useAuth } from "@/features/auth/useAuth";
import {
    formatMoney,
    resolveMediaUrl,
    isCartLineOutOfStock,
    apiErrorMessage,
    formatStockErrorMessage,
    billedUnitPrice,
    type CartLine,
    type StoreCart,
} from "@/lib/type/cartType";
import { markItemOutOfStock } from "@/lib/store/detailstore/detailstore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type CartDrawerProps = {
    children?: ReactNode;
    triggerClassName?: string;
    buttonClassName?: string;
    iconClassName?: string;
    iconSize?: number;
    iconTrigger?: boolean;
    variant?: "before-login" | "after-login";
};

export default function CartDrawer({
    children,
    triggerClassName,
    buttonClassName,
    iconClassName,
    iconSize = 24,
    variant = "after-login",
}: CartDrawerProps) {
    const t = useTranslations("Cart");
    const [open, setOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const { data: cart, isLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated });

    const totalItems = cart?.totalItems ?? 0;
    const isAfterLogin = variant === "after-login";

    const triggerElement = children ? (
        children as React.ReactElement
    ) : (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
                "group relative size-10 min-h-10 min-w-10 shrink-0 rounded-full !bg-transparent p-0 text-[#4b5563] shadow-none hover:!bg-transparent focus-visible:!bg-transparent active:!bg-transparent dark:!bg-transparent dark:text-white dark:hover:!bg-transparent",
                isAfterLogin ? "hover:text-secondary" : "hover:text-primary",
                buttonClassName
            )}
            aria-label={`Shopping cart with ${totalItems} items`}
        >
            <span
                aria-hidden="true"
                className="relative grid size-6 shrink-0 place-items-center"
            >
                <ShoppingCart
                    className={cn(
                        "size-6 stroke-current transition-colors duration-200",
                        isAfterLogin ? "group-hover:stroke-secondary" : "group-hover:stroke-primary",
                        iconClassName
                    )}
                    strokeWidth={2}
                />
            </span>

            {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex min-w-5 h-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-bold leading-none text-white shadow-sm ring-2 ring-white dark:ring-background">
                    {totalItems > 99 ? "99+" : totalItems}
                </span>
            )}
        </Button>
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={triggerElement} className={triggerClassName} />

            <SheetContent side="right" className="flex w-full flex-col p-0 sm:w-[440px]">
                <SheetHeader className="border-b border-neutral-200 px-5 py-4 dark:border-border">
                    <SheetTitle className="flex items-center gap-2 text-xl font-bold text-green-600">
                        {t("title")}
                        {cart && cart.storeCount > 0 && (
                            <span className="text-sm font-normal text-neutral-500 dark:text-muted-foreground">
                                · {t("shopCount", { count: cart.storeCount })}
                            </span>
                        )}
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {isLoading && <DrawerSkeleton />}

                    {!isLoading && (!cart || cart.stores.length === 0) && <EmptyState />}

                    {!isLoading && cart && cart.stores.length > 0 && (
                        <div className="flex flex-col gap-6">
                            {cart.stores.map((store) => (
                                <StoreSection
                                    key={store.businessId}
                                    store={store}
                                    onNavigate={() => setOpen(false)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {cart && cart.stores.length > 0 && (
                    <div className="border-t border-neutral-200 px-5 py-3 dark:border-border">
                        <p className="text-center text-xs leading-relaxed text-neutral-500 dark:text-muted-foreground">
                            {t("itemCount", { count: cart.totalItems })} · {t("multipleShops", { count: cart.storeCount })}
                        </p>

                        <Link
                            href="/cart"
                            onClick={() => setOpen(false)}
                            className="mt-1 block text-center text-xs font-medium text-neutral-400 underline-offset-2 hover:text-neutral-600 hover:underline dark:text-muted-foreground"
                        >
                            {t("seeSummary")}
                        </Link>
                    </div>
                )}
            </SheetContent>
        </Sheet >
    );
}

function StoreSection({
    store,
    onNavigate,
}: {
    store: StoreCart;
    onNavigate: () => void;
}) {
    const t = useTranslations("Cart");
    const [removeStore, { isLoading: isRemoving }] = useRemoveCartStoreMutation();

    const { data: publicStore } = useGetPublicStoreQuery(store.slug, { skip: !store.slug });
    const effectiveCurrency = publicStore?.displayCurrency || publicStore?.baseCurrency || store.currency || "USD";

    const logoUrl = resolveMediaUrl(store.logo);

    return (
        <section className="rounded-xl bg-white border border-neutral-100/80 p-3.5 shadow-xs dark:bg-card dark:border-neutral-800">
            <div className="mb-3 flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white border border-neutral-100">
                    {logoUrl ? (
                        <Image
                            src={logoUrl}
                            alt={store.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Store className="h-5 w-5 text-neutral-400" />
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <Link
                        href={`/store/${store.slug}`}
                        onClick={onNavigate}
                        className="block truncate text-sm font-semibold text-neutral-900 hover:underline dark:text-card-foreground"
                    >
                        {store.name}
                    </Link>

                    {store.location && (
                        <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0 text-green-600 dark:text-primary" />
                            <span className="truncate">{store.location}</span>
                        </div>
                    )}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    disabled={isRemoving}
                    onClick={() => removeStore(store.businessId)}
                    className="h-7 w-7 shrink-0 text-red-500 hover:bg-red-50 disabled:opacity-40 dark:hover:bg-destructive/10"
                    aria-label={`Remove all items from ${store.name}`}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>

            {!store.open && (
                <p className="mb-2 rounded-md bg-yellow-50 px-2 py-1.5 text-xs text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-500">
                    {t("shopClosed")}
                </p>
            )}

            <div className="flex flex-col gap-2">
                {store.items.map((line) => (
                    <LineRow
                        key={line.cartItemId}
                        line={line}
                        currency={effectiveCurrency}
                        storeSlug={store.slug}
                        onNavigate={onNavigate}
                    />
                ))}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-neutral-200 pt-3 dark:border-border">
                <span className="text-xs text-neutral-500 dark:text-muted-foreground">
                    {t("itemCount", { count: store.itemCount })}
                </span>

                <span className="text-base font-bold text-green-600 dark:text-primary">
                    {formatMoney(store.subtotal, effectiveCurrency)}
                </span>
            </div>

            <StoreCheckoutButton store={store} onNavigate={onNavigate} />
        </section>
    );
}

function StoreCheckoutButton({
    store,
    onNavigate,
}: {
    store: StoreCart;
    onNavigate: () => void;
}) {
    const t = useTranslations("Cart");
    const { data: active } = useGetActiveCheckoutQuery();

    const pending = active?.hasPendingCheckout ? active.checkout : null;
    const pendingHere = pending?.storeSlug === store.slug;
    const blockedByOther = pending && !pendingHere;

    const shell =
        "mt-3 flex h-12 w-full items-center justify-center rounded-full border text-base font-bold transition-all";

    if (!store.open) {
        return (
            <div
                className={`${shell} cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 dark:border-border dark:bg-card dark:text-muted-foreground`}
                aria-disabled="true"
            >
                {t("shopClosed")}
            </div>
        );
    }

    if (blockedByOther) {
        return (
            <div
                className={`${shell} cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 dark:border-border dark:bg-card dark:text-muted-foreground`}
                aria-disabled="true"
                title={`Finish or cancel your payment at ${pending?.storeName} first`}
            >
                {t("multipleShops", { count: 1 })}
            </div>
        );
    }

    const href = pendingHere
        ? `/store/${store.slug}/checkout`
        : `/cart?shop=${encodeURIComponent(store.slug)}`;

    return (
        <Link
            href={href}
            onClick={onNavigate}
            className={`${shell} border-primary bg-white text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-border dark:bg-background dark:text-card-foreground dark:hover:bg-card`}
        >
            {pendingHere ? t("finishPayment") : t("checkout")}
        </Link>
    );
}

function LineRow({
    line,
    currency,
    storeSlug,
    onNavigate,
}: {
    line: CartLine;
    currency: string;
    storeSlug?: string;
    onNavigate?: () => void;
}) {
    const router = useRouter();
    const tStore = useTranslations("Store");
    const [updateItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
    const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();

    const [pendingQty, setPendingQty] = useState(line.quantity);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPendingQty(line.quantity);
    }, [line.quantity]);

    const imageUrl = resolveMediaUrl(line.imageUrl);
    const busy = isUpdating || isRemoving;
    const outOfStock = isCartLineOutOfStock(line);

    const productHref = storeSlug && line.itemId ? `/store/${storeSlug}/product/${line.itemId}` : null;

    const handleNavigate = () => {
        if (productHref) {
            onNavigate?.();
            router.push(productHref);
        }
    };

    const handleDecrease = () => {
        if (pendingQty <= 1) {
            removeItem(line.cartItemId).unwrap().catch((err: any) => {
                toast.error(apiErrorMessage(err, "Failed to remove item"));
            });
        } else {
            const nextQty = pendingQty - 1;
            setPendingQty(nextQty);
            updateItem({ cartItemId: line.cartItemId, quantity: nextQty })
                .unwrap()
                .catch((err: any) => {
                    setPendingQty(line.quantity);
                    toast.error(apiErrorMessage(err, "Failed to update item"));
                });
        }
    };

    const handleIncrease = () => {
        const nextQty = pendingQty + 1;
        setPendingQty(nextQty);
        updateItem({ cartItemId: line.cartItemId, quantity: nextQty })
            .unwrap()
            .catch((err: any) => {
                setPendingQty(line.quantity);
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
    };

    // Extras included: they are billed with the line, so they show with it.
    const currentSubtotal = billedUnitPrice(line) * pendingQty;

    return (
        <div
            style={{ width: "319.72px", height: "77.99px" }}
            className={cn("flex items-center gap-3 rounded-lg bg-background p-2 border border-neutral-100/80 dark:border-neutral-800/60 dark:bg-background relative box-border overflow-hidden shrink-0", outOfStock && "opacity-90")}
        >
            <div
                onClick={handleNavigate}
                className={cn("relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-card", productHref && "cursor-pointer")}
            >
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={line.name}
                        width={56}
                        height={56}
                        className={cn("h-full w-full object-cover", outOfStock && "filter blur-[1.5px]")}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-neutral-300" />
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1 flex flex-col justify-center">
                <div onClick={handleNavigate} className={cn(productHref && "cursor-pointer")}>
                    <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-semibold text-neutral-900 dark:text-card-foreground">
                            {line.name}
                        </p>
                        {outOfStock && (
                            <span className="text-[10px] font-bold text-red-600 dark:text-red-500 shrink-0">
                                • {tStore("detail.outOfStock") || "Out of Stock"}
                            </span>
                        )}
                    </div>

                    {line.description && (
                        <p className="line-clamp-1 text-xs text-neutral-500 dark:text-muted-foreground">
                            {line.description}
                        </p>
                    )}
                </div>

                {line.badges.length > 0 && (
                    <div className="mt-0.5 flex flex-nowrap gap-1 overflow-hidden">
                        {line.badges.map((badge, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="shrink-0 rounded-full border border-green-200 bg-green-50 px-2 py-0 text-[10px] font-medium text-green-700 hover:bg-green-50 dark:border-primary/30 dark:bg-primary/15 dark:text-primary"
                            >
                                {badge}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="mt-1 flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDecrease}
                        disabled={busy}
                        className="h-5 w-5 border-0 text-red-500 hover:bg-red-50 dark:bg-card dark:text-red-400"
                        aria-label="Decrease quantity"
                    >
                        <Minus className="h-3 w-3 text-red-500 dark:text-red-400" />
                    </Button>

                    <span className="w-4 text-center text-sm font-medium dark:text-card-foreground">
                        {pendingQty}
                    </span>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleIncrease}
                        disabled={busy || outOfStock}
                        className="h-5 w-5 text-green-600 dark:border-border dark:bg-card dark:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                    >
                        <Plus className="h-3 w-3" />
                    </Button>

                    <span className="ml-auto whitespace-nowrap text-sm font-semibold text-red-500 dark:text-destructive">
                        {formatMoney(currentSubtotal, currency)}
                    </span>
                </div>
            </div>

            <Button
                variant="ghost"
                size="icon"
                disabled={busy}
                onClick={() => removeItem(line.cartItemId)}
                className="h-6 w-6 shrink-0 self-start text-red-500 hover:text-red-600 disabled:opacity-40 dark:text-destructive"
                aria-label={`Remove ${line.name}`}
            >
                <X className="h-4 w-4 stroke-[3]" />
            </Button>
        </div>
    );
}

function EmptyState() {
    const t = useTranslations("Cart");

    return (
        <div className="flex h-full flex-col items-center justify-center gap-3 py-16">
            <ShoppingCart className="h-10 w-10 text-neutral-300 dark:text-muted-foreground" />

            <p className="text-base font-medium text-neutral-700 dark:text-card-foreground">
                {t("emptyTitle")}
            </p>

            <p className="max-w-[260px] text-center text-sm text-neutral-500 dark:text-muted-foreground">
                {t("emptyDescription")}
            </p>
        </div>
    );
}

function DrawerSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            {[0, 1].map((group) => (
                <div key={group} className="rounded-xl bg-gray-100 p-3 dark:bg-card">
                    <div className="mb-3 flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3.5 w-32" />
                            <Skeleton className="h-2.5 w-20" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        {[0, 1].map((line) => (
                            <div
                                key={line}
                                className="flex gap-3 rounded-lg bg-white p-2 dark:bg-background"
                            >
                                <Skeleton className="h-14 w-14 rounded-md" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-3.5 w-28" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}