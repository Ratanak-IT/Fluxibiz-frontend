"use client";

import Image from "next/image";
import {useLocale, useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {Check, ChevronDown} from "lucide-react";

import englishFlag from "../../../public/image/flags/english.png";
import khmerFlag from "../../../public/image/flags/khmer.png";

import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SupportedLocale = "en" | "km";

interface LanguageSwitcherButtonProps {
  mobile?: boolean;
  variant?: "before-login" | "after-login";
}

export default function LanguageSwitcherButtonComponent({
  mobile = false,
  variant = "before-login",
}: LanguageSwitcherButtonProps) {
  const locale = useLocale();
  const t = useTranslations("Common");
  const router = useRouter();

  const isKhmer = locale === "km";
  const isAfterLogin = variant === "after-login";

  function changeLanguage(nextLocale: SupportedLocale) {
    if (nextLocale === locale) return;

    document.cookie = [
      `NEXT_LOCALE=${nextLocale}`,
      "path=/",
      "max-age=31536000",
      "samesite=lax",
    ].join("; ");

    router.refresh();
  }

  const dropdownItemClassName = `
    group
    cursor-pointer
    gap-3
    py-2
    text-sm
    font-medium
    text-[#374151]
    outline-none
    transition-colors

    data-[highlighted]:bg-primary/10
    data-[highlighted]:!text-primary
    data-[highlighted]:[&>span]:!text-primary

    hover:bg-primary/10
    hover:!text-primary
    hover:[&>span]:!text-primary

    focus:bg-primary/10
    focus:!text-primary
    focus:[&>span]:!text-primary

    dark:text-white
    dark:data-[highlighted]:bg-primary/10
    dark:data-[highlighted]:!text-primary
    dark:data-[highlighted]:[&>span]:!text-primary
    dark:hover:bg-primary/10
    dark:hover:!text-primary
    dark:hover:[&>span]:!text-primary
  `;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            aria-label={t("changeLanguage")}
            className={
              mobile
                ? `
                    group h-11 w-full justify-start gap-3 !bg-transparent px-3
                    text-base font-semibold text-[#374151] shadow-none
                    hover:!bg-transparent hover:text-primary
                    focus-visible:!bg-transparent focus-visible:text-primary
                    aria-expanded:!bg-transparent aria-expanded:text-primary
                    dark:!bg-transparent dark:text-white
                    dark:hover:!bg-transparent dark:hover:text-primary
                  `
                : isAfterLogin
                  ? `
                      group h-10 gap-2 rounded-full !bg-transparent px-3
                      text-sm font-semibold text-[#4b5563] shadow-none
                      hover:!bg-transparent hover:text-secondary
                      focus-visible:!bg-transparent focus-visible:text-secondary
                      aria-expanded:!bg-transparent aria-expanded:text-secondary
                      dark:!bg-transparent dark:text-white
                      dark:hover:!bg-transparent dark:hover:text-secondary
                    `
                  : `
                      group h-10 gap-2 rounded-full !bg-transparent px-3
                      text-sm font-semibold text-[#374151] shadow-none
                      hover:!bg-transparent hover:text-primary
                      focus-visible:!bg-transparent focus-visible:text-primary
                      aria-expanded:!bg-transparent aria-expanded:text-primary
                      dark:!bg-transparent dark:text-white
                      dark:hover:!bg-transparent dark:hover:text-primary
                    `
            }
          />
        }
      >
        <Image
          src={isKhmer ? khmerFlag : englishFlag}
          alt={isKhmer ? t("khmer") : t("english")}
          width={40}
          height={28}
          className="h-5 w-8 object-cover"
        />

        {mobile && (
          <span className="text-current">
            {isKhmer ? t("khmer") : t("english")}
          </span>
        )}

        <ChevronDown
          className={
            isAfterLogin
              ? "size-4 shrink-0 transition-colors group-hover:stroke-secondary"
              : "size-4 shrink-0 transition-colors group-hover:stroke-primary"
          }
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={mobile ? "start" : "end"}
        className="min-w-44 border-[#e5e7eb] bg-white p-2 text-[#111827] dark:border-white/10 dark:bg-background dark:text-white"
      >
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className={dropdownItemClassName}
        >
          <Image
            src={englishFlag}
            alt={t("english")}
            width={32}
            height={24}
            className="h-5 w-8 object-cover"
          />
          <span className="flex-1 text-[#374151] transition-colors group-hover:!text-primary group-data-[highlighted]:!text-primary dark:text-white">
            {t("english")}
          </span>
          {locale === "en" && <Check className="size-4 shrink-0 !text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => changeLanguage("km")}
          className={dropdownItemClassName}
        >
          <Image
            src={khmerFlag}
            alt={t("khmer")}
            width={32}
            height={24}
            className="h-5 w-8 object-cover"
          />
          <span className="flex-1 text-[#374151] transition-colors group-hover:!text-primary group-data-[highlighted]:!text-primary dark:text-white">
            {t("khmer")}
          </span>
          {locale === "km" && <Check className="size-4 shrink-0 !text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}