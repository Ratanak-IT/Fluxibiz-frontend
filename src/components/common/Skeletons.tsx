"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function MenuProductCardSkeleton() {
  return (
    <Card className="w-full overflow-hidden border-0 bg-white p-0 shadow-sm dark:bg-card">
      <div className="flex h-24 items-center sm:h-29">
        <div className="flex flex-1 flex-col justify-center space-y-1.5 p-2.5 pr-2 sm:p-3">
          <Skeleton className="h-4 w-3/4 rounded-md sm:h-4.5" />
          <Skeleton className="h-3.5 w-1/3 rounded-md sm:h-4" />
          <Skeleton className="h-3 w-5/6 rounded-md" />
        </div>

        <div className="relative m-2 aspect-square w-20 shrink-0 overflow-hidden rounded-lg sm:m-2.5 sm:w-24">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      </div>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return <MenuProductCardSkeleton />;
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          <div className="relative flex h-56 w-full shrink-0 items-center justify-center p-3.5 sm:h-44 sm:w-44 md:w-48">
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-white p-2.5 dark:bg-card">
              <Skeleton className="h-full w-full rounded-md" />
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between p-4 sm:px-6 sm:py-3.5 space-y-3 sm:space-y-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-5 w-32 rounded-full" />
            </div>

            <div className="my-1">
              <Skeleton className="h-7 w-48 rounded-md sm:h-8 sm:w-72" />
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <Skeleton className="h-4 w-36 rounded-md" />
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
    <div className="flex w-full flex-wrap lg:flex-nowrap items-center gap-2.5 lg:gap-3 px-4 sm:px-6 md:px-12 lg:px-20">
      <Skeleton className="h-11 flex-1 min-w-[200px] rounded-full" />
      <div className="flex items-center gap-2 shrink-0">
        <Skeleton className="h-11 w-28 rounded-full" />
        <Skeleton className="h-11 w-28 rounded-full" />
        <Skeleton className="h-11 w-28 rounded-full" />
      </div>
    </div>
  );
}

export function MenuProductListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="py-4 space-y-6">
      <Skeleton className="h-8 w-36 rounded-md" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: count }).map((_, i) => (
          <MenuProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function CartSidebarSkeleton() {
  return (
    <Card className="w-full gap-0 rounded-2xl border-neutral-100 bg-white p-5 pb-7 shadow-xs sm:p-6 sm:pb-8 dark:border-neutral-800 dark:bg-card">
      <CardContent className="space-y-4 p-0">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        <div className="space-y-3 py-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-neutral-50 p-2.5 dark:bg-muted/40">
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
      <div className="space-y-10">
        <StoreCardSkeleton />
        <SearchFilterBarSkeleton />
      </div>

      <div className="px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
          <div className="min-w-0 space-y-2">
            <MenuProductListSkeleton count={6} />
          </div>

          <div className="hidden lg:block lg:pt-4">
            <div className="sticky top-6">
              <CartSidebarSkeleton />
            </div>
          </div>
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
