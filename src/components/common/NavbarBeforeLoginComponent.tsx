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

type NavigationItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const navigationItems: NavigationItem[] = [
  {
    label: "Business",
    href: "#business",
  },
  {
    label: "Feature",
    href: "#features",
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-[55px] max-w-[1330px] items-center justify-between px-6 sm:px-10">
        
        {/* Desktop Logo - Scaled down to w-[130px] */}
        <Link href="/" aria-label="FluxiBiz home">
          <Image
            src={fluxibizLogo}
            alt="FluxiBiz"
            width={240}
            height={90}
            priority
            className="h-auto w-[130px] object-contain"
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
                className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <ThemeToggle />
          <LanguageDropdown />

          <Button
            nativeButton={false}
            render={<Link href="/login" />}
            className="h-9 rounded-full border border-[#00932a] bg-[#00932a] px-8 text-sm font-bold text-white shadow-none hover:bg-[#007d24]"
          >
            Login
          </Button>

          <Button
            nativeButton={false}
            render={<Link href="/register" />}
            variant="outline"
            className="h-11 rounded-full border-2 border-[#00932a] bg-transparent px-8 text-base font-bold text-[#00932a] hover:bg-[#00932a]/10 hover:text-[#007d24]"
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
                {/* Mobile Drawer Logo - Scaled down to w-[120px] */}
                <Image
                  src={fluxibizLogo}
                  alt="FluxiBiz"
                  width={180}
                  height={80}
                  className="h-auto w-[120px] object-contain"
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
                render={<Link href="/login" />}
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
                ? "w-full justify-start gap-3 text-lg font-semibold hover:bg-transparent hover:text-inherit aria-expanded:bg-transparent aria-expanded:text-inherit"
                : "h-12 gap-2  px-3 text-base font-semibold hover:bg-transparent hover:text-inherit aria-expanded:bg-transparent aria-expanded:text-inherit"
            }
          />
        }
      >
        <Image
          src={englishFlag}
          alt="English"
          width={40}
          height={28}
          className="h-7 w-10 object-cover "
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
            className="h-6 w-9 object-cover"
          />
          English
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-3 py-2 text-sm font-medium">
          <Image
            src={khmerFlag}
            alt=""
            width={32}
            height={24}
            className="h-6 w-9 object-cover"
          />
          Khmer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}