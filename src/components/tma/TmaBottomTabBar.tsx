"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt, ShoppingCart, User } from "lucide-react";

import { useMiniAppMode } from "@/lib/tma/useMiniAppMode";

/**
 * Fixed bottom tab bar — the Mini App's primary navigation instead of the
 * site's usual top-nav pattern. Standard mobile-app convention, and matches
 * what Telegram Mini Apps typically look like (the reference design this
 * was built from). Content areas need bottom padding so the last item
 * isn't hidden behind this.
 */
export function TmaBottomTabBar({ slug }: { slug: string }) {
  const pathname = usePathname();
  const { queryParam } = useMiniAppMode();

  const homePath = `/store/${slug}`;
  const tabs = [
    { key: "home", label: "Home", icon: Home, href: `${homePath}?${queryParam}`, path: homePath },
    { key: "cart", label: "Cart", icon: ShoppingCart, href: `/store/${slug}/cart?${queryParam}`, path: `/store/${slug}/cart` },
    { key: "payment", label: "Payment", icon: Receipt, href: `/store/${slug}/history?${queryParam}`, path: `/store/${slug}/history` },
    { key: "me", label: "Me", icon: User, href: `/store/${slug}/me?${queryParam}`, path: `/store/${slug}/me` },
  ] as const;

  const isActive = (path: string | null) => path !== null && pathname === path;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 pb-[max(0.75rem,env(safe-area-inset-bottom))] px-3">
      <div className="mx-auto flex max-w-md items-center justify-between gap-1 rounded-2xl border border-border/60 bg-background/95 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        {tabs.map(({ key, label, icon: Icon, href, path }) => {
          const active = isActive(path);
          return (
            <Link
              key={key}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-2 text-[11px] font-semibold transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground active:bg-muted"
              }`}
            >
              <Icon className={`size-5 ${active ? "text-primary-foreground" : "text-muted-foreground"}`} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
