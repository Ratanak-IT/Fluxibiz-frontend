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
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
      {tabs.map(({ key, label, icon: Icon, href }) => {
        const active = isActive(href);
        return (
          <Link
            key={key}
            href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className={`size-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
