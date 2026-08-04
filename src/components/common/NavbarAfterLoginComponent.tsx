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

// Light-mode logo
import fluxibizLogo from "../../../public/image/footer/fluxiBix-logo(2).png";

// Dark-mode logo
import fluxibizDarkMode from "../../../public/image/footer/fluxibiz-logo-darkmode.png";

import ThemeToggle from "@/components/common/ThemeToggle";
import CartDrawer from "@/components/common/CartDrawer";
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

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavbarAfterLoginComponent({
  user,
  cartCount: _cartCount = 0,
  onLogout,
}: NavbarAfterLoginComponentProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { isAuthenticated } = useAuth();

  const { data: profile } = useGetMyProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const resolvedProfilePic = resolveMediaUrl(profile?.profilePicture);

  const avatarSrc = profile
    ? resolvedProfilePic || undefined
    : resolveMediaUrl(user.image) || user.image || undefined;

  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        border-[#e5e7eb]
        bg-white
        text-[#111827]
        backdrop-blur
        [color-scheme:light]

        dark:border-white/10
        dark:bg-background
        dark:text-white
        dark:[color-scheme:dark]
      "
    >
      <div
        className="
          mx-auto
          flex
          h-13.75
          max-w-332.5
          items-center
          justify-between
          px-4
          sm:px-6
          md:px-8
          lg:px-10
        "
      >
        {/* Logo */}
        <Link
          href="/store"
          aria-label="Go to FluxiBiz store"
          className="inline-flex shrink-0 items-center"
        >
          <Image
            src={fluxibizLogo}
            alt="FluxiBiz"
            width={240}
            height={90}
            priority
            className="
              h-auto
              w-28
              translate-y-2.5
              object-contain
              sm:w-30
              md:w-33
              dark:hidden
            "
          />

          <Image
            src={fluxibizDarkMode}
            alt="FluxiBiz"
            width={240}
            height={90}
            priority
            className="
              hidden
              h-auto
              w-28
              translate-y-0.5
              object-contain
              sm:w-30
              md:w-33
              dark:block
            "
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Main navigation"
        >
          {navigationItems.map((item) => {
            const active = isRouteActive(pathname, item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`
                  relative
                  py-2
                  text-sm
                  font-semibold
                  transition-colors

                  ${
                    active
                      ? "text-primary"
                      : `
                          text-[#6b7280]
                          hover:text-primary
                          dark:text-white
                          dark:hover:text-primary
                        `
                  }
                `}
              >
                {item.label}

                {active && (
                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      inset-x-0
                      -bottom-1
                      h-0.5
                      rounded-full
                      bg-primary
                    "
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 lg:flex">
          <ThemeToggle />

          <LanguageDropdown />

          <StyledCartDrawer />

          <UserDropdown
            user={user}
            avatarSrc={avatarSrc}
            onLogout={onLogout}
          />
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <StyledCartDrawer />

          <Sheet
            open={mobileNavOpen}
            onOpenChange={setMobileNavOpen}
          >
            <SheetTrigger
              className="lg:hidden"
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="
                    size-9
                    shrink-0
                    !bg-transparent
                    p-0
                    text-[#111827]
                    shadow-none
                    hover:!bg-transparent
                    hover:text-primary
                    focus-visible:!bg-transparent
                    active:!bg-transparent

                    sm:size-10

                    dark:!bg-transparent
                    dark:text-white
                    dark:hover:!bg-transparent
                    dark:hover:text-primary
                    dark:focus-visible:!bg-transparent
                    dark:active:!bg-transparent
                  "
                  aria-label="Open navigation menu"
                />
              }
            >
              <Menu className="size-5 sm:size-6" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="
                flex
                w-[62vw]
                min-w-[235px]
                max-w-[255px]
                flex-col
                gap-0
                overflow-y-auto
                border-[#e5e7eb]
                bg-white
                px-3
                text-[#111827]
                [color-scheme:light]

                min-[390px]:w-[60vw]
                min-[390px]:max-w-[265px]

                sm:w-[340px]
                sm:max-w-[340px]
                sm:px-6

                md:w-[370px]
                md:max-w-[370px]

                dark:border-white/10
                dark:bg-background
                dark:text-white
                dark:[color-scheme:dark]
              "
            >
              {/* Equal spacing from logo to the last menu item */}
              <div className="flex w-full flex-col gap-3 py-4">
                {/* Mobile logo */}
                <SheetHeader className="w-full shrink-0 p-0 text-left">
                  <SheetTitle className="w-full p-0 text-left">
                    <Link
                      href="/store"
                      onClick={() => setMobileNavOpen(false)}
                      aria-label="Go to FluxiBiz store"
                      className="
                        flex
                        h-11
                        w-full
                        items-center
                        justify-start
                        px-3
                      "
                    >
                      <span
                        className="
                          relative
                          block
                          h-10
                          w-30
                          shrink-0
                        "
                      >
                        <Image
                          src={fluxibizLogo}
                          alt="FluxiBiz"
                          fill
                          sizes="120px"
                          className="
                            object-contain
                            object-left
                            dark:hidden
                          "
                        />

                        <Image
                          src={fluxibizDarkMode}
                          alt="FluxiBiz"
                          fill
                          sizes="120px"
                          className="
                            hidden
                            object-contain
                            object-left
                            dark:block
                          "
                        />
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                {/* Theme icon inside sidebar */}
                <div
                  className="
                    flex
                    h-11
                    shrink-0
                    items-center
                    justify-start
                    px-3
                  "
                >
                  <div className="grid size-10 shrink-0 place-items-center">
                    <ThemeToggle mobile />
                  </div>
                </div>

                {/* User information */}
                <div
                  className="
                    flex
                    min-h-16
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    bg-[#f3f4f6]
                    px-3
                    py-2

                    dark:bg-white/5
                  "
                >
                  <Avatar
                    className="
                      size-11
                      shrink-0
                      border
                      border-[#e5e7eb]

                      dark:border-white/10
                    "
                  >
                    {avatarSrc ? (
                      <AvatarImage
                        src={avatarSrc}
                        alt={user.name}
                        className="object-cover"
                      />
                    ) : null}

                    <AvatarFallback
                      className="
                        bg-[#e5e7eb]
                        text-[#1f2937]

                        dark:bg-white/10
                        dark:text-white
                      "
                    >
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-[#1f2937] dark:text-white">
                      {user.name}
                    </p>

                    <p className="truncate text-sm font-medium text-[#6b7280] dark:text-white/65">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Mobile navigation */}
                {navigationItems.map((item) => {
                  const active = isRouteActive(pathname, item.href);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`
                        flex
                        h-11
                        w-full
                        items-center
                        rounded-lg
                        border-l-4
                        px-3
                        text-base
                        font-bold
                        transition-colors

                        ${
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : `
                                border-transparent
                                text-[#374151]
                                hover:bg-[#f3f4f6]
                                hover:text-primary

                                dark:text-white
                                dark:hover:bg-white/5
                                dark:hover:text-primary
                              `
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {/* Divider */}
                <div className="h-px w-full shrink-0 bg-[#e5e7eb] dark:bg-white/10" />

                {/* Language */}
                <div className="h-11 w-full">
                  <LanguageDropdown mobile />
                </div>

                {/* View profile */}
                <Link
                  href="/user-profile"
                  onClick={() => setMobileNavOpen(false)}
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    text-base
                    font-bold
                    text-[#374151]
                    transition-colors
                    hover:bg-[#f3f4f6]
                    hover:text-primary

                    dark:text-white
                    dark:hover:bg-white/5
                    dark:hover:text-primary
                  "
                >
                  <UserRound className="size-5 shrink-0" />
                  View profile
                </Link>

                {/* Payment history */}
                <Link
                  href="/payment-history"
                  onClick={() => setMobileNavOpen(false)}
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    text-base
                    font-bold
                    text-[#374151]
                    transition-colors
                    hover:bg-[#f3f4f6]
                    hover:text-primary

                    dark:text-white
                    dark:hover:bg-white/5
                    dark:hover:text-primary
                  "
                >
                  <Receipt className="size-5 shrink-0" />
                  Payment history
                </Link>

                {/* Settings */}
                <Link
                  href="/settings"
                  onClick={() => setMobileNavOpen(false)}
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    text-base
                    font-bold
                    text-[#374151]
                    transition-colors
                    hover:bg-[#f3f4f6]
                    hover:text-primary

                    dark:text-white
                    dark:hover:bg-white/5
                    dark:hover:text-primary
                  "
                >
                  <Settings className="size-5 shrink-0" />
                  Settings
                </Link>

                {/* Log out */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileNavOpen(false);
                    onLogout?.();
                  }}
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    text-left
                    text-base
                    font-bold
                    text-destructive
                    transition-colors
                    hover:bg-destructive/10
                  "
                >
                  <LogOut className="size-5 shrink-0" />
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

/**
 * Same cart style for desktop, tablet, and phone:
 * - 48px button
 * - 28px icon
 * - transparent background in every state
 * - secondary icon stroke on hover
 */
function StyledCartDrawer() {
  return (
    <div
      className="
        group
        grid
        size-12
        shrink-0
        place-items-center

        [&_button]:size-12
        [&_button]:min-h-12
        [&_button]:min-w-12
        [&_button]:rounded-full
        [&_button]:!bg-transparent
        [&_button]:p-0
        [&_button]:text-[#4b5563]
        [&_button]:shadow-none

        [&_button:hover]:!bg-transparent
        [&_button:focus-visible]:!bg-transparent
        [&_button:active]:!bg-transparent

        [&_svg]:size-7
        [&_svg]:stroke-current
        [&_svg]:transition-colors
        [&_svg]:duration-200

        hover:[&_svg]:stroke-secondary

        dark:[&_button]:!bg-transparent
        dark:[&_button]:text-white
        dark:[&_button:hover]:!bg-transparent
        dark:[&_button:focus-visible]:!bg-transparent
        dark:[&_button:active]:!bg-transparent
      "
    >
      <CartDrawer />
    </div>
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
        <Avatar
          className="
            size-11
            border
            border-[#e5e7eb]
            transition-colors
            duration-200
            group-hover:border-secondary

            dark:border-white/10
          "
        >
          {avatarSrc ? (
            <AvatarImage
              src={avatarSrc}
              alt={user.name}
              className="object-cover"
            />
          ) : null}

          <AvatarFallback className="bg-[#f3f4f6] text-[#1f2937] dark:bg-white/10 dark:text-white">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="
          w-64
          border-[#e5e7eb]
          bg-white
          text-[#1f2937]
          [color-scheme:light]

          dark:border-white/10
          dark:bg-background
          dark:text-white
          dark:[color-scheme:dark]
        "
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1">
              <p className="font-medium text-[#1f2937] dark:text-white">
                {user.name}
              </p>

              <p className="truncate text-xs font-normal text-[#6b7280] dark:text-white/65">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-[#e5e7eb] dark:bg-white/10" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            render={<Link href="/user-profile" />}
            className="
              cursor-pointer
              gap-2
              text-[#1f2937]
              focus:bg-[#f3f4f6]
              focus:text-[#1f2937]

              dark:text-white
              dark:focus:bg-white/5
              dark:focus:text-primary
            "
          >
            <UserRound className="size-[17px]" />
            View profile
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link href="/payment-history" />}
            className="
              cursor-pointer
              gap-2
              text-[#1f2937]
              focus:bg-[#f3f4f6]
              focus:text-[#1f2937]

              dark:text-white
              dark:focus:bg-white/5
              dark:focus:text-primary
            "
          >
            <Receipt className="size-[17px]" />
            Payment history
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link href="/settings" />}
            className="
              cursor-pointer
              gap-2
              text-[#1f2937]
              focus:bg-[#f3f4f6]
              focus:text-[#1f2937]

              dark:text-white
              dark:focus:bg-white/5
              dark:focus:text-primary
            "
          >
            <Settings className="size-[17px]" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-[#e5e7eb] dark:bg-white/10" />

        <DropdownMenuItem
          onClick={onLogout}
          className="
            cursor-pointer
            gap-2
            text-destructive
            focus:bg-destructive/10
            focus:text-destructive
          "
        >
          <LogOut className="size-[17px]" />
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
                    h-11
                    w-full
                    justify-start
                    gap-3
                    !bg-transparent
                    px-3
                    text-base
                    font-semibold
                    text-[#374151]
                    shadow-none
                    hover:!bg-transparent
                    hover:text-primary
                    focus-visible:!bg-transparent
                    active:!bg-transparent
                    aria-expanded:!bg-transparent
                    aria-expanded:text-primary

                    dark:!bg-transparent
                    dark:text-white
                    dark:hover:!bg-transparent
                    dark:hover:text-primary
                    dark:focus-visible:!bg-transparent
                    dark:active:!bg-transparent
                    dark:aria-expanded:!bg-transparent
                    dark:aria-expanded:text-primary
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
                    aria-expanded:text-secondary

                    dark:!bg-transparent
                    dark:text-white
                    dark:hover:!bg-transparent
                    dark:hover:text-secondary
                    dark:focus-visible:!bg-transparent
                    dark:active:!bg-transparent
                    dark:aria-expanded:!bg-transparent
                    dark:aria-expanded:text-secondary
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
          className="
            size-4
            stroke-current
            transition-colors
            duration-200
            group-hover:stroke-secondary
          "
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={mobile ? "start" : "end"}
        className="
          border-[#e5e7eb]
          bg-white
          p-2
          text-[#1f2937]
          [color-scheme:light]

          dark:border-white/10
          dark:bg-background
          dark:text-white
          dark:[color-scheme:dark]
        "
      >
        <DropdownMenuItem
          className="
            gap-3
            py-2
            text-sm
            font-medium
            text-[#1f2937]
            focus:bg-[#f3f4f6]
            focus:text-primary

            dark:text-white
            dark:focus:bg-white/5
            dark:focus:text-primary
          "
        >
          <Image
            src={englishFlag}
            alt="English"
            width={32}
            height={24}
            className="h-5 w-8 object-cover"
          />

          English
        </DropdownMenuItem>

        <DropdownMenuItem
          className="
            gap-3
            py-2
            text-sm
            font-medium
            text-[#1f2937]
            focus:bg-[#f3f4f6]
            focus:text-primary

            dark:text-white
            dark:focus:bg-white/5
            dark:focus:text-primary
          "
        >
          <Image
            src={khmerFlag}
            alt="Khmer"
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