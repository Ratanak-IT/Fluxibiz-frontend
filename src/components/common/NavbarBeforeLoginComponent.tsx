"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";

import englishFlag from "../../../public/image/flags/english.png";
import khmerFlag from "../../../public/image/flags/khmer.png";

// Light-mode logo
import fluxibizLogo from "../../../public/image/footer/fluxiBix-logo(2).png";

// Dark-mode logo
import fluxibizDarkMode from "../../../public/image/footer/fluxibiz-logo-darkmode.png";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/common/ThemeToggle";
import { useAuth } from "@/features/auth/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavigationItem = {
  label: string;
  href: string;
  children?: {
    label: string;
    href: string;
  }[];
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

interface NavbarBeforeLoginProps {
  pending?: boolean;
  isLoggingIn?: boolean;
  onLogin?: () => Promise<void> | void;
}

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavbarBeforeLoginComponent({
  pending = false,
  isLoggingIn = false,
  onLogin,
}: NavbarBeforeLoginProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { loginHref, login } = useAuth();

  const handleLogin = (event: MouseEvent) => {
    event.preventDefault();

    if (onLogin) {
      void onLogin();
      return;
    }

    login();
  };

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
        ">
        {/* Main logo */}
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

            if (item.children?.length) {
              const childActive = item.children.some((child) =>
                isRouteActive(pathname, child.href),
              );

              const menuActive = active || childActive;

              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger
                    className={`
                      relative
                      flex
                      items-center
                      gap-1.5
                      py-2
                      text-sm
                      font-semibold
                      outline-none
                      transition-colors

                      ${
                        menuActive
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

                    <ChevronDown size={16} />

                    {menuActive && (
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
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    className="
                      min-w-60
                      border-[#e5e7eb]
                      bg-white
                      p-2
                      text-[#111827]
                      [color-scheme:light]

                      dark:border-white/10
                      dark:bg-background
                      dark:text-white
                      dark:[color-scheme:dark]
                    "
                  >
                    {item.children.map((child) => {
                      const childActive = isRouteActive(
                        pathname,
                        child.href,
                      );

                      return (
                        <DropdownMenuItem
                          key={child.label}
                          render={<Link href={child.href} />}
                          className={`
                            py-2
                            text-sm
                            font-medium
                            focus:bg-primary/10
                            focus:text-primary

                            dark:focus:bg-primary/10
                            dark:focus:text-primary

                            ${
                              childActive
                                ? "bg-primary/10 text-primary"
                                : "text-[#4b5563] dark:text-white"
                            }
                          `}
                        >
                          {child.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

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
        <div
          className={`
            hidden
            items-center
            gap-4
            lg:flex

            ${
              pending || isLoggingIn
                ? "pointer-events-none opacity-60"
                : ""
            }
          `}
        >
          <ThemeToggle />

          <LanguageDropdown />

          <Link
            href="/register/business"
            className="
              text-sm
              font-bold
              text-[#374151]
              transition-colors
              hover:text-secondary

              dark:text-white
              dark:hover:text-secondary
            "
          >
            Business
          </Link>

          <Button
            nativeButton={false}
            render={<a href={loginHref} />}
            onClick={handleLogin}
            disabled={pending || isLoggingIn}
            className="
              h-9
              rounded-full
              border
              border-primary
              bg-primary
              px-8
              text-sm
              font-bold
              text-white
              shadow-none
              hover:bg-[#007d24]

              dark:border-primary
              dark:bg-primary
              dark:text-white
              dark:hover:bg-[#007d24]
            "
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </Button>

          <Button
            nativeButton={false}
            render={<Link href="/register" />}
            variant="outline"
            className="
              h-9
              rounded-full
              border-2
              border-primary
              !bg-transparent
              px-8
              text-sm
              font-bold
              text-primary
              shadow-none
              hover:!bg-transparent
              hover:text-primary
              focus-visible:!bg-transparent
              active:!bg-transparent

              dark:border-primary
              dark:!bg-transparent
              dark:text-primary
              dark:hover:!bg-transparent
              dark:hover:text-primary
              dark:focus-visible:!bg-transparent
              dark:active:!bg-transparent
            "
          >
            Register
          </Button>
        </div>

        {/* Phone and tablet navigation */}
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
  {/* One consistent vertical gap for all sidebar elements */}
  <div className="flex w-full flex-col gap-3 py-4">
    {/* Logo */}
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

    {/* Navigation */}
    {navigationItems.map((item) => {
      const active = isRouteActive(pathname, item.href);

      return (
        <div key={item.label} className="w-full">
          <Link
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

          {item.children?.length ? (
            <div
              className="
                mt-3
                flex
                flex-col
                gap-3
                border-l-2
                border-[#e5e7eb]
                pl-4
                dark:border-white/10
              "
            >
              {item.children.map((child) => {
                const childActive = isRouteActive(
                  pathname,
                  child.href,
                );

                return (
                  <Link
                    key={child.label}
                    href={child.href}
                    onClick={() => setMobileNavOpen(false)}
                    aria-current={
                      childActive ? "page" : undefined
                    }
                    className={`
                      flex
                      h-10
                      items-center
                      rounded-lg
                      px-3
                      text-sm
                      font-medium
                      transition-colors

                      ${
                        childActive
                          ? "bg-primary/10 text-primary"
                          : `
                              text-[#6b7280]
                              hover:bg-[#f3f4f6]
                              hover:text-primary

                              dark:text-white
                              dark:hover:bg-white/5
                              dark:hover:text-primary
                            `
                      }
                    `}
                  >
                    {child.label}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
      );
    })}

    {/* Divider */}
    <div className="h-px w-full shrink-0 bg-[#e5e7eb] dark:bg-white/10" />

    {/* Language */}
    <div className="h-11 w-full">
      <LanguageDropdown mobile />
    </div>

    {/* Business */}
    <Link
      href="/register/business"
      onClick={() => setMobileNavOpen(false)}
      className="
        flex
        h-11
        w-full
        items-center
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
      Business
    </Link>

    {/* Login */}
    <Button
      nativeButton={false}
      render={<a href={loginHref} />}
      onClick={(event) => {
        setMobileNavOpen(false);
        handleLogin(event);
      }}
      disabled={pending || isLoggingIn}
      className="
        h-11
        w-full
        shrink-0
        rounded-full
        bg-primary
        text-base
        font-bold
        text-white
        shadow-none
        hover:bg-[#007d24]

        dark:bg-primary
        dark:text-white
        dark:hover:bg-[#007d24]
      "
    >
      {isLoggingIn ? "Logging in..." : "Login"}
    </Button>

    {/* Register */}
    <Button
      nativeButton={false}
      render={<Link href="/register" />}
      onClick={() => setMobileNavOpen(false)}
      variant="outline"
      className="
        h-11
        w-full
        shrink-0
        rounded-full
        border-2
        border-primary
        !bg-transparent
        text-base
        font-bold
        text-primary
        shadow-none
        hover:!bg-transparent
        hover:text-primary
        focus-visible:!bg-transparent
        active:!bg-transparent

        dark:border-primary
        dark:!bg-transparent
        dark:text-primary
        dark:hover:!bg-transparent
        dark:hover:text-primary
        dark:focus-visible:!bg-transparent
        dark:active:!bg-transparent
      "
    >
      Register
    </Button>
  </div>
</SheetContent>
        </Sheet>
      </div>
    </header>
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
                    w-full
                    justify-start
                    gap-3
                    !bg-transparent
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
                    h-10
                    gap-2
                    rounded-full
                    !bg-transparent
                    px-3
                    text-sm
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

        <ChevronDown size={16} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={mobile ? "start" : "end"}
        className="
          border-[#e5e7eb]
          bg-white
          p-2
          text-[#111827]
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
            text-[#374151]
            focus:bg-primary/10
            focus:text-primary

            dark:text-white
            dark:focus:bg-primary/10
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
            text-[#374151]
            focus:bg-primary/10
            focus:text-primary

            dark:text-white
            dark:focus:bg-primary/10
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