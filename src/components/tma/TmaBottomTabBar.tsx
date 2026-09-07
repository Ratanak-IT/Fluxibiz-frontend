"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, ShoppingCart, User } from "lucide-react";

import { useMiniAppMode } from "@/lib/tma/useMiniAppMode";

/**
 * Fixed bottom tab bar for Mini App (Messenger & Telegram).
 * Styled to match the store bottom nav with smooth hover transitions to secondary color.
 */
export function TmaBottomTabBar({ slug }: { slug: string }) {
  const pathname = usePathname();
  const { queryParam } = useMiniAppMode();

  const homePath = `/store/${slug}`;
  const tabs = [
    { key: "home", label: "Home", icon: Home, href: `${homePath}?${queryParam}`, path: homePath },
    { key: "cart", label: "Cart", icon: ShoppingCart, href: `/store/${slug}/cart?${queryParam}`, path: `/store/${slug}/cart` },
    { key: "history", label: "History", icon: History, href: `/store/${slug}/history?${queryParam}`, path: `/store/${slug}/history` },
    { key: "profile", label: "Profile", icon: User, href: `/store/${slug}/me?${queryParam}`, path: `/store/${slug}/me` },
  ] as const;

  const isActive = (path: string | null) => {
    if (!path || !pathname) return false;
    if (path === homePath) {
      return pathname === homePath || pathname === `${homePath}/`;
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 pb-[max(0.75rem,env(safe-area-inset-bottom))] px-3">
      <div className="mx-auto max-w-md bg-white/90 dark:bg-slate-950/90 backdrop-blur-md rounded-3xl shadow-lg border border-gray-100 dark:border-white/10 px-4 py-2">
        <div className="grid grid-cols-4 gap-1">
          {tabs.map(({ key, label, icon: Icon, href, path }) => {
            const active = isActive(path);
            return (
              <Link
                key={key}
                href={href}
                className="group flex flex-1 flex-col items-center justify-center py-1 transition-colors cursor-pointer text-slate-500 dark:text-slate-300"
              >
                <Icon
                  className={`size-5 transition-all ${
                    active
                      ? "stroke-primary fill-primary/10 group-hover:stroke-secondary group-hover:fill-secondary/10"
                      : "stroke-slate-500 dark:stroke-slate-300 group-hover:stroke-secondary"
                  }`}
                />
                <span
                  className={`mt-1 text-[11px] tracking-tight text-center truncate w-full transition-colors ${
                    active
                      ? "text-primary font-semibold group-hover:text-secondary"
                      : "text-slate-500 dark:text-slate-300 group-hover:text-secondary"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

