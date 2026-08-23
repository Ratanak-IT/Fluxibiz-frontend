"use client";

import type { CSSProperties, ReactNode } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Check } from "lucide-react";

import {
  Eyebrow,
  LANDING_IMAGES,
  Section,
  SectionHeading,
} from "./landing-shared";
import { ScrollReveal } from "./scroll-reveal";

const revenueBars = [45, 65, 85, 55, 95, 40, 70];

function ToolCard({
    label,
    title,
    className,
    children,
    inverted = false,
}: {
    label: string;
    title: string;
    className?: string;
    children?: ReactNode;
    inverted?: boolean;
}) {
    return (
        <div
            className={`group h-full gap-0 overflow-hidden rounded-2xl border border-border text-card-foreground p-5 sm:p-6 ${className}`}
        >
            <div className="origin-center transition-transform duration-500 ease-out group-hover:scale-[1.04]">
                <p
                    className={`text-xs font-semibold uppercase tracking-[0.10em] ${inverted ? "text-white/80" : "text-brand"}`}
                >
                    {label}
                </p>
                <h3
                    className={`mt-1.5 font-display text-base font-bold ${inverted ? "text-white" : "text-foreground"}`}
                >
                    {title}
                </h3>
                {children}
            </div>
        </div>
    );
}

export function ToolsBento() {
  const t = useTranslations("Feature.tools");

  const stock = [
    {
      name: t("inventory.coffee"),
      value: 72,
      color: "bg-brand",
    },
    {
      name: t("inventory.rice"),
      value: 45,
      color: "bg-brand",
    },
    {
      name: t("inventory.cola"),
      value: 12,
      color: "bg-rose",
      note: t("inventory.lowReorder"),
    },
  ];

  const staff = [
    {
      initials: "SC",
      name: "Sokha",
      role: t("employees.till"),
      online: true,
    },
    {
      initials: "VL",
      name: "Vichea",
      role: t("employees.kitchen"),
      online: true,
    },
    {
      initials: "SP",
      name: "Srey",
      role: t("employees.floor"),
      online: true,
    },
    {
      initials: "DK",
      name: "Dara",
      role: t("employees.offShift"),
      online: false,
    },
  ];

  return (
    <Section className="dark:bg-background">
      <Eyebrow>{t("eyebrow")}</Eyebrow>

      <SectionHeading className="mt-3">
        {t("headingLine1")}
        <br />
        {t("headingLine2")}
      </SectionHeading>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
        <ScrollReveal direction="up" delay={0} className="h-full lg:row-span-2">
          <ToolCard
            label={t("pos.label")}
            title={t("pos.title")}
            className="bg-card"
          >
            <div className="relative mt-5 aspect-[1.55/1] overflow-hidden rounded-xl border border-border bg-card">
              <Image
                src={LANDING_IMAGES.tools.posScreen}
                alt={t("pos.imageAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-contain"
              />
            </div>
          </ToolCard>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={120} className="h-full">
          <ToolCard
            label={t("online.label")}
            title={t("online.title")}
            className="border-brand bg-[#00932A] text-white"
            inverted
          >
            <div className="mt-5 flex items-center gap-4">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-white sm:size-28">
                <Image
                  src={LANDING_IMAGES.tools.product}
                  alt={t("online.imageAlt")}
                  fill
                  sizes="112px"
                  className="object-contain p-2"
                />
              </div>

              <div className="min-w-0 text-sm">
                <p className="font-semibold text-white">
                  {t("online.syncTitle")}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-white/70">
                  {t("online.description")}
                </p>

                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                  <Check className="size-3.5 animate-bounce" />
                  {t("online.checkout")}
                </span>
              </div>
            </div>
          </ToolCard>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={220} className="h-full">
          <ToolCard
            className="bg-card"
            label={t("social.label")}
            title={t("social.title")}
          >
            <div className="mt-5 overflow-hidden rounded-xl border border-border">
              <div className="flex justify-between bg-sidebar px-4 py-3 text-xs text-sidebar-foreground">
                <span>{t("social.table")}</span>
                <span className="flex items-center gap-1.5 text-secondary">
                  <span className="animate-pulse" />
                  04:12
                </span>
              </div>

              <ul className="space-y-3 px-4 py-4 text-sm">
                <li className="flex justify-between">
                  <span>{t("social.beef")}</span>
                  <span className="text-secondary">
                    {t("social.noChili")}
                  </span>
                </li>

                <li>{t("social.fish")}</li>

                <li className="flex justify-between">
                  <span>{t("social.latte")}</span>
                  <span className="text-secondary">
                    {t("social.lessIce")}
                  </span>
                </li>
              </ul>
            </div>
          </ToolCard>
        </ScrollReveal>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3 md:items-stretch">
        <ScrollReveal direction="up" delay={0} className="h-full">
          <ToolCard
            className="bg-card"
            label={t("inventory.label")}
            title={t("inventory.title")}
          >
            <ul className="mt-5 space-y-4">
              {stock.map((item) => (
                <li key={item.name}>
                  <div className="flex justify-between text-xs">
                    <span>{item.name}</span>
                    <span
                      className={
                        item.note
                          ? "flex items-center gap-1.5 text-rose"
                          : "text-muted-foreground"
                      }
                    >
                      {item.note ? (
                        <>
                          <span className="size-1.5 rounded-full bg-rose animate-pulse" />
                          {item.note}
                        </>
                      ) : (
                        `${item.value}%`
                      )}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`bento-bar h-full rounded-full ${item.color}`}
                      style={{
                        "--bar-fill": `${item.value}%`,
                      } as CSSProperties}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </ToolCard>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={120} className="h-full">
          <ToolCard
            label={t("reports.label")}
            title={t("reports.title")}
            className="bg-card"
          >
            <div className="mt-5 flex items-baseline justify-between">
              <p className="font-display text-2xl font-bold">
                $12,450
                <span className="ml-2 align-middle text-xs font-semibold text-brand">
                  ▲ 12.5%
                </span>
              </p>
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-brand">
                <span className="size-1.5 rounded-full bg-brand animate-pulse" />
                {t("reports.live")}
              </span>
            </div>

            <div
              className="mt-4 flex h-20 items-end gap-2"
              role="img"
              aria-label={t("reports.trendLabel")}
            >
              {revenueBars.map((value, i) => (
                <span
                  key={i}
                  className={`bento-bar-v flex-1 rounded-sm ${
                    value === Math.max(...revenueBars)
                      ? "bg-brand-deep"
                      : "bg-brand/20"
                  }`}
                  style={
                    {
                      "--bar-fill": `${value}%`,
                      "--bar-delay": `${i * 60}ms`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </ToolCard>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={240} className="h-full">
          <ToolCard
            className="bg-card"
            label={t("employees.label")}
            title={t("employees.title")}
          >
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {staff.map((person) => (
                <li
                  key={person.name}
                  className="flex min-w-0 items-center gap-2 rounded-xl border border-border p-2.5 transition-colors duration-300 hover:border-brand/40"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[10px] font-semibold text-brand">
                    {person.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold">
                      {person.name}
                    </span>
                    <span className="flex items-center gap-1 truncate text-[10px] text-muted-foreground">
                      <span
                        className={`size-1.5 shrink-0 rounded-full ${
                          person.online ? "bg-brand animate-pulse" : "bg-border"
                        }`}
                      />
                      {person.role}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </ToolCard>
        </ScrollReveal>
      </div>
    </Section>
  );
}
