"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Trash2, Store } from "lucide-react";

import { resolveMediaUrl, type StoreCart } from "@/lib/type/cartType";
import { useRemoveCartStoreMutation } from "@/features/cart/cartApi";

export function StoreCardComponent({ store }: { store: StoreCart }) {
    const [removeStore, { isLoading: isRemoving }] = useRemoveCartStoreMutation();

    const logoUrl = resolveMediaUrl(store.logo);

    return (
        <Card className="overflow-hidden p-0 dark:border-neutral-700 dark:bg-[#1b1b1b]">
            <div className="flex flex-col sm:h-45 sm:flex-row">
                <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-lg bg-white">
                    {logoUrl ? (
                        <Image
                            src={logoUrl}
                            alt={store.name}
                            width={180}
                            height={180}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Store className="h-10 w-10 text-neutral-300" />
                        </div>
                    )}
                </div>

                <div className="flex flex-1 flex-col justify-center gap-2 px-6 py-6">
                    <CardHeader className="gap-1 p-0">
                        {store.category && (
                            <CardDescription className="text-sm text-muted-foreground dark:text-[#a7b4ad]">
                                {store.category}
                            </CardDescription>
                        )}

                        <CardTitle className="text-xl font-semibold dark:text-[#f3f7f4]">
                            <Link href={`/store/${store.slug}`} className="hover:underline">
                                {store.name}
                            </Link>
                        </CardTitle>
                    </CardHeader>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground dark:text-[#a7b4ad]">
                        {store.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 shrink-0 text-green-600 dark:text-[#21b94b]" />
                                <span>{store.location}</span>
                            </div>
                        )}

                       
                        {store.hours && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 shrink-0 text-green-600 dark:text-[#21b94b]" />
                                <span>{store.hours}</span>
                            </div>
                        )}
                    </div>

                    {!store.open && (
                        <p className="w-fit rounded-md bg-yellow-50 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-500">
                            This shop is closed right now.
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between gap-3 px-6 pb-4 sm:flex-col sm:items-end sm:justify-center sm:pb-0">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-primary/15 dark:text-primary">
                        {store.itemCount} {store.itemCount === 1 ? "item" : "items"}
                    </span>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isRemoving}
                        onClick={() => removeStore(store.businessId)}
                        className="gap-1.5 whitespace-nowrap text-xs text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 dark:hover:bg-destructive/10"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove shop
                    </Button>
                </div>
            </div>
        </Card>
    );
}