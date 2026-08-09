"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "lucide-react";

export interface AboutHeroSectionProps {
  eyebrow?: string;
  headlineHighlight?: string;
  headlineSuffix?: string;
  description?: string;
  primaryCta?: string;
  secondaryCta?: string;

  className?: string;
}

const BAR_HEIGHTS = [32, 55, 40, 70, 48, 62, 36, 58, 44, 66, 38];

function useCountUp(target: number, duration = 1500, decimals = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(target);
      return;
    }

    let animationFrame = 0;
    const startTime = performance.now();

    const tick = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setValue(target * easedProgress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    animationFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return value.toFixed(decimals);
}

export default function HeroSection({
  eyebrow,
  headlineHighlight,
  headlineSuffix,
  description,
  primaryCta,
  secondaryCta,
  className = "",
}: AboutHeroSectionProps) {
  const t = useTranslations("Feature.hero");

  const displayedEyebrow = eyebrow ?? t("eyebrow");
  const displayedHeadlineHighlight =
    headlineHighlight ?? t("headlineHighlight");
  const displayedHeadlineSuffix = headlineSuffix ?? t("headlineSuffix");
  const displayedDescription = description ?? t("description");
  const displayedPrimaryCta = primaryCta ?? t("primaryCta");
  const displayedSecondaryCta = secondaryCta ?? t("secondaryCta");

  const revenue = useCountUp(12480, 1600);
  const salesPct = useCountUp(24, 1400);

  const connectorPath = "M100 180 C 160 220, 200 240, 250 245";

  return (
    <section
      className="
        w-full
        overflow-hidden
        bg-[radial-gradient(1200px_500px_at_80%_-10%,var(--ah-brand-soft),transparent_60%),var(--background)]
        dark:bg-none
        dark:bg-[#2b2d2c]
      "
    >
      <div
        className={`
          ah-scope
          relative
          mx-auto
          flex
          w-full
          max-w-[1330px]
          flex-wrap
          items-center
          gap-10
          overflow-hidden
          px-6
          pb-0
          pt-6
          font-googlesans
          text-ink
          antialiased
          sm:px-10
          sm:pt-8
          lg:pt-10
          ${className}
        `}
      >
        {/* Left content */}
        <div className="relative z-[2] max-w-[640px] flex-[1_1_380px]">
          {displayedEyebrow && (
            <div className="animate-fade-up mb-[0.9rem] text-[0.78rem] font-bold uppercase tracking-[0.08em] text-brand opacity-0 ">
              {displayedEyebrow}
            </div>
          )}

          <h1 className="animate-fade-up-1 m-0 mb-[1.1rem] flex translate-y-4 flex-col text-[clamp(2.6rem,6vw,4.4rem)] font-extrabold leading-[1.08] tracking-[-0.02em] opacity-0">
            <span className="animate-sheen bg-[linear-gradient(100deg,var(--ah-brand-strong)_0%,var(--ah-brand)_38%,var(--ah-brand-light)_62%,var(--ah-brand)_100%)] bg-[length:220%_100%] bg-clip-text text-transparent">
              {displayedHeadlineHighlight}
            </span>

            <span className="text-ink transition-colors dark:text-secondary">
              {displayedHeadlineSuffix}
            </span>
          </h1>

          <p className="animate-fade-up-2 m-0 mb-[1.9rem] max-w-[46ch] translate-y-[14px] text-[clamp(1.1rem,1.7vw,1.35rem)] leading-[1.65] text-muted-foreground opacity-0 dark:text-white/80">
            {displayedDescription}
          </p>

          <div className="animate-fade-up-3 mb-[1.7rem] flex translate-y-[14px] flex-wrap gap-3 opacity-0">
            <button
              type="button"
              className="ease-hero relative inline-flex cursor-pointer items-center gap-[0.55rem] overflow-hidden rounded-full bg-brand px-6 py-[0.85rem] text-[0.95rem] font-semibold text-white shadow-[0_10px_24px_-8px_var(--ah-glow)] transition-[transform,box-shadow,background] duration-300 after:absolute after:inset-0 after:-translate-x-[130%] after:bg-[linear-gradient(100deg,transparent_20%,rgba(255,255,255,0.35)_50%,transparent_80%)] after:transition-transform after:duration-700 after:ease-hero after:content-[''] hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-[0_16px_32px_-10px_var(--ah-glow)] hover:after:translate-x-[130%]"
            >
              <span className="inline-flex size-[26px] items-center justify-center rounded-full bg-white/20">
                <ArrowRightIcon size={16} strokeWidth={2.5} />
              </span>

              {displayedPrimaryCta}
            </button>

            <button
              type="button"
              className="ease-hero border-line text-ink inline-flex cursor-pointer items-center gap-[0.55rem] rounded-full border bg-surface px-6 py-[0.85rem] text-[0.95rem] font-semibold transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-10px_var(--ah-shadow-md)] dark:border-white/15 dark:bg-white/10 dark:text-white"
            >
              {displayedSecondaryCta}
            </button>
          </div>
        </div>

        {/* Right scene */}
        <div className="relative z-[1] min-h-[650px] flex-[1_1_460px] max-md:hidden">
          {/* Ambient aurora */}
          <div
            className="pointer-events-none absolute inset-[-12%] z-0 blur-[46px]"
            aria-hidden
          >
            <span className="animate-blob-1 absolute left-[10%] top-[6%] size-[500px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--ah-brand)_45%,transparent),transparent_70%)] opacity-50" />

            <span className="animate-blob-2 absolute right-[4%] top-[26%] size-[240px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--ah-brand-secondary)_35%,transparent),transparent_70%)] opacity-50" />

            <span className="animate-blob-3 absolute bottom-[2%] left-[34%] size-[220px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--ah-brand)_30%,transparent),transparent_70%)] opacity-50" />
          </div>

          <div className="absolute inset-0 z-[1]">
            {/* Animated dashed connector */}
            <svg
              className="absolute inset-0 h-[80%] w-[70%]"
              viewBox="5 0 600 470"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d={connectorPath}
                className="animate-dash-flow stroke-secondary transition-colors "
                fill="none"
                strokeWidth="2"
                strokeDasharray="6 7"
              />

              <circle
                r="4.5"
                className="fill-secondary transition-colors [filter:drop-shadow(0_0_6px_var(--ah-glow))] "
              >
                <animateMotion
                  dur="2.6s"
                  repeatCount="indefinite"
                  path={connectorPath}
                />
              </circle>
            </svg>

            {/* Pulsing badge */}
            <div className="animate-pulse-badge absolute left-[24%] top-[39%] z-[3] flex size-[30px] items-center justify-center rounded-full bg-secondary text-[0.85rem] text-black shadow-[0_8px_18px_-6px_var(--ah-glow)] transition-colors  ">
              ★
            </div>

            {/* Revenue card */}
            <div className="absolute left-[2%] top-[10%] w-[20%] min-w-[160px]">
              <div className="animate-float-dashboard border-line w-full rounded-[14px] border bg-surface p-[0.7rem] opacity-0 shadow-[0_1px_2px_var(--ah-shadow-sm),0_14px_28px_-14px_var(--ah-shadow-md),0_34px_60px_-34px_var(--ah-shadow-lg)] dark:border-white/10 dark:bg-[#353735]">
                <div className="text-ink mb-[0.45rem] text-[0.82rem] font-extrabold tracking-[-0.01em] dark:text-white">
                  ${Number(revenue).toLocaleString("en-US")}
                </div>

                <div className="mb-[0.5rem] flex flex-col gap-1">
                  <div className="h-[5px] w-[70%] rounded-[3px] bg-description dark:bg-white/15" />
                  <div className="h-[5px] rounded-[3px] bg-description dark:bg-white/15" />
                </div>

                <div className="flex h-[34px] items-end gap-1">
                  {[14, 26, 18, 32, 22].map((height, index) => (
                    <span
                      key={index}
                      style={{ height: `${height}px` }}
                      className="flex-1 rounded-[2px] bg-brand opacity-85 dark:bg-secondary"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Today overview */}
            <div className="absolute left-[29%] top-[15%] w-[50%] min-w-[300px]">
              <div className="animate-float-overview border-line min-h-[200px] w-full rounded-[14px] border bg-surface-dark px-[1.1rem] pb-[0.9rem] pt-4 text-white/70 opacity-0 shadow-[0_1px_2px_var(--ah-shadow-md),0_18px_34px_-16px_var(--ah-shadow-md),0_40px_70px_-40px_var(--ah-glow)]">
                <div className="mb-[0.7rem] text-[0.85rem] font-semibold">
                  Today&apos;s overview
                </div>

                <div className="mb-[0.7rem] flex h-[200px] items-end gap-[2px]">
                  {BAR_HEIGHTS.map((height, index) => (
                    <span
                      key={index}
                      className={`animate-eq flex-1 origin-bottom rounded-[2px] ${
                        index % 3 === 0 ? "bg-brand " : "bg-white/20"
                      }`}
                      style={
                        {
                          "--h": `${height}%`,
                          "--dur": `${2.2 + (index % 4) * 0.35}s`,
                          height: `calc(${height}% * 0.5)`,
                          animationDelay: `${index * 0.09}s`,
                        } as React.CSSProperties
                      }
                    />
                  ))}
                </div>

                <div className="flex justify-between text-[0.72rem] text-white/55">
                  <span>◷ Live now</span>

                  <span className="font-semibold text-brand-light dark:text-secondary">
                    Sales +{salesPct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Order notification */}
            <div className="absolute right-0 top-[4%] w-[30%] min-w-[240px]">
              <div className="animate-float-rating border-line w-full rounded-[14px] border bg-surface px-[1.05rem] py-4 opacity-0 shadow-[0_1px_2px_var(--ah-shadow-sm),0_14px_28px_-14px_var(--ah-shadow-md),0_34px_60px_-34px_var(--ah-shadow-lg)] dark:border-white/10 dark:bg-[#353735]">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="
                      rounded-full
                      border
                      border-border
                      bg-secondary
                      px-[0.6rem]
                      py-[0.22rem]
                      text-[0.66rem]
                      font-semibold
                      text-black
                     
                    "
                  >
                    Order #1048
                  </span>

                  <span className="text-faint text-[0.7rem] dark:text-white/60">
                    2m ago
                  </span>
                </div>

                <div className="text-ink mb-1 text-[0.88rem] font-bold dark:text-white">
                  New order paid.
                </div>

                <div className="text-[0.75rem] leading-[1.45] text-[var(--ah-muted)] dark:text-white/70">
                  Your inventory and dashboard updated automatically.
                </div>
              </div>
            </div>

            {/* Payment form card */}
            <div className="absolute right-[1%] top-[57%] w-[30%] min-w-[100px]">
              <div className="animate-float-payment border-line w-full rounded-[14px] border bg-surface p-[0.65rem] opacity-0 shadow-[0_1px_2px_var(--ah-shadow-sm),0_14px_28px_-14px_var(--ah-shadow-md),0_34px_60px_-34px_var(--ah-shadow-lg)] dark:border-white/10 dark:bg-[#353735]">
                <div className="text-ink mb-[0.5rem] flex items-center gap-[5px] text-[0.68rem] font-semibold dark:text-white">
                  <span className="size-[5px] rounded-full bg-brand " />
                  Payment
                </div>

                <div className="mb-[5px] h-4 rounded-[5px] bg-input dark:bg-white/15" />

                <div className="mb-[6px] flex gap-[5px]">
                  <div className="h-4 flex-1 rounded-[5px] bg-input dark:bg-white/15" />
                  <div className="h-4 flex-1 rounded-[5px] bg-input dark:bg-white/15" />
                </div>

                <div className="rounded-[6px] bg-brand p-[0.4rem] text-center text-[0.68rem] font-semibold text-white  dark:text-[#3d2a00]">
                  Pay $90.00
                </div>
              </div>
            </div>

            {/* Payment successful receipt */}
            <div className="absolute left-[2%] top-[55%] w-[22%] min-w-[150px]">
              <div className="animate-float-receipt border-line w-full rounded-[14px] border bg-surface p-[0.8rem] text-center opacity-0 shadow-[0_1px_2px_var(--ah-shadow-sm),0_14px_28px_-14px_var(--ah-shadow-md),0_34px_60px_-34px_var(--ah-shadow-lg)] dark:border-white/10 dark:bg-[#353735]">
                <div className="mb-[0.5rem] flex justify-center gap-1">
                  <span className="h-[3px] w-[14px] rounded-[2px] bg-brand " />
                  <span className="h-[3px] w-[14px] rounded-[2px] bg-brand " />
                  <span className="h-[3px] w-[14px] rounded-[2px] bg-description dark:bg-white/15" />
                </div>

                <div className="animate-ring mx-auto mb-[0.4rem] flex size-[26px] items-center justify-center rounded-full bg-brand text-[0.8rem] text-white  dark:text-[#3d2a00]">
                  ✓
                </div>

                <div className="text-ink mb-[0.25rem] text-[0.78rem] font-bold dark:text-white">
                  Payment successful
                </div>

                <div className="mb-[0.55rem] text-[0.66rem] leading-[1.35] text-[var(--ah-muted)] dark:text-white/70">
                  Your order has been placed. Track your order here.
                </div>

                <div className="rounded-[6px] bg-brand p-[0.4rem] text-[0.68rem] font-semibold text-white dark:text-[#3d2a00]">
                  Back to chat
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
