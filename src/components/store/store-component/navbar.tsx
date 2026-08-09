"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, History, User } from "lucide-react";
import CartDrawer from "@/components/common/CartDrawer";
import { useGetCartQuery } from "@/features/cart/cartApi";
import { useAuth } from "@/features/auth/useAuth";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: Home, path: "/store" },
    { label: "Cart", icon: ShoppingCart, type: "drawer" as const },
    { label: "History", icon: History, path: "/payment-history" },
    { label: "Profile", icon: User, path: "/user-profile" },
  ];

  const baseItemStyles =
    "flex flex-col items-center justify-center py-1 transition-colors group cursor-pointer text-slate-500";
  const activeItemStyles = "text-primary font-semibold";

  const { isAuthenticated } = useAuth();
  const { data: cart } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const totalItems = cart?.totalItems ?? 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 p-3 lg:hidden">
      <div className="max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border border-gray-100 px-4 py-2">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            // CART DRAWER TAB
            if (item.type === "drawer") {
              return (
                <CartDrawer key={item.label}>
                  <button type="button" className={`${baseItemStyles} w-full group-hover:text-secondary relative`}>
                    <span className="relative inline-block">
                      <Icon className="w-5 h-5 transition-all group-hover:stroke-secondary" />

                      {totalItems > 0 && (
                        <span className="absolute -right-2 top-0 flex min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                          {totalItems > 99 ? "99+" : totalItems}
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] mt-1 tracking-tight text-center truncate w-full transition-colors group-hover:text-secondary">
                      {item.label}
                    </span>
                  </button>
                </CartDrawer>
              );
            }

            // STANDARD ROUTE LINKS
            const isActive =
              item.path === "/store"
                ? pathname?.startsWith("/store")
                : pathname === item.path;

            return (
              <Link
                key={item.label}
                href={item.path}
                className={`${baseItemStyles} ${
                  isActive ? activeItemStyles : ""
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-all ${
                    isActive
                      ? "stroke-primary fill-primary/10 group-hover:stroke-secondary group-hover:fill-secondary/10"
                      : "stroke-slate-500 group-hover:stroke-secondary"
                  }`}
                />
                <span
                  className={`text-[11px] mt-1 tracking-tight text-center truncate w-full transition-colors ${
                    isActive
                      ? "text-primary group-hover:text-secondary"
                      : "text-slate-500 group-hover:text-secondary"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}