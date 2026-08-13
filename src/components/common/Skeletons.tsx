"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="max-w-xl @container overflow-hidden border-0 bg-white p-0 shadow-sm dark:bg-card">
      <div className="flex h-full min-h-25 @xs:min-h-30">
        <div className="flex min-w-0 flex-1 flex-col justify-between p-2.5 pr-2 @xs:p-3 space-y-2">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
            <Skeleton className="h-3 w-full rounded-md" />
          </div>
          <Skeleton className="h-3 w-1/4 rounded-md" />
        </div>

        <div className="relative m-2 aspect-square w-20 shrink-0 overflow-hidden rounded-lg @xs:m-2.5 @xs:w-24 @sm:w-28">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </Card>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StoreCardSkeleton() {
  return (
    <div className="mb-4 px-4 sm:px-6 md:px-12 lg:px-20">
      <Card className="overflow-hidden bg-card p-0">
        <div className="flex flex-col sm:h-44 md:flex-row">
          <div className="relative h-44 w-full shrink-0 p-3 sm:w-44 md:w-48">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>

          <div className="flex flex-1 flex-col justify-between p-4 sm:px-6 sm:py-3.5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-5 w-32 rounded-full" />
            </div>

            <div className="my-1">
              <Skeleton className="h-8 w-56 rounded-md sm:w-72" />
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function SearchFilterBarSkeleton() {
  return (
    <div className="flex w-full flex-wrap lg:flex-nowrap items-center gap-2.5 lg:gap-3 px-4 sm:px-8 md:px-16 lg:px-24">
      <Skeleton className="h-11 flex-1 min-w-[200px] rounded-xl" />
      <div className="flex items-center gap-2 shrink-0">
        <Skeleton className="h-11 w-28 rounded-xl" />
        <Skeleton className="h-11 w-28 rounded-xl" />
        <Skeleton className="h-11 w-28 rounded-xl" />
      </div>
    </div>
  );
}

export function MenuProductCardSkeleton() {
  return (
    <Card className="max-w-xl @container overflow-hidden border-0 bg-white p-0 shadow-sm dark:bg-card">
      <div className="flex h-full min-h-25 @xs:min-h-30">
        <div className="flex min-w-0 flex-1 flex-col justify-between p-2.5 pr-2 @xs:p-3 space-y-2">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
            <Skeleton className="h-3 w-full rounded-md" />
          </div>
          <Skeleton className="h-3.5 w-20 rounded-md" />
        </div>

        <div className="m-2 aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100 @xs:m-2.5 @xs:w-24 @sm:w-28 dark:bg-card">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      </div>
    </Card>
  );
}

export function MenuProductListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-20 space-y-6">
      <Skeleton className="h-8 w-36 rounded-md" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: count }).map((_, i) => (
          <MenuProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function CartSidebarSkeleton() {
  return (
    <Card className="w-full rounded-2xl border-neutral-100 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-card">
      <CardContent className="space-y-4 p-0">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        <div className="space-y-3 py-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-neutral-50 p-2 dark:bg-muted/40">
              <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        <Skeleton className="h-px w-full" />

        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-12 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function StorePageSkeleton() {
  return (
    <div className="space-y-10">
      <StoreCardSkeleton />
      <SearchFilterBarSkeleton />

      <div className="grid grid-cols-1 items-start justify-center gap-6 lg:grid-cols-[1fr_400px] lg:gap-0 lg:pr-25">
        <div className="min-w-0">
          <MenuProductListSkeleton count={4} />
        </div>

        <div className="hidden lg:block lg:pt-6">
          <CartSidebarSkeleton />
        </div>
      </div>
    </div>
  );
}

export function UserProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 2xl:max-w-[1400px]">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <Skeleton className="size-28 rounded-full sm:size-32" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-7 w-48 rounded-md" />
              <Skeleton className="h-4 w-64 rounded-md" />
            </div>
          </div>

          <Card className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-card">
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <Skeleton className="h-11 w-36 rounded-full" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function StoreCardHorizontalSkeleton() {
  return (
    <Card className="flex w-full max-w-sm gap-3 p-2 rounded-xl border border-border/20 bg-card">
      <Skeleton className="size-20 shrink-0 rounded-xl" />
      <div className="flex flex-1 flex-col gap-2 min-w-0 justify-center">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-3 w-full rounded-md" />
        <Skeleton className="h-3 w-1/2 rounded-md" />
      </div>
    </Card>
  );
}

export function StoreCardVerticalSkeleton() {
  return (
    <div className="w-[240px] sm:w-65 shrink-0 p-2 space-y-2 rounded-lg border border-border/20 bg-card">
      <Skeleton className="h-32 sm:h-38 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4 rounded-md" />
      <Skeleton className="h-3 w-1/2 rounded-md" />
      <Skeleton className="h-3 w-full rounded-md" />
      <Skeleton className="h-3 w-2/3 rounded-md" />
    </div>
  );
}

export function RecommendedRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-x-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-[280px] shrink-0 sm:w-auto sm:basis-[calc((100%-3*(--spacing(4)))/4)]"
        >
          <StoreCardHorizontalSkeleton />
        </div>
      ))}
    </div>
  );
}

export function StoreRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-x-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
      {Array.from({ length: count }).map((_, i) => (
        <StoreCardVerticalSkeleton key={i} />
      ))}
    </div>
  );
}
