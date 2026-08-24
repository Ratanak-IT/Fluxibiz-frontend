"use client";

import {
  ArrowRight,
  CheckCheck,
  DatabaseZap,
  FileDown,
  Network,
  RadioTower,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { Accent, RuledEyebrow, Section } from "./landing-shared";
import { ScrollReveal } from "./scroll-reveal";

type Tone = "brand" | "amber" | "rose" | "blue";
type MigrationKey = "legacy" | "nifi" | "debezium" | "modern";

interface MigrationItem {
  translationKey: MigrationKey;
  icon: LucideIcon;
  tone: Tone;
  pointKeys: readonly string[];
}

const TONES = {
  brand: {
    icon: "border-primary/25 bg-primary/10 text-primary",
    title: "text-primary",
    glow: "group-hover:shadow-[0_24px_70px_-30px_rgba(0,147,42,0.45)]",
    accent: "bg-primary",
  },
  amber: {
    icon: "border-secondary/35 bg-secondary/15 text-secondary",
    title: "text-secondary",
    glow: "group-hover:shadow-[0_24px_70px_-30px_rgba(254,185,13,0.5)]",
    accent: "bg-secondary",
  },
  rose: {
    icon:
      "border-[#D14341]/25 bg-[#D14341]/10 text-[#D14341] dark:border-[#D14341]/25 dark:bg-[#D14341]/10 dark:text-[#D14341]",
    title: "text-[#D14341] dark:text-[#D14341]",
    glow:
      "group-hover:shadow-[0_24px_70px_-30px_rgba(209,67,65,0.4)]",
    accent: "bg-[#D14341]",
  },
  blue: {
    icon: "border-primary/25 bg-primary/10 text-primary",
    title: "text-primary",
    glow: "group-hover:shadow-[0_24px_70px_-30px_rgba(0,147,42,0.45)]",
    accent: "bg-primary",
  },
} satisfies Record<Tone, Record<string, string>>;

const ITEMS: MigrationItem[] = [
  {
    translationKey: "legacy",
    icon: FileDown,
    tone: "brand",
    pointKeys: ["import", "prepare", "reduce"],
  },
  {
    translationKey: "nifi",
    icon: Network,
    tone: "amber",
    pointKeys: ["connect", "control", "transform"],
  },
  {
    translationKey: "debezium",
    icon: RadioTower,
    tone: "blue",
    pointKeys: ["capture", "synchronize", "downtime"],
  },
  {
    translationKey: "modern",
    icon: Sparkles,
    tone: "rose",
    pointKeys: ["workflow", "transition", "foundation"],
  },
];

function FlowArtwork() {
  const t = useTranslations("Support.migration.flow");

  const sourceLabels = [
    t("legacyDatabase"),
    t("excelCsv"),
    t("oldPos"),
  ];

  return (
    <div
      className="relative hidden min-h-[260px] overflow-hidden rounded-[28px] border border-border/70 bg-muted/40 p-6 lg:block"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,147,42,0.14),transparent_42%)]" />

      <div className="relative flex h-full items-center justify-between gap-4">
        <div className="flex w-[30%] flex-col gap-3">
          {sourceLabels.map((label) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-background px-4 py-3 text-center text-sm font-semibold shadow-sm"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="flex flex-1 flex-col items-center">
          <ArrowRight className="mb-3 size-7 text-muted-foreground" />

          <div className="w-full rounded-2xl border-2 border-secondary bg-secondary/10 p-5 text-center shadow-sm">
            <DatabaseZap className="mx-auto size-8 text-[#d99c00] dark:text-secondary" />

            <p className="mt-3 text-sm font-bold text-foreground">
              {t("technology")}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {t("technologyDescription")}
            </p>
          </div>

          <ArrowRight className="mt-3 size-7 text-muted-foreground" />
        </div>

        <div className="flex w-[30%] flex-col items-center rounded-2xl border-2 border-primary bg-primary/10 p-5 text-center shadow-sm">
          <ShieldCheck className="size-9 text-primary" />

          <p className="mt-3 text-sm font-bold text-primary">
            {t("platform")}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {t("platformDescription")}
          </p>
        </div>
      </div>
    </div>
  );
}

function MigrationCard({
  item,
  index,
  featured = false,
}: {
  item: MigrationItem;
  index: number;
  featured?: boolean;
}) {
  const t = useTranslations("Support.migration.cards");
  const { icon: Icon, translationKey, tone, pointKeys } = item;
  const style = TONES[tone];

  const eyebrow = t(`${translationKey}.eyebrow`);
  const title = t(`${translationKey}.title`);
  const body = t(`${translationKey}.body`);
  const points = pointKeys.map((pointKey) =>
    t(`${translationKey}.points.${pointKey}`),
  );

  return (
    <Card
      className={`group relative h-full overflow-hidden rounded-[26px] border-border/70 bg-card p-0 transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 ${style.glow}`}
    >
      <div
        className={`h-full p-6 sm:p-7 ${
          featured ? "lg:grid lg:grid-cols-[0.92fr_1.08fr] lg:gap-7" : ""
        }`}
      >
        <div>
          <div className="flex items-start justify-between gap-4">
            <span
              className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border ${style.icon}`}
            >
              <Icon className="size-6 stroke-[2.1]" />
            </span>

            <span className="text-sm font-bold text-muted-foreground/50">
              0{index + 1}
            </span>
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.10em] text-muted-foreground">
            {eyebrow}
          </p>

          <h3
            className={`mt-3 font-body text-xl font-extrabold leading-[1.35] tracking-[0.02em] sm:text-2xl ${style.title}`}
          >
            {title}
          </h3>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            {body}
          </p>

          <ul className="mt-6 space-y-4">
            {points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-[18px] leading-7 text-foreground/80"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <CheckCheck className="size-3.5 text-primary" />
                </span>

                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {featured ? <FlowArtwork /> : null}
      </div>
    </Card>
  );
}

export function MigrationSection() {
  const t = useTranslations("Support.migration");

  return (
    <Section className="bg-background py-16 font-body md:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <RuledEyebrow>{t("eyebrow")}</RuledEyebrow>

        <h2 className="mt-5 font-body text-3xl font-extrabold leading-[1.25] text-brand-deep md:text-[2.75rem]">
          {t("titleFirst")} <Accent>{t("titleAccent")}</Accent>
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ScrollReveal
          direction="up"
          delay={0}
          className="lg:col-span-2"
        >
          <MigrationCard item={ITEMS[0]} index={0} featured />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={120}>
          <MigrationCard item={ITEMS[1]} index={1} />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={240}>
          <MigrationCard item={ITEMS[2]} index={2} />
        </ScrollReveal>

        <ScrollReveal
          direction="up"
          delay={360}
          className="lg:col-span-2"
        >
          <MigrationCard item={ITEMS[3]} index={3} />
        </ScrollReveal>
      </div>
    </Section>
  );
}