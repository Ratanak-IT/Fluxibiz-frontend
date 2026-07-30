"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";

import englishFlag from "../../../public/image/flags/english.png";
import khmerFlag from "../../../public/image/flags/khmer.png";
import fluxibizLogo from "../../../public/image/logo.png";

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
  children?: { label: string; href: string }[];
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

export default function NavbarBeforeLoginComponent({
  pending = false,
}: {
  pending?: boolean;
}) {
  const { loginHref, login } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b  bg-white text-foreground backdrop-blur dark:bg-background ">
      <div className="mx-auto flex h-13.75 max-w-332.5 items-center justify-between px-6 sm:px-10">
        {/* Desktop Logo */}
        <Link href="/" aria-label="FluxiBiz home">
          <Image
            src={fluxibizLogo}
            alt="FluxiBiz"
            width={240}
            height={90}
            priority
            className="h-auto w-33 object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navigationItems.map((item) =>
            item.children ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground outline-none transition-colors hover:text-foreground">
                  {item.label}
                  <ChevronDown size={16} />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="min-w-60 p-2">
                  {item.children.map((child) => (
                    <DropdownMenuItem
                      key={child.label}
                      render={<Link href={child.href} />}
                      className="py-2 text-sm font-medium"
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
                className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground dark:text-text dark:hover:text-secondary"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div
          className={`hidden items-center gap-4 lg:flex ${
            pending ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <ThemeToggle />
          <LanguageDropdown />

          <Link
            href="/register"
            className="text-sm  font-bold text-gray-700 hover:text-secondary dark:text-text dark:hover:text-secondary "
          >
            Business
          </Link>

          {/* Plain <a>, not next/link: this is a route handler that 302s to Keycloak */}
          <Button
            nativeButton={false}
            render={<a href={loginHref} />}
            onClick={(event) => {
              event.preventDefault();
              login();
            }}
            className="h-9 rounded-full border border-[#00932a] bg-[#00932a] px-8 text-sm font-bold text-white shadow-none hover:bg-[#007d24]"
          >
            Login
          </Button>

          <Button
            nativeButton={false}
            render={<Link href="/register" />}
            variant="outline"
            className="h-9 rounded-full border-2 border-primary] bg-transparent px-8 text-sm font-bold text-primary hover:bg-primary/10 hover:text-primary"
          >
            Register
          </Button>
        </div>

        {/* Mobile Navigation Sheet */}
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
              {navigationItems.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-2.5 text-base font-bold text-foreground transition-colors hover:bg-muted"
                  >
                    {item.label}
                  </Link>

                  {item.children && (
                    <div className="ml-4 border-l-2 border-border pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="my-2 border-t border-border" />

              <LanguageDropdown mobile />

              <Button
                nativeButton={false}
                render={<a href={loginHref} />}
                onClick={(event) => {
                  event.preventDefault();
                  login();
                }}
                className="mt-4 h-11 rounded-full bg-[#00932a] text-base font-bold text-white hover:bg-[#007d24]"
              >
                Login
              </Button>

              <Button
                nativeButton={false}
                render={<Link href="/register" />}
                variant="outline"
                className="h-11 rounded-full border-2 border-[#feb90d] bg-transparent text-base font-bold text-[#d99400] hover:bg-[#feb90d]/10 hover:text-[#b87d00]"
              >
                Signup
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
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