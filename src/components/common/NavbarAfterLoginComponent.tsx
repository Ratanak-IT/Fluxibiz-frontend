"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  Menu,
  Receipt,
  Settings,
  UserRound,
} from "lucide-react";

import englishFlag from "../../../public/image/flags/english.png";
import khmerFlag from "../../../public/image/flags/khmer.png";
import fluxibizLogo from "../../../public/image/footer/fluxiBix-logo(2).png";

import ThemeToggle from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import type { SessionUser } from "@/lib/type/authType";
import { useAuth } from "@/features/auth/useAuth";
import { useGetMyProfileQuery } from "@/features/user/userApi";
import { resolveMediaUrl } from "@/lib/type/cartType";
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
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { data: profile } = useGetMyProfileQuery(undefined, { skip: !isAuthenticated });

  const resolvedProfilePic = resolveMediaUrl(profile?.profilePicture);
  const avatarSrc = profile
    ? (resolvedProfilePic || undefined)
    : (resolveMediaUrl(user.image) || user.image || undefined);

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e5e7eb] bg-white text-[#1f2937]">
      <div className="mx-auto flex h-[55px] max-w-[1330px] items-center justify-between px-6 sm:px-10">
        {/* Desktop Logo */}
        <Link href="/store" aria-label="FluxiBiz store">
          <Image
            src={fluxibizLogo}
            alt="FluxiBiz"
            width={240}
            height={90}
            priority
            className="h-auto w-33 translate-y-2 object-contain"
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden h-full items-center gap-8 lg:flex">
          {navigationItems.map((item) => {
            const isActive = isActiveRoute(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "relative flex h-full items-center text-sm font-semibold text-primary transition-colors after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-t-full after:bg-primary after:content-['']"
                    : "relative flex h-full items-center text-sm font-semibold text-[#6b7280] transition-colors hover:text-primary"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 text-[#4b5563] lg:flex">
          <ThemeToggle />

          <LanguageDropdown />

          <CartDrawer />
          <UserDropdown user={user} avatarSrc={avatarSrc} onLogout={onLogout} />
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 text-[#4b5563] lg:hidden">
          <CartDrawer />

          <ThemeToggle />

          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger
              className="lg:hidden"
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="
                    size-12
                    !bg-transparent
                    text-[#4b5563]
                    shadow-none
                    hover:!bg-transparent
                    hover:text-secondary
                    focus-visible:!bg-transparent
                    active:!bg-transparent
                    dark:!bg-transparent
                    dark:hover:!bg-transparent
                  "
                  aria-label="Open navigation menu"
                />
              }
            >
              <Menu size={32} />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[340px] border-l border-[#e5e7eb] bg-white text-[#1f2937] sm:w-[400px]"
            >
              <SheetHeader className="pb-0">
                <SheetTitle className="text-left">
                  <Link href="/store" onClick={() => setMobileNavOpen(false)} aria-label="FluxiBiz store">
                    <Image
                      src={fluxibizLogo}
                      alt="FluxiBiz"
                      width={180}
                      height={80}
                      className="h-auto w-30 object-contain"
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-0 flex flex-col gap-2">
                {/* User information */}
                <div className="mb-3 flex items-center gap-3 bg-[#f3f4f6] p-3">
                  <Avatar className="size-11">
                    {avatarSrc ? (
                      <AvatarImage
                        src={avatarSrc}
                        alt={user.name}
                        className="object-cover"
                      />
                    ) : null}

                    <AvatarFallback className="bg-[#e5e7eb] text-[#1f2937]">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate font-bold text-[#1f2937]">
                      {user.name}
                    </p>

                    <p className="truncate text-sm font-medium text-[#6b7280]">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Mobile navigation */}
                {navigationItems.map((item) => {
                  const isActive = isActiveRoute(item.href);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={
                        isActive
                          ? "relative block rounded-lg px-3 py-2.5 text-base font-bold text-primary transition-colors after:absolute after:bottom-1 after:left-3 after:h-[2px] after:w-10 after:rounded-full after:bg-primary after:content-['']"
                          : "block rounded-lg px-3 py-2.5 text-base font-bold text-[#1f2937] transition-colors hover:text-primary"
                      }
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <div className="my-2 border-t border-[#e5e7eb]" />

                <LanguageDropdown mobile />

                <Link
                  href="/user-profile"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-bold text-[#1f2937] transition-colors hover:bg-[#f3f4f6]"
                >
                  <UserRound size={19} />
                  View profile
                </Link>

                <Link
                  href="/payment-history"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-bold text-[#1f2937] transition-colors hover:bg-[#f3f4f6]"
                >
                  <Receipt size={19} />
                  Payment history
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-bold text-[#1f2937] transition-colors hover:bg-[#f3f4f6]"
                >
                  <Settings size={19} />
                  Settings
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileNavOpen(false);
                    onLogout?.();
                  }}
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

function UserDropdown({
  user,
  avatarSrc,
  onLogout,
}: {
  user: SessionUser;
  avatarSrc?: string;
  onLogout?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            className="
              group
              h-auto
              rounded-full
              !bg-transparent
              p-1
              shadow-none
              hover:!bg-transparent
              focus-visible:!bg-transparent
              active:!bg-transparent
              aria-expanded:!bg-transparent
              dark:!bg-transparent
              dark:hover:!bg-transparent
              dark:focus-visible:!bg-transparent
              dark:active:!bg-transparent
              dark:aria-expanded:!bg-transparent
            "
            aria-label="Open user menu"
          />
        }
      >
        <Avatar className="size-11 border border-[#e5e7eb] transition-colors duration-200 group-hover:border-secondary">
          {avatarSrc ? (
            <AvatarImage
              src={avatarSrc}
              alt={user.name}
              className="object-cover"
            />
          ) : null}

          <AvatarFallback className="bg-[#f3f4f6] text-[#1f2937]">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 border-[#e5e7eb] bg-white text-[#1f2937]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1">
              <p className="font-medium text-[#1f2937]">
                {user.name}
              </p>

              <p className="truncate text-xs font-normal text-[#6b7280]">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-[#e5e7eb]" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            render={<Link href="/user-profile" />}
            className="cursor-pointer gap-2 text-[#1f2937] focus:bg-[#f3f4f6] focus:text-[#1f2937]"
          >
            <UserRound size={17} />
            View profile
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link href="/payment-history" />}
            className="cursor-pointer gap-2 text-[#1f2937] focus:bg-[#f3f4f6] focus:text-[#1f2937]"
          >
            <Receipt size={17} />
            Payment history
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link href="/settings" />}
            className="cursor-pointer gap-2 text-[#1f2937] focus:bg-[#f3f4f6] focus:text-[#1f2937]"
          >
            <Settings size={17} />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-[#e5e7eb]" />

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

function LanguageDropdown({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            className={
              mobile
                ? `
                    group
                    w-full
                    justify-start
                    gap-3
                    !bg-transparent
                    text-base
                    font-semibold
                    text-[#1f2937]
                    shadow-none
                    hover:!bg-transparent
                    hover:text-secondary
                    focus-visible:!bg-transparent
                    active:!bg-transparent
                    aria-expanded:!bg-transparent
                    dark:!bg-transparent
                    dark:hover:!bg-transparent
                    dark:focus-visible:!bg-transparent
                    dark:active:!bg-transparent
                    dark:aria-expanded:!bg-transparent
                  `
                : `
                    group
                    h-10
                    gap-2
                    rounded-full
                    !bg-transparent
                    px-3
                    text-sm
                    font-semibold
                    text-[#4b5563]
                    shadow-none
                    hover:!bg-transparent
                    hover:text-secondary
                    focus-visible:!bg-transparent
                    active:!bg-transparent
                    aria-expanded:!bg-transparent
                    dark:!bg-transparent
                    dark:hover:!bg-transparent
                    dark:focus-visible:!bg-transparent
                    dark:active:!bg-transparent
                    dark:aria-expanded:!bg-transparent
                  `
            }
          />
        }
      >
        <Image
          src={englishFlag}
          alt="English"
          width={40}
          height={28}
          className="h-5 w-8 object-cover"
        />

        {mobile && <span>English</span>}

        <ChevronDown
          size={16}
          className="stroke-current transition-colors duration-200 group-hover:stroke-secondary"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={mobile ? "start" : "end"}
        className="border-[#e5e7eb] bg-white p-2 text-[#1f2937]"
      >
        <DropdownMenuItem className="gap-3 py-2 text-sm font-medium text-[#1f2937] focus:bg-[#f3f4f6] focus:text-[#1f2937]">
          <Image
            src={englishFlag}
            alt=""
            width={32}
            height={24}
            className="h-5 w-8 object-cover"
          />

          English
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-3 py-2 text-sm font-medium text-[#1f2937] focus:bg-[#f3f4f6] focus:text-[#1f2937]">
          <Image
            src={khmerFlag}
            alt=""
            width={32}
            height={24}
            className="h-5 w-8 object-cover"
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
