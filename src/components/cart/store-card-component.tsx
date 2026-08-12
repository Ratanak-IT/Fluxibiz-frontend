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
        <Card className="overflow-hidden rounded-2xl p-0 dark:border-neutral-700 dark:bg-[#1b1b1b]">
            <div className="flex flex-col sm:h-45 sm:flex-row">
                <div className="relative h-40 w-40 shrink-0 self-center overflow-hidden rounded-xl bg-white sm:ml-2.5">
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
                        {finalAddress && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 shrink-0 text-green-600 dark:text-[#21b94b]" />
                                {finalGoogleMap ? (
                                    <a
                                        href={finalGoogleMap}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline text-green-600 dark:text-green-500"
                                        title={finalAddress}
                                    >
                                        <span className="line-clamp-1">{finalAddress}</span>
                                    </a>
                                ) : (
                                    <span className="line-clamp-1" title={finalAddress}>{finalAddress}</span>
                                )}
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
            </div>
        </Card>
    );
}
