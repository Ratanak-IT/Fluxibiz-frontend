import type { CSSProperties } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  Eyebrow,
  LANDING_IMAGES,
  Section,
  SectionHeading,
} from "./landing-shared";
import { ScrollReveal } from "./scroll-reveal";

const revenueBars = [45, 65, 85, 55, 95, 40, 70];

const stock = [
  { name: "Coffee beans", value: 72, color: "bg-brand" },
  { name: "Rice 25kg", value: 45, color: "bg-brand" },
  { name: "Cola cans", value: 12, color: "bg-rose", note: "low · reorder" },
];

const staff = [
  { initials: "SC", name: "Sokha", role: "Till", online: true },
  { initials: "VL", name: "Vichea", role: "Kitchen", online: true },
  { initials: "SP", name: "Srey", role: "Floor", online: true },
  { initials: "DK", name: "Dara", role: "Off shift", online: false },
];

function ToolCard({
  label,
  title,
  className = "",
  inverted = false,
  children,
}: {
  label: string;
  title: string;
  className?: string;
  inverted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card
      className={`group h-full gap-0 overflow-hidden rounded-2xl border-border p-5 sm:p-6 ${className}`}
    >
      <div className="origin-center transition-transform duration-500 ease-out group-hover:scale-[1.04]">
        <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${inverted ? "text-white/80" : "text-brand"}`}>
          {label}
        </p>
        <h3 className={`mt-1.5 font-display text-base font-bold ${inverted ? "text-white" : "text-foreground"}`}>
          {title}
        </h3>
        {children}
      </div>
    </Card>
  );
}

export function ToolsBento() {
  return (
    <Section>
      <Eyebrow>01 — Everything in one place</Eyebrow>
      <SectionHeading className="mt-3">
        Four tools. One counter.
        <br />
        Your whole business, handled
      </SectionHeading>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
        <ScrollReveal direction="up" delay={0} className="h-full lg:row-span-2">
          <ToolCard
            label="POS · Orders"
            title="A till your staff learn in one afternoon"
          >
            <div className="relative mt-5 aspect-[1.55/1] overflow-hidden rounded-xl border border-border bg-white">
              <Image
                src={LANDING_IMAGES.tools.posScreen}
                alt="FluxiBiz point-of-sale screen"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-contain"
              />
            </div>
          </ToolCard>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={120} className="h-full">
          <ToolCard
            label="Online commerce"
            title="Your storefront, open around the clock"
            className="border-brand bg-brand text-white"
            inverted
          >
            <div className="mt-5 flex items-center gap-4">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-white sm:size-28">
                <Image
                  src={LANDING_IMAGES.tools.product}
                  alt="Running shoe available in the online store"
                  fill
                  sizes="112px"
                  className="object-contain p-2"
                />
              </div>
              <div className="min-w-0 text-sm">
                <p className="font-semibold text-white">Web orders sync to the same till</p>
                <p className="mt-1 text-xs leading-relaxed text-white/70">
                  Customers order online and it lands on your counter—no double stock.
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                  <Check className="size-3.5 animate-bounce" /> checkout in 30s
                </span>
              </div>
            </div>
          </ToolCard>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={220} className="h-full">
          <ToolCard label="Social commerce" title="Turn DMs into paid orders">
            <div className="mt-5 overflow-hidden rounded-xl border border-border">
              <div className="flex justify-between bg-[#101710] px-4 py-3 text-xs text-white">
                <span>#2241 · Table 04</span>
                <span className="flex items-center gap-1.5 text-secondary">
                  <span className="animate-pulse" />
                  04:12
                </span>
              </div>
              <ul className="space-y-3 px-4 py-4 text-sm">
                <li className="flex justify-between">
                  <span>2× Beef Lok Lak</span>
                  <span className="text-secondary">no chili</span>
                </li>
                <li>1× Fish Amok</li>
                <li className="flex justify-between">
                  <span>3× Iced Latte</span>
                  <span className="text-secondary">less ice</span>
                </li>
              </ul>
            </div>
          </ToolCard>
        </ScrollReveal>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3 md:items-stretch">
        <ScrollReveal direction="up" delay={0} className="h-full">
          <ToolCard label="Inventory" title="Stock that counts itself">
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
                      style={{ "--bar-fill": `${item.value}%` } as CSSProperties}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </ToolCard>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={120} className="h-full">
          <ToolCard
            label="Reports · Analytics"
            title="Know the day before you lock the door"
            className="bg-brand-soft"
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
                live
              </span>
            </div>
            <div
              className="mt-4 flex h-20 items-end gap-2"
              role="img"
              aria-label="Revenue trend, last 7 days"
            >
              {revenueBars.map((value, i) => (
                <span
                  key={i}
                  className={`bento-bar-v flex-1 rounded-sm ${
                    value === Math.max(...revenueBars) ? "bg-brand-deep" : "bg-brand/20"
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
          <ToolCard label="Employees" title="Shifts & roles">
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {staff.map((person) => (
                <li
                  key={person.name}
                  className="flex min-w-0 items-center gap-2 rounded-xl border border-border p-2.5 transition-colors duration-300 hover:border-brand/40"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[10px] font-semibold text-brand">
                    {person.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold">{person.name}</span>
                    <span className="flex items-center gap-1 truncate text-[10px] text-muted-foreground">
                      <span
                        className={`size-1.5 shrink-0 rounded-full ${person.online ? "bg-brand animate-pulse" : "bg-border"}`}
                      />
                      {person.role}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </ToolCard>
        </ScrollReveal>
      </div>
    </Section>
  );
}
