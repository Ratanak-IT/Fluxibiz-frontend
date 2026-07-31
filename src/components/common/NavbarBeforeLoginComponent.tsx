"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";

import englishFlag from "../../../public/image/flags/english.png";
import khmerFlag from "../../../public/image/flags/khmer.png";
import fluxibizLogo from "../../../public/image/footer/fluxiBix-logo(2).png";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/common/ThemeToggle";
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

const keycloakLoginUrl =
  process.env.NEXT_PUBLIC_KEYCLOAK_LOGIN_URL || "/login";


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

export default function NavbarBeforeLoginComponent() {
  const pathname = usePathname();

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
       
      "
    >
      <div className="mx-auto flex h-13.75 max-w-332.5 items-center justify-between px-6 sm:px-10">
        {/* Logo redirects to Store */}
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
            className="h-auto w-33 translate-y-2 object-contain"
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Main navigation"
        >
          {navigationItems.map((item) => {
            const active = isRouteActive(pathname, item.href);

            if (item.children) {
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
                          : "text-[#6b7280] hover:text-primary"
                      }
                    `}
                  >
                    {item.label}

                    <ChevronDown size={16} />

                    {menuActive && (
                      <span
                        aria-hidden
                        className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary"
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
                            
                            ${
                              childActive
                                ? "bg-primary/10 text-primary"
                                : "text-[#4b5563]"
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
                      : "text-[#6b7280] hover:text-primary"
                  }
                `}
              >
                {item.label}

                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary"
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

          <Link
            href="/register"
            className="
              text-sm
              font-bold
              text-[#374151]
              transition-colors
              hover:text-secondary
            "
          >
            Business
          </Link>

          <Button
            nativeButton={false}
            render={<Link href={keycloakLoginUrl} />}
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
              
              dark:hover:bg-[#007d24]
            "
          >
            Login
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
              bg-white
              px-8
              text-sm
              font-bold
              text-primary
              hover:bg-primary/10
              hover:text-primary
              dark:border-primary
              dark:bg-white
              dark:text-primary
              dark:hover:bg-primary/10
              dark:hover:text-primary
            "
          >
            Register
          </Button>
        </div>

        {/* Mobile navigation */}
        <Sheet>
          <SheetTrigger
            className="lg:hidden"
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="
                  size-12
                  bg-transparent
                  text-[#111827]
                  hover:bg-transparent
                  hover:text-primary
                  dark:bg-transparent
                  dark:text-[#111827]
                  dark:hover:bg-transparent
                  dark:hover:text-primary
                "
                aria-label="Open navigation menu"
              />
            }
          >
            <Menu size={32} />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="
              w-[340px]
              border-[#e5e7eb]
              bg-white
              text-[#111827]
              [color-scheme:light]
              dark:border-[#e5e7eb]
              dark:bg-white
              dark:text-[#111827]
              sm:w-[400px]
            "
          >
            <SheetHeader>
              <SheetTitle className="text-left text-[#111827] dark:text-[#111827]">
                {/* Mobile logo redirects to Store */}
                <Link
                  href="/store"
                  aria-label="Go to FluxiBiz store"
                  className="inline-flex items-center"
                >
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

            <div className="mt-8 flex flex-col gap-2">
              <ThemeToggle mobile />

              {navigationItems.map((item) => {
                const active = isRouteActive(pathname, item.href);

                return (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`
                        block
                        rounded-lg
                        border-l-4
                        px-3
                        py-2.5
                        text-base
                        font-bold
                        transition-colors
                        ${
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-transparent text-[#374151] hover:bg-[#f3f4f6] hover:text-primary"
                        }
                      `}
                    >
                      {item.label}
                    </Link>

                    {item.children && (
                      <div className="ml-4 border-l-2 border-[#e5e7eb] pl-4">
                        {item.children.map((child) => {
                          const childActive = isRouteActive(
                            pathname,
                            child.href,
                          );

                          return (
                            <Link
                              key={child.label}
                              href={child.href}
                              aria-current={
                                childActive ? "page" : undefined
                              }
                              className={`
                                block
                                rounded-lg
                                px-3
                                py-2
                                text-sm
                                font-medium
                                transition-colors
                                ${
                                  childActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-primary"
                                }
                              `}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="my-2 border-t border-[#e5e7eb]" />

              <LanguageDropdown mobile />

              <Link
                href="/register"
                className="
                  rounded-lg
                  px-3
                  py-2.5
                  text-base
                  font-bold
                  text-[#374151]
                  transition-colors
                  hover:bg-[#f3f4f6]
                  hover:text-primary
                "
              >
                Business
              </Link>

              <Button
                nativeButton={false}
                render={<Link href={keycloakLoginUrl} />}
                className="
                  mt-4
                  h-11
                  rounded-full
                  bg-primary
                  text-base
                  font-bold
                  text-white
                  hover:bg-[#007d24]
                  dark:bg-primary
                  dark:text-white
                  dark:hover:bg-[#007d24]
                "
              >
                Login
              </Button>

              <Button
                nativeButton={false}
                render={<Link href="/register" />}
                variant="outline"
                className="
                  h-11
                  rounded-full
                  border-2
                  border-primary
                  bg-white
                  text-base
                  font-bold
                  text-primary
                  hover:bg-primary/10
                  hover:text-primary
                  dark:border-primary
                  dark:bg-white
                  dark:text-primary
                  dark:hover:bg-primary/10
                  dark:hover:text-primary
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
                  bg-white
                  text-base
                  font-semibold
                  text-[#374151]
                  hover:bg-transparent
                  hover:text-primary
                  aria-expanded:bg-transparent
                  aria-expanded:text-primary
                  dark:bg-white
                  dark:text-[#374151]
                  dark:hover:bg-transparent
                  dark:hover:text-primary
                `
                : `
                  h-10
                  gap-2
                  rounded-full
                  bg-white
                  px-3
                  text-sm
                  font-semibold
                  text-[#374151]
                  hover:bg-transparent
                  hover:text-primary
                  aria-expanded:bg-transparent
                  aria-expanded:text-primary
                  dark:bg-white
                  dark:text-[#374151]
                  dark:hover:bg-transparent
                  dark:hover:text-primary
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
          dark:border-[#e5e7eb]
          dark:bg-white
          dark:text-[#111827]
        "
      >
        <DropdownMenuItem className="gap-3 py-2 text-sm font-medium text-[#374151] focus:bg-primary/10 focus:text-primary">
          <Image
            src={englishFlag}
            alt=""
            width={32}
            height={24}
            className="h-5 w-8 object-cover"
          />

          English
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-3 py-2 text-sm font-medium text-[#374151] focus:bg-primary/10 focus:text-primary">
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