"use client";

import Image from "next/image";
import Link from "next/link";
import { Store as StoreIcon } from "lucide-react";

import { useMiniAppMode } from "@/lib/tma/useMiniAppMode";

export function TmaNavbar({
  slug,
  businessName,
  businessLogo,
}: {
  slug: string;
  businessName: string;
  businessLogo?: string | null;
}) {
  const { queryParam } = useMiniAppMode();

  return (
    <nav className="sticky top-0 z-100 flex items-center gap-3 border-b border-border bg-background px-4 py-3">
      <Link href={`/store/${slug}?${queryParam}`} className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-muted">
          {businessLogo ? (
            <Image
              src={businessLogo}
              alt={businessName}
              fill
              unoptimized
              sizes="36px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <StoreIcon className="size-5 text-muted-foreground" />
            </div>
          )}
        </div>
        <span className="min-w-0 flex-1 truncate text-base font-semibold text-foreground">
          {businessName}
        </span>
      </Link>
    </nav>
  );
}
