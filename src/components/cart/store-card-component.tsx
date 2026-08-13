"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Store } from "lucide-react";

import { resolveMediaUrl, type StoreCart } from "@/lib/type/cartType";
import { useGetPublicStoreQuery } from "@/features/store-api/store-api";

export function StoreCardComponent({ store }: { store: StoreCart }) {
    const { data: storeDetail } = useGetPublicStoreQuery(store.slug, { skip: !store.slug });

    const logoUrl = resolveMediaUrl(store.logo);

    const finalAddress = storeDetail?.address || store.location;
    const finalGoogleMap = storeDetail?.googleMap;

    return (
        <Card className="overflow-hidden rounded-2xl p-3.5 sm:p-0 bg-white border border-neutral-100/80 shadow-xs dark:border-neutral-700 dark:bg-[#1b1b1b]">
            <div className="flex flex-row items-center gap-4 sm:flex sm:h-45 sm:flex-row sm:gap-0">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-white sm:h-40 sm:w-40 sm:ml-2.5 sm:self-center">
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
                            <Store className="h-8 w-8 sm:h-10 sm:w-10 text-neutral-300" />
                        </div>
                    )}
                </div>

                <div className="flex flex-1 flex-col justify-center gap-1 sm:gap-2 min-w-0 sm:px-6 sm:py-6">
                    <CardHeader className="gap-0.5 sm:gap-1 p-0">
                        {store.category && (
                            <CardDescription className="text-xs sm:text-sm text-muted-foreground dark:text-[#a7b4ad] truncate">
                                {store.category}
                            </CardDescription>
                        )}

                        <CardTitle className="text-base sm:text-xl font-semibold dark:text-[#f3f7f4] truncate">
                            <Link href={`/store/${store.slug}`} className="hover:underline">
                                {store.name}
                            </Link>
                        </CardTitle>
                    </CardHeader>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground dark:text-[#a7b4ad]">
                        {finalAddress && (
                            <div className="flex items-center gap-1.5 min-w-0">
                                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-green-600 dark:text-[#21b94b]" />
                                {finalGoogleMap ? (
                                    <a
                                        href={finalGoogleMap}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline text-green-600 dark:text-green-500 truncate"
                                        title={finalAddress}
                                    >
                                        <span className="truncate">{finalAddress}</span>
                                    </a>
                                ) : (
                                    <span className="truncate" title={finalAddress}>{finalAddress}</span>
                                )}
                            </div>
                        )}

                        {store.hours && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-green-600 dark:text-[#21b94b]" />
                                <span>{store.hours}</span>
                            </div>
                        )}
                    </div>

                    {!store.open && (
                        <p className="mt-1 w-fit rounded-md bg-yellow-50 px-2 py-0.5 text-[11px] sm:text-xs text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-500">
                            This shop is closed right now.
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}