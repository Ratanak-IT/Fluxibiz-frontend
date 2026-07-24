"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";

import englishFlag from "../../../public/image/flags/english.png";
import khmerFlag from "../../../public/image/flags/khmer.png";
import fluxibizLogo from "../../../public/image/logo.png";

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

export default function NavbarBeforeLoginComponent() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 text-foreground shadow-sm shadow-black/5 backdrop-blur supports-[backdrop-filter]:bg-background/85 dark:shadow-black/25">
      <div className="mx-auto flex h-[89px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
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
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground">
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

          <Button
            render={<Link href="/login" />}
            className="h-9 rounded-full border border-[#00932a] bg-[#00932a] px-5 text-xs font-medium text-white shadow-none hover:bg-[#007d24]"
          >
            Login
          </Button>

          <Button
            render={<Link href="/register" />}
            variant="outline"
            className="h-9 rounded-full border-[#feb90d] bg-transparent px-5 text-xs font-medium text-[#d99400] hover:bg-[#feb90d]/10 hover:text-[#b87d00]"
          >
            Signup
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger
            className="lg:hidden"
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
              <ThemeToggle mobile />
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

              <div className="my-4 border-t border-border" />

              <LanguageDropdown mobile />

              <Button
                render={<Link href="/login" />}
                className="mt-4 h-11 rounded-full bg-[#00932a] text-white hover:bg-[#007d24]"
              >
                Login
              </Button>

              <Button
                render={<Link href="/register" />}
                variant="outline"
                className="h-11 rounded-full border-[#feb90d] bg-transparent text-[#d99400] hover:bg-[#feb90d]/10 hover:text-[#b87d00]"
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
