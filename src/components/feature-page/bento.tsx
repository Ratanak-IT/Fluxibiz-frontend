import {
  BarChart3,
  Check,
  Monitor,
  PackageCheck,
  QrCode,
  Smartphone,
  Tablet,
  Utensils,
} from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { MODULES, type Module } from "./modules";

const CARD_LAYOUTS: Record<Module["id"], string> = {
  dynamic: "lg:col-span-7",
  responsive: "lg:col-span-5",
  platform: "lg:col-span-4",
  "mini-commerce": "lg:col-span-4",
  "modern-pos": "md:col-span-2 lg:col-span-4",
};

const CARD_SURFACES: Record<Module["id"], string> = {
  dynamic:
    "border-primary/20 bg-[linear-gradient(145deg,#ffffff_0%,#e9f7ed_100%)] text-text",
  responsive:
    "border-primary/20 bg-[linear-gradient(145deg,#ffffff_0%,#e9f7ed_100%)] text-text",
  platform:
    "border-primary/20 bg-[linear-gradient(145deg,#edf8f0_0%,#ffffff_100%)] text-text",
  "mini-commerce":
    "border-accent/20 bg-[linear-gradient(145deg,#fff4f3_0%,#ffffff_100%)] text-text",
  "modern-pos":
    "border-primary/25 bg-[linear-gradient(135deg,#006d1f_0%,#00932A_100%)] text-white",
};

function FeatureVisual({ id }: { id: Module["id"] }) {
  if (id === "dynamic") {
    return (
      <div className="relative mt-8 h-32 overflow-hidden rounded-2xl border border-primary/15 bg-white p-4 shadow-sm dark:border-white/15 dark:bg-white/5">
        <div className="flex items-center justify-between text-xs font-semibold text-text dark:text-white">
          <span>Live performance</span>

          <span className="flex items-center gap-1.5 text-primary">
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            Updating now
          </span>
        </div>

        <div className="mt-6 flex h-16 items-end gap-2">
          {[35, 54, 42, 74, 63, 92, 78, 100].map((height, index) => (
            <span
              key={`${height}-${index}`}
              className={cn(
                "flex-1 rounded-t-md",
                index === 7 ? "bg-secondary" : "bg-primary",
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (id === "responsive") {
    return (
      <div className="mt-8 flex h-32 items-end justify-center gap-3">
        <div className="rounded-lg border-2 border-text/70 bg-white p-1 shadow-lg dark:border-white/30 dark:bg-white/5">
          <Monitor className="size-14 text-primary" />
        </div>

        <div className="rounded-lg border-2 border-text/70 bg-white p-1.5 shadow-lg dark:border-white/30 dark:bg-white/5">
          <Tablet className="size-10 text-primary" />
        </div>

        <div className="rounded-lg border-2 border-text/70 bg-white p-1 shadow-lg dark:border-white/30 dark:bg-white/5">
          <Smartphone className="size-7 text-primary" />
        </div>
      </div>
    );
  }

  if (id === "platform") {
    const platformItems = [
      { label: "POS", icon: Utensils },
      { label: "Orders", icon: PackageCheck },
      { label: "Reports", icon: BarChart3 },
      { label: "Online", icon: Smartphone },
    ];

    return (
      <div className="mt-8 grid grid-cols-2 gap-2">
        {platformItems.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-xl border border-primary/12 bg-white p-3 text-xs font-semibold text-text shadow-sm dark:border-white/15 dark:bg-white/5 dark:text-white"
          >
            <Icon className="size-4 text-primary" />
            {label}
          </div>
        ))}
      </div>
    );
  }

  if (id === "mini-commerce") {
    return (
      <div className="mt-8 flex items-center gap-4 rounded-2xl border border-accent/15 bg-white p-4 shadow-sm dark:border-white/15 dark:bg-white/5">
        <div className="grid size-20 shrink-0 place-items-center rounded-xl bg-text text-white dark:bg-white dark:text-background">
          <QrCode className="size-14" />
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-text dark:text-white">
            <Utensils className="size-4 text-accent" />
            Your digital menu
          </div>

          <p className="mt-1 text-xs leading-5 text-muted-foreground dark:text-white/70">
            Scan, browse, and order—no app required.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-white/20 bg-white text-text shadow-2xl dark:bg-white/5 dark:text-white">
      <div className="flex items-center justify-between border-b border-description px-4 py-3 dark:border-white/15">
        <span className="text-sm font-bold">New sale</span>

        <span className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white">
          Checkout
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3">
        {["Wagyu burger", "Iced latte", "Fresh salad"].map(
          (product, index) => (
            <div
              key={product}
              className="rounded-xl bg-background p-2 dark:bg-white/10"
            >
              <div
                className={cn(
                  "mb-2 h-8 rounded-lg",
                  index === 0
                    ? "bg-secondary"
                    : index === 1
                      ? "bg-primary/20"
                      : "bg-accent/20",
                )}
              />

              <p className="truncate text-[10px] font-semibold">
                {product}
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export function FeatureBento() {
  return (
    <section className="bg-background px-5 py-20 text-text md:px-8 md:py-28 dark:text-white">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Greater than a feature list
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-text md:text-6xl dark:text-white">
            One powerful platform.
            <span className="block text-primary">
              Built for how you work.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg dark:text-white/70">
            A dynamic, device-ready commerce platform that connects the
            counter, dashboard, and customer experience.
          </p>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-12">
          {MODULES.map((item, index) => {
            const Icon = item.icon;
            const isModernPos = item.id === "modern-pos";

            return (
              <Reveal
                key={item.id}
                delay={index * 0.06}
                className={CARD_LAYOUTS[item.id]}
              >
                <GlassCard
                  className={cn(
                    "group h-full min-h-[380px] overflow-hidden border p-6",
                    "transition-all duration-300 hover:-translate-y-1",
                    "hover:shadow-[0_28px_70px_-30px_rgba(0,147,42,0.5)]",
                    "dark:hover:shadow-[0_28px_70px_-30px_rgba(33,185,75,0.5)]",
                    "sm:p-7",

                    CARD_SURFACES[item.id],

                    // Remove the light gradient and use background in dark mode.
                    "dark:border-white/20 dark:bg-none dark:bg-background dark:text-white",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={cn(
                        "grid size-12 place-items-center rounded-2xl",
                        isModernPos
                          ? "bg-white text-primary"
                          : "bg-primary text-white",
                        "dark:bg-white dark:text-primary",
                      )}
                    >
                      <Icon className="size-6" />
                    </span>

                    <span
                      className={cn(
                        "font-mono text-xs",
                        isModernPos
                          ? "text-white/60"
                          : "text-text/40 dark:text-white/60",
                      )}
                    >
                      {item.index}
                    </span>
                  </div>

                  <h3 className="mt-7 text-2xl font-bold dark:text-white">
                    {item.title}
                  </h3>

                  <p
                    className={cn(
                      "mt-3 max-w-xl leading-6",
                      isModernPos
                        ? "text-white/75"
                        : "text-muted-foreground dark:text-white/75",
                    )}
                  >
                    {item.promise}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.features.slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full",
                          "px-2.5 py-1 text-[11px] font-semibold",
                          isModernPos
                            ? "bg-white/12 text-white"
                            : "bg-primary/8 text-primary dark:bg-white/10 dark:text-white",
                        )}
                      >
                        <Check className="size-3" />
                        {feature}
                      </span>
                    ))}
                  </div>

                  <FeatureVisual id={item.id} />
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}