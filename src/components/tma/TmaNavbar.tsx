"use client";

import Image from "next/image";
import Link from "next/link";
import { Store as StoreIcon } from "lucide-react";

/**
 * The Mini App's own top bar — replaces the site-wide Navbar (hidden via
 * useIsTma in Navbar.tsx). Shows only *this* business's identity: no link
 * to other businesses or the general /store directory, since a Telegram
 * bot's Mini App is scoped to the one business that bot belongs to. The
 * logo/name is a link back to that business's own home — never the
 * general /store directory.
 */
export function TmaNavbar({
  slug,
  businessName,
  businessLogo,
}: {
  slug: string;
  businessName: string;
  businessLogo?: string | null;
}) {
  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background px-4 py-3">
      <Link href={`/store/${slug}?tma=true`} className="flex min-w-0 flex-1 items-center gap-3">
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
    </div>
  );
}
