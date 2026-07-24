"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  ShoppingCart,
  UserRound,
} from "lucide-react";

import englishFlag from "../../../public/image/flags/english.png";
import khmerFlag from "../../../public/image/flags/khmer.png";
import fluxibizLogo from "../../../public/image/logo.png";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/common/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavbarAfterLoginComponentProps = {
  user?: {
    name: string;
    email: string;
    image?: string;
  };
  cartCount?: number;
  onLogout?: () => void;
};

const navigationItems = [
  {
    label: "Business",
    href: "#business",
    children: [
      {
        label: "Retail Business",
        href: "/business/retail",
      },
      {
        label: "Restaurant",
        href: "/business/restaurant",
      },
      {
        label: "Online Store",
        href: "/business/online-store",
      },
    ],
  },
  {
    label: "Feature",
    href: "#features",
    children: [
      {
        label: "Point of Sale",
        href: "/features/pos",
      },
      {
        label: "Inventory",
        href: "/features/inventory",
      },
      {
        label: "Reports",
        href: "/features/reports",
      },
    ],
  },
  {
    label: "Store",
    href: "/store",
  },
  {
    label: "About us",
    href: "/about",
  },
];

export default function NavbarAfterLoginComponent({
  user = {
    name: "FluxiBiz User",
    email: "user@fluxibiz.com",
    image: "https://media.easy-peasy.ai/4e600a82-8aac-4abb-95cd-f87cc9125a0f/18ea5802-d34e-4fbb-91e2-99baebb2eac9_medium.webp",
  },
  cartCount = 3,
  onLogout,
}: NavbarAfterLoginComponentProps) {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 text-foreground shadow-sm shadow-black/5 backdrop-blur supports-[backdrop-filter]:bg-background/85 dark:shadow-black/25"
    >
      <div
        className="mx-auto flex h-[89px] max-w-[1240px] items-center justify-between px-5 sm:px-8"
      >
        {/* Logo */}
        <Link href="/" aria-label="FluxiBiz home">
          <Image
            src={fluxibizLogo}
            alt="FluxiBiz"
            width={180}
            height={70}
            priority
            className="h-auto w-[110px] object-contain"
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-11 lg:flex">
          {navigationItems.map((item) =>
            item.children ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground"
                >
                  {item.label}
                  <ChevronDown size={16} />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="min-w-52">
                  {item.children.map((child) => (
                    <DropdownMenuItem
                      key={child.label}
                      render={<Link href={child.href} />}
                    >
                      {child.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <LanguageDropdown />

          <CartButton cartCount={cartCount} />

          <UserDropdown user={user} onLogout={onLogout} />
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <CartButton cartCount={cartCount} />

          <ThemeToggle />

          <Sheet>
            <SheetTrigger
              render={<Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
              />}
            >
              <Menu size={24} />
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[360px]">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Image
                    src={fluxibizLogo}
                    alt="FluxiBiz"
                    width={145}
                    height={60}
                    className="h-auto w-[130px] object-contain"
                  />
                </SheetTitle>
              </SheetHeader>

              <div className="mt-8 flex flex-col gap-2">
                <div className="mb-5 flex items-center gap-3 rounded-xl bg-muted p-3">
                  <Avatar className="size-11">
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name} />
                    )}
                    <AvatarFallback>
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                {navigationItems.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      {item.label}
                    </Link>

                    {item.children && (
                      <div className="ml-4 border-l border-border pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="my-3 border-t border-border" />

                <ThemeToggle mobile />

                <LanguageDropdown mobile />

                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-foreground hover:bg-muted"
                >
                  <UserRound size={19} />
                  Profile
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-foreground hover:bg-muted"
                >
                  <Settings size={19} />
                  Settings
                </Link>

                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut size={19} />
                  Logout
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function CartButton({ cartCount }: { cartCount: number }) {
  return (
    <Button
      render={
        <Link
          href="/checkout"
          aria-label={`Shopping cart with ${cartCount} items`}
        />
      }
      variant="ghost"
      size="icon"
      className="relative rounded-full"
    >
      <ShoppingCart size={25} />

        {cartCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white"
          >
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
    </Button>
  );
}

function UserDropdown({
  user,
  onLogout,
}: {
  user: {
    name: string;
    email: string;
    image?: string;
  };
  onLogout?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button
          type="button"
          variant="ghost"
          className="h-auto rounded-full p-1"
          aria-label="Open user menu"
        />}
      >
          <Avatar className="size-11 border border-border">
            {user.image && <AvatarImage src={user.image} alt={user.name} />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs font-normal text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          render={<Link href="/profile" />}
          className="cursor-pointer gap-2"
        >
          <UserRound size={17} />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          render={<Link href="/settings" />}
          className="cursor-pointer gap-2"
        >
          <Settings size={17} />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut size={17} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LanguageDropdown({ mobile = false }: { mobile?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button
          type="button"
          variant="ghost"
          className={
            mobile
              ? "w-full justify-start gap-2"
              : "h-10 gap-2 rounded-full px-2"
          }
        />}
      >
          <Image
            src={englishFlag}
            alt="English"
            width={34}
            height={24}
            className="h-5 w-8 rounded-sm object-cover"
          />

          {mobile && <span>English</span>}

          <ChevronDown size={16} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align={mobile ? "start" : "end"}>
        <DropdownMenuItem className="gap-3">
          <Image
            src={englishFlag}
            alt=""
            width={28}
            height={20}
            className="h-4 w-7 rounded-sm object-cover"
          />
          English
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-3">
          <Image
            src={khmerFlag}
            alt=""
            width={28}
            height={20}
            className="h-4 w-7 rounded-sm object-cover"
          />
          Khmer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
