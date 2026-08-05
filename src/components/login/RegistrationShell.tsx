"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import registerIllustration from "../../../public/image/auth/register-illustration.png";
import { cn } from "@/lib/utils";

type RegistrationShellProps = {
  children: ReactNode;
  contentClassName?: string;
  variant?: "compact" | "figma";
};

export function RegistrationShell({
  children,
  contentClassName,
  variant = "compact",
}: RegistrationShellProps) {
  const t = useTranslations("Register.shell");
  const isFigma = variant === "figma";

  return (
    <section
      className={cn(
        "registration-page fixed inset-0 z-50 overflow-y-auto",
        "bg-white font-body transition-colors",
        "dark:bg-background",
      )}
    >
      <div
        className={cn(
          "mx-auto flex min-h-full w-full items-center justify-center",
          "px-4 sm:px-8 md:px-10",
          isFigma
            ? "max-w-[1440px] py-4 lg:px-[100px]"
            : "max-w-[1360px] py-6 sm:py-7 lg:px-20",
        )}
      >
        <div
          className={cn(
            "grid w-full items-center",
            "border border-transparent",
            "bg-white shadow-[4px_4px_10px_4px_#e5e7eb]",
            "transition-colors",
            "dark:border-border",
            "dark:bg-background",
            "dark:shadow-[4px_4px_18px_4px_rgba(0,0,0,0.45)]",
            isFigma
              ? "max-w-[1240px] gap-6 rounded-[16px] p-4 sm:gap-8 sm:rounded-[20px] sm:p-6 lg:min-h-[650px] lg:grid-cols-[minmax(0,620px)_minmax(360px,513px)] lg:gap-20 lg:rounded-[25px] lg:p-5"
              : "max-w-[1120px] gap-6 rounded-[16px] p-4 sm:gap-8 sm:rounded-[20px] sm:p-5 lg:min-h-[700px] lg:grid-cols-[minmax(0,540px)_minmax(340px,460px)] lg:gap-16 lg:rounded-[22px] lg:p-[18px]",
          )}
        >
          <div
            className={cn(
              "mx-auto w-full text-foreground",
              isFigma ? "max-w-[580px]" : "max-w-[520px]",
              contentClassName,
            )}
          >
            <h1
              className={cn(
                "text-center font-body font-bold text-primary",
                isFigma
                  ? "mb-2 text-xl tracking-[-0.6px] sm:mb-3 sm:text-2xl md:text-[30px]"
                  : "mb-4 text-lg tracking-[-0.54px] sm:mb-6 sm:text-xl md:text-[27px]",
              )}
            >
              {t("title")}
            </h1>

            {children}
          </div>

          <div className="mx-auto hidden w-full flex-col lg:flex">
            <div
              className={cn(
                "mb-4 flex w-full justify-end",
                isFigma ? "max-w-[513px]" : "max-w-[460px]",
              )}
            >
              <Link
                href="/store"
                aria-label={t("backAria")}
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2",
                  "rounded-full border-2 border-secondary bg-transparent px-5",
                  "text-sm font-semibold text-secondary",
                  "transition-all duration-200",
                  "hover:-translate-y-0.5",
                  "hover:bg-secondary/10",
                  "hover:shadow-sm",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-secondary/50",
                  "focus-visible:ring-offset-2",
                  "dark:border-secondary",
                  "dark:bg-transparent",
                  "dark:text-secondary",
                  "dark:hover:bg-secondary/10",
                  "dark:focus-visible:ring-offset-background",
                )}
              >
                <span>{t("backToWebsite")}</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <div
              className={cn(
                "relative w-full overflow-hidden",
                "aspect-[512.828/523.867]",
                isFigma
                  ? "max-w-[513px] rounded-[25px]"
                  : "max-w-[460px] rounded-[22px]",
              )}
            >
              <Image
                src={registerIllustration}
                alt={t("illustrationAlt")}
                width={645}
                height={645}
                priority
                sizes="513px"
                className="absolute left-[-12.92%] top-[-12.26%] h-[123.18%] w-[125.83%] max-w-none"
              />
            </div>
          </div>

          <div className="flex justify-center lg:hidden">
            <Link
              href="/"
              aria-label={t("backAria")}
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2",
                "rounded-full bg-transparent px-5",
                "text-sm font-semibold text-secondary",
                "transition-all duration-200",
                "hover:bg-secondary/10",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-secondary/50",
                "focus-visible:ring-offset-2",
                "dark:bg-transparent",
                "dark:text-secondary",
                "dark:hover:bg-secondary/10",
                "dark:focus-visible:ring-offset-background",
              )}
            >
              <span>{t("backToWebsite")}</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}