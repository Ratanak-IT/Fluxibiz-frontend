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
import type { SessionUser } from "@/lib/type/authType";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
import CartDrawer from "@/components/common/CartDrawer";

type NavbarAfterLoginComponentProps = {
  user: SessionUser;
  cartCount?: number;
  onLogout?: () => void;
};

type NavigationItem = {
  label: string;
  href: string;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Store",
    href: "/store",
  },
  {
    label: "Feature",
    href: "/feature",
  },
  {
    label: "Support",
    href: "/support",
  },
  {
    label: "About us",
    href: "/about",
  },
];

export default function NavbarAfterLoginComponent({
  user,
  cartCount = 0,
  onLogout,
}: NavbarAfterLoginComponentProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white  text-foreground backdrop-blur dark:bg-background">
      <div className="mx-auto flex h-[55px] max-w-[1330px] items-center justify-between px-6 sm:px-10">
        {/* Desktop Logo */}
        <Link href="/store" aria-label="FluxiBiz home">
          <Image
            src={fluxibizLogo}
            alt="FluxiBiz"
            width={240}
            height={90}
            priority
            className="h-auto w-32.5 object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 lg:flex">
          <ThemeToggle />
          <LanguageDropdown />

          <CartDrawer />
          <UserDropdown user={user} onLogout={onLogout} />
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <CartDrawer />

          <ThemeToggle />

          <Sheet>
            <SheetTrigger
              className="lg:hidden"
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-12"
                  aria-label="Open navigation menu"
                />
              }
            >
              <Menu size={32} />
            </SheetTrigger>

            <SheetContent side="right" className="w-[340px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Image
                    src={fluxibizLogo}
                    alt="FluxiBiz"
                    width={180}
                    height={80}
                    className="h-auto w-30 object-contain"
                  />
                </SheetTitle>
              </SheetHeader>

              <div className="mt-8 flex flex-col gap-2">
                <ThemeToggle mobile />

                {/* User info card */}
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted p-3">
                  <Avatar className="size-11">
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name} />
                    )}
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate font-bold text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-sm font-medium text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                {navigationItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block rounded-lg px-3 py-2.5 text-base font-bold text-foreground transition-colors hover:text-foreground dark:text-text dark:hover:text-secondary"
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="my-2 border-t border-border" />

                <LanguageDropdown mobile />

                <Link
                  href="/user-profile"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-bold text-foreground transition-colors hover:bg-muted"
                >
                  <UserRound size={19} />
                  View profile
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-bold text-foreground transition-colors hover:bg-muted"
                >
                  <Settings size={19} />
                  Settings
                </Link>

                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-base font-bold text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut size={19} />
                  Log out
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
      nativeButton={false}
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
        <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
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
  user: SessionUser;
  onLogout?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            className="h-auto rounded-full p-1"
            aria-label="Open user menu"
          />
        }
      >
        <Avatar className="size-11 border border-border">
          {user.image && <AvatarImage src={user.image} alt={user.name} />}
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {/* Wrap the label in a Group context */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1">
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* You can also wrap standard items in a group if desired */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            render={<Link href="/user-profile" />}
            className="cursor-pointer gap-2"
          >
            <UserRound size={17} />
            View profile
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link href="/settings" />}
            className="cursor-pointer gap-2"
          >
            <Settings size={17} />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut size={17} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LanguageDropdown({ mobile = false }: { mobile?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            className={
              mobile
                ? "w-full justify-start gap-3 text-base font-semibold hover:bg-transparent hover:text-inherit aria-expanded:bg-transparent aria-expanded:text-inherit"
                : "h-10 gap-2 rounded-full px-3 text-sm font-semibold hover:bg-transparent hover:text-inherit aria-expanded:bg-transparent aria-expanded:text-inherit"
            }
          />
        }
      >
        <Image
          src={englishFlag}
          alt="English"
          width={40}
          height={28}
          className="h-5 w-8  object-cover"
        />

        {mobile && <span>English</span>}

        <ChevronDown size={16} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align={mobile ? "start" : "end"} className="p-2">
        <DropdownMenuItem className="gap-3 py-2 text-sm font-medium">
          <Image
            src={englishFlag}
            alt=""
            width={32}
            height={24}
            className="h-5 w-8 object-cover"
          />
          English
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-3 py-2 text-sm font-medium">
          <Image
            src={khmerFlag}
            alt=""
            width={32}
            height={24}
            className="h-5 w-8  object-cover"
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
