"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LogOut,
  Menu,
  Receipt,
  Settings,
  UserRound,
} from "lucide-react";

// Light-mode logo
import fluxibizLogo from "../../../public/image/footer/fluxiBix-logo(2).png";

// Dark-mode logo
import fluxibizDarkMode from "../../../public/image/footer/fluxibiz-logo-darkmode.png";

import ThemeToggle from "@/components/common/ThemeToggle";
import CartDrawer from "@/components/common/CartDrawer";
import LanguageSwitcherButtonComponent from "@/components/common/LanguageSwitcherButtonComponent";

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

function isRouteActive(
  pathname: string,
  href: string,
) {
  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

function getInitials(name: string) {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return "U";
  }

  return normalizedName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function NavbarAfterLoginComponent({
  user,
  cartCount: _cartCount = 0,
  onLogout,
}: NavbarAfterLoginComponentProps) {
  const t = useTranslations("Navbar");
  const pathname = usePathname();

  const [mobileNavOpen, setMobileNavOpen] =
    useState(false);

  const { isAuthenticated } = useAuth();

  const { data: profile } =
    useGetMyProfileQuery(undefined, {
      skip: !isAuthenticated,
    });

  const navigationItems: NavigationItem[] = [
    {
      label: t("feature"),
      href: "/feature",
    },
    {
      label: t("support"),
      href: "/support",
    },
    {
      label: t("aboutUs"),
      href: "/about",
    },
  ];

  const resolvedProfilePic = resolveMediaUrl(
    profile?.profilePicture,
  );

  const avatarSrc = profile
    ? resolvedProfilePic || undefined
    : resolveMediaUrl(user.image) ||
      user.image ||
      undefined;

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
          aria-label={t("goToStore")}
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
              translate-y-0.3
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
              translate-y-0.3
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
          aria-label={t("mainNavigation")}
        >
          {navigationItems.map((item) => {
            const active = isRouteActive(
              pathname,
              item.href,
            );

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  active ? "page" : undefined
                }
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

          <LanguageSwitcherButtonComponent
            variant="after-login"
          />

          <StyledCartDrawer />

          <UserDropdown
            user={user}
            avatarSrc={avatarSrc}
            onLogout={onLogout}
          />
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 lg:hidden">
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
                  aria-label={t(
                    "openNavigationMenu",
                  )}
                />
              }
            >
              <Menu className="size-5 sm:size-6" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="
                flex
                w-[82vw]
                max-w-[320px]
                flex-col
                gap-0
                overflow-y-auto
                border-[#e5e7eb]
                bg-white
                px-4
                text-[#111827]
                [color-scheme:light]

                sm:w-[350px]
                sm:max-w-[350px]
                sm:px-6

                dark:border-white/10
                dark:bg-background
                dark:text-white
                dark:[color-scheme:dark]
              "
            >
              <div className="flex w-full flex-col gap-3 py-4">
                {/* Mobile logo */}
                <SheetHeader className="w-full shrink-0 p-0 text-left">
                  <SheetTitle className="w-full p-0 text-left">
                    <Link
                      href="/store"
                      onClick={() =>
                        setMobileNavOpen(false)
                      }
                      aria-label={t("goToStore")}
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

                {/* Theme */}
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
                <Link
                  href="/user-profile"
                  onClick={() => setMobileNavOpen(false)}
                  className="
                    group
                    flex
                    min-h-16
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    bg-[#f3f4f6]
                    px-3
                    py-2
                    transition-colors
<<<<<<< HEAD
                    hover:bg-[#e5e7eb]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                    focus-visible:ring-offset-2

                    dark:bg-white/5
                    dark:hover:bg-white/10
                    dark:focus-visible:ring-offset-background
=======

                    hover:bg-[#e5e7eb]

                    dark:bg-white/5
                    dark:hover:bg-white/10
>>>>>>> 8a4fd6b49e7963aa43f4d0fd743fd62a004f9401
                  "
                >
                  <Avatar
                    className="
                      size-11
                      shrink-0
                      border
                      border-[#e5e7eb]
                      transition-colors
                      group-hover:border-primary

                      dark:border-white/10 " >
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
                    <p className="truncate font-bold text-[#1f2937] transition-colors group-hover:text-primary dark:text-white">
                      {user.name}
                    </p>

                    <p className="truncate text-sm font-medium text-[#6b7280] dark:text-white/65">
                      {user.email}
                    </p>
                  </div>
                </Link>

                {/* Mobile navigation */}
                {navigationItems.map((item) => {
                  const active = isRouteActive(
                    pathname,
                    item.href,
                  );

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() =>
                        setMobileNavOpen(false)
                      }
                      aria-current={
                        active
                          ? "page"
                          : undefined
                      }
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
                  <LanguageSwitcherButtonComponent
                    mobile
                    variant="after-login"
                  />
                </div>

                {/* View profile */}
                <Link
                  href="/user-profile"
                  onClick={() =>
                    setMobileNavOpen(false)
                  }
                  className="
                    group
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

                    [&_svg]:text-current
                    [&_svg]:transition-colors

                    dark:text-white
                    dark:hover:bg-white/5
                    dark:hover:text-primary
                  "
                >
                  <UserRound className="size-5 shrink-0 text-current" />
                  {t("account.viewProfile")}
                </Link>

                {/* Payment history */}
                <Link
                  href="/payment-history"
                  onClick={() =>
                    setMobileNavOpen(false)
                  }
                  className="
                    group
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

                    [&_svg]:text-current
                    [&_svg]:transition-colors

                    dark:text-white
                    dark:hover:bg-white/5
                    dark:hover:text-primary
                  "
                >
                  <Receipt className="size-5 shrink-0 text-current" />
                  {t("account.paymentHistory")}
                </Link>



                {/* Logout */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileNavOpen(false);
                    onLogout?.();
                  }}
                  className="
                    group
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

                    [&_svg]:text-destructive
                  "
                >
                  <LogOut className="size-5 shrink-0 text-destructive" />
                  {t("account.logout")}
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
  const t = useTranslations("Navbar");

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
            aria-label={t(
              "account.openUserMenu",
            )}
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
            render={
              <Link href="/user-profile" />
            }
            className="
              group
              cursor-pointer
              gap-2.5
              text-[#1f2937]

              focus:bg-[#f3f4f6]
              focus:text-primary
              data-[highlighted]:bg-[#f3f4f6]
              data-[highlighted]:text-primary

              [&_svg]:text-current
              [&_svg]:transition-colors

              dark:text-white
              dark:focus:bg-white/5
              dark:focus:text-primary
              dark:data-[highlighted]:bg-white/5
              dark:data-[highlighted]:text-primary
            "
          >
            <UserRound className="size-[17px] text-current" />
            {t("account.viewProfile")}
          </DropdownMenuItem>

          <DropdownMenuItem
            render={
              <Link href="/payment-history" />
            }
            className="
              group
              cursor-pointer
              gap-2.5
              text-[#1f2937]

              focus:bg-[#f3f4f6]
              focus:text-primary
              data-[highlighted]:bg-[#f3f4f6]
              data-[highlighted]:text-primary

              [&_svg]:text-current
              [&_svg]:transition-colors

              dark:text-white
              dark:focus:bg-white/5
              dark:focus:text-primary
              dark:data-[highlighted]:bg-white/5
              dark:data-[highlighted]:text-primary
            "
          >
            <Receipt className="size-[17px] text-current" />
            {t("account.paymentHistory")}
          </DropdownMenuItem>


        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-[#e5e7eb] dark:bg-white/10" />

        <DropdownMenuItem
          onClick={onLogout}
          className="
            group
            cursor-pointer
            gap-2.5
            text-destructive

            focus:bg-destructive/10
            focus:text-destructive
            data-[highlighted]:bg-destructive/10
            data-[highlighted]:text-destructive

            [&_svg]:text-destructive
          "
        >
          <LogOut className="size-[17px] text-destructive" />
          {t("account.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
