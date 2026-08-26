"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, User } from "lucide-react";

/**
 * Fixed bottom tab bar — the Mini App's primary navigation instead of the
 * site's usual top-nav pattern. Standard mobile-app convention, and matches
 * what Telegram Mini Apps typically look like (the reference design this
 * was built from). Content areas need bottom padding so the last item
 * isn't hidden behind this.
 */
export function TmaBottomTabBar({ slug }: { slug: string }) {
  const pathname = usePathname();

  const tabs = [
    { key: "home", label: "Home", icon: Home, href: `/store/${slug}?tma=true` },
    { key: "categories", label: "Categories", icon: LayoutGrid, href: `/store/${slug}?tma=true#categories` },
    { key: "cart", label: "Cart", icon: ShoppingCart, href: `/store/${slug}/cart?tma=true` },
    { key: "me", label: "Me", icon: User, href: `/store/${slug}/me?tma=true` },
  ] as const;

  const isActive = (href: string) => {
    const path = href.split("?")[0];
    return pathname === path;
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 pb-[max(0.75rem,env(safe-area-inset-bottom))] px-3">
      <div className="mx-auto flex max-w-md items-center justify-between gap-1 rounded-2xl border border-border/60 bg-background/95 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        {tabs.map(({ key, label, icon: Icon, href }) => {
          const active = isActive(href);
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
