'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { Chart } from './Chart';

export interface AboutHeroSectionProps {
  eyebrow?: string;
  headlineHighlight?: string;
  headlineSuffix?: string;
  description?: string;
  primaryCta?: string;
  secondaryCta?: string;
  tags?: string[];
  className?: string;
}

const BAR_HEIGHTS = [32, 55, 40, 70, 48, 62, 36, 58, 44, 66, 38];

function useCountUp(target: number, duration = 1500, decimals = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value.toFixed(decimals);
}

export default function HeroSection({
  eyebrow = 'About FluxiBiz',
  headlineHighlight = 'One Platform',
  headlineSuffix = 'To Run Your Whole Business',
  description = 'Founded in Phnom Penh in 2026 by a group of IT enthusiasts, FluxiBiz brings everything a business needs to sell, manage and grow into one simple place.',
  primaryCta = 'Start for free',
  secondaryCta = 'Contact us',
  tags = ['No card required', 'Cancel anytime', 'Built in Cambodia'],
  className = '',
}: AboutHeroSectionProps) {
  const revenue = useCountUp(12480, 1600);
  const salesPct = useCountUp(24, 1400);
  const loved = useCountUp(6000, 1800);

  const connectorPath = 'M100 180 C 160 220, 200 240, 250 245';

  return (
    <section
      className={`ah-scope font-googlesans text-ink relative mx-auto flex w-full max-w-[1900px] flex-wrap items-center gap-10 overflow-hidden px-[5.5%] py-20 antialiased bg-[radial-gradient(1200px_500px_at_80%_-10%,var(--ah-brand-soft),transparent_60%),var(--background)] ${className}`}
    >
      {/* -------- left copy -------- */}
      <div className="relative z-[2] max-w-[640px] flex-[1_1_380px]">
        {eyebrow && (
          <div className="text-brand animate-fade-up mb-[0.9rem] text-[0.78rem] font-bold uppercase tracking-[0.08em] opacity-0">
            {eyebrow}
          </div>
        )}

        <h1 className="animate-fade-up-1 m-0 mb-[1.1rem] flex translate-y-4 flex-col text-[clamp(2.6rem,6vw,4.4rem)] font-extrabold leading-[1.08] tracking-[-0.02em] opacity-0">
          <span className="animate-sheen bg-clip-text text-transparent bg-[length:220%_100%] bg-[linear-gradient(100deg,var(--ah-brand-strong)_0%,var(--ah-brand)_38%,var(--ah-brand-light)_62%,var(--ah-brand)_100%)]">
            {headlineHighlight}
          </span>
          <span className="text-ink">{headlineSuffix}</span>
        </h1>

        <p className="text-[var(--ah-muted)] animate-fade-up-2 m-0 mb-[1.9rem] max-w-[42ch] translate-y-[14px] text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.6] opacity-0">
          {description}
        </p>

        <div className="animate-fade-up-3 mb-[1.7rem] flex translate-y-[14px] flex-wrap gap-3 opacity-0">
          <button
            type="button"
            className="ease-hero relative inline-flex cursor-pointer items-center gap-[0.55rem] overflow-hidden rounded-full bg-brand px-6 py-[0.85rem] text-[0.95rem] font-semibold text-white shadow-[0_10px_24px_-8px_var(--ah-glow)] transition-[transform,box-shadow,background] duration-300 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-[0_16px_32px_-10px_var(--ah-glow)] after:absolute after:inset-0 after:-translate-x-[130%] after:bg-[linear-gradient(100deg,transparent_20%,rgba(255,255,255,0.35)_50%,transparent_80%)] after:transition-transform after:duration-700 after:ease-hero after:content-[''] hover:after:translate-x-[130%]"
          >
            <span className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white/20">
              <ArrowRightIcon size={16} strokeWidth={2.5} />
            </span>
            {primaryCta}
          </button>
          <button
            type="button"
            className="ease-hero text-ink border-line inline-flex cursor-pointer items-center gap-[0.55rem] rounded-full border bg-surface px-6 py-[0.85rem] text-[0.95rem] font-semibold transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-10px_var(--ah-shadow-md)]"
          >
            {secondaryCta}
          </button>
        </div>

        <div className="text-faint animate-fade-up-4 flex flex-wrap items-center gap-[0.55rem] text-[0.82rem] opacity-0">
          {tags.filter(Boolean).map((t, i) => (
            <React.Fragment key={t}>
              {i > 0 && <span className="bg-input h-1 w-1 rounded-full" />}
              <span>{t}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* -------- right scene -------- */}
      <div className="relative z-[1] min-h-[650px] flex-[1_1_460px] max-md:hidden">
        {/* ambient aurora */}
        <div className="pointer-events-none absolute inset-[-12%] z-0 blur-[46px]" aria-hidden>
          <span className="animate-blob-1 absolute left-[10%] top-[6%] h-[500px] w-[500px] rounded-full opacity-50 bg-[radial-gradient(circle,color-mix(in_srgb,var(--ah-brand)_45%,transparent),transparent_70%)]" />
          <span className="animate-blob-2 absolute right-[4%] top-[26%] h-[240px] w-[240px] rounded-full opacity-50 bg-[radial-gradient(circle,color-mix(in_srgb,var(--ah-brand-secondary)_35%,transparent),transparent_70%)]" />
          <span className="animate-blob-3 absolute bottom-[2%] left-[34%] h-[220px] w-[220px] rounded-full opacity-50 bg-[radial-gradient(circle,color-mix(in_srgb,var(--ah-brand)_30%,transparent),transparent_70%)]" />
        </div>

        <div className="absolute inset-0 z-[1]">
          <svg
            className="absolute inset-0 h-[80%] w-[70%]"
            viewBox="5 0 600 470"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d={connectorPath}
              className="stroke-brand animate-dash-flow"
              fill="none"
              strokeWidth="2"
              strokeDasharray="6 7"
            />
            <circle r="4.5" className="fill-brand [filter:drop-shadow(0_0_6px_var(--ah-glow))]">
              <animateMotion dur="2.6s" repeatCount="indefinite" path={connectorPath} />
            </circle>
          </svg>

          {/* pulsing badge */}
          <div className="animate-pulse-badge absolute left-[24%] top-[39%] z-[3] flex h-[30px] w-[30px] items-center justify-center rounded-full bg-brand text-[0.85rem] text-white shadow-[0_8px_18px_-6px_var(--ah-glow)]">
            ★
          </div>
          <Chart/>


          {/* dashboard chart card */}
          <div className="absolute left-[20%] top-[90%] w-[20%] min-w-[160px]">
            <div className="animate-float-dashboard border-line w-full rounded-[14px] border bg-surface p-[0.7rem] opacity-0 shadow-[0_1px_2px_var(--ah-shadow-sm),0_14px_28px_-14px_var(--ah-shadow-md),0_34px_60px_-34px_var(--ah-shadow-lg)]">
              <div className="text-ink mb-[0.45rem] text-[0.82rem] font-extrabold tracking-[-0.01em]">
                ${Number(revenue).toLocaleString('en-US')}
              </div>
              <div className="mb-[0.5rem] flex flex-col gap-1">
                <div className="bg-description h-[5px] w-[70%] rounded-[3px]" />
                <div className="bg-description h-[5px] rounded-[3px]" />
              </div>
              <div className="flex h-[34px] items-end gap-1">
                {[14, 26, 18, 32, 22].map((h, i) => (
                  <span key={i} style={{ height: `${h}px` }} className="flex-1 rounded-[2px] bg-brand opacity-85" />
                ))}
              </div>
            </div>
          </div>

          {/* today's overview: breathing equalizer */}
          <div className="absolute left-[29%] top-[15%] w-[50%] min-w-[300px]">
            <div className="animate-float-overview border-line min-h-[200px] w-full rounded-[14px] border bg-surface-dark dark:bg-neutral-800 px-[1.1rem] pb-[0.9rem] pt-4 text-white/70 opacity-0 shadow-[0_1px_2px_var(--ah-shadow-md),0_18px_34px_-16px_var(--ah-shadow-md),0_40px_70px_-40px_var(--ah-glow)]">
              <div className="mb-[0.7rem] text-[0.85rem] font-semibold">Today&apos;s overview</div>
              <div className="mb-[0.7rem] flex h-[200px] items-end gap-[2px]">
                {BAR_HEIGHTS.map((h, i) => (
                  <span
                    key={i}
                    className={`animate-eq flex-1 origin-bottom rounded-[2px] ${
                      i % 3 === 0 ? 'bg-brand' : 'bg-white/90'
                    }`}
                    style={
                      {
                        ['--h']: `${h}%`,
                        ['--dur']: `${2.2 + (i % 4) * 0.35}s`,
                        height: `calc(${h}% * 0.5)`,
                        animationDelay: `${i * 0.09}s`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
              <div className="flex justify-between text-[0.72rem] text-white/55">
                <span>◷ Live now</span>
                <span className="text-brand-light font-semibold">Sales +{salesPct}%</span>
              </div>
            </div>
          </div>

          {/* rating badge */}
          <div className="absolute right-0 top-[4%] w-[26%] min-w-[220px]">
            <div className="animate-float-rating border-line flex w-full flex-col gap-[0.3rem] rounded-[14px] border bg-surface px-4 py-[0.7rem] opacity-0 shadow-[0_1px_2px_var(--ah-shadow-sm),0_14px_28px_-14px_var(--ah-shadow-md),0_34px_60px_-34px_var(--ah-shadow-lg)]">
              <span className="text-brand-secondary text-[0.85rem] tracking-[1px]">★★★★★</span>
              <div className="text-faint flex flex-col text-[0.72rem]">
                <strong className="text-ink text-[0.88rem]">5.0 / 5.0</strong>
                <span>Loved by {Number(loved).toLocaleString('en-US')}+ businesses</span>
              </div>
            </div>
          </div>

          {/* payment form card */}
          <div className="absolute right-[1%] top-[57%] w-[30%] min-w-[100px]">
            <div className="animate-float-payment border-line w-full rounded-[14px] border bg-surface p-[0.65rem] opacity-0 shadow-[0_1px_2px_var(--ah-shadow-sm),0_14px_28px_-14px_var(--ah-shadow-md),0_34px_60px_-34px_var(--ah-shadow-lg)]">
              <div className="text-ink mb-[0.5rem] flex items-center gap-[5px] text-[0.68rem] font-semibold">
                <span className="h-[5px] w-[5px] rounded-full bg-brand" /> Payment
              </div>
              <div className="bg-input mb-[5px] h-4 rounded-[5px]" />
              <div className="mb-[6px] flex gap-[5px]">
                <div className="bg-input h-4 flex-1 rounded-[5px]" />
                <div className="bg-input h-4 flex-1 rounded-[5px]" />
              </div>
              <div className="rounded-[6px] bg-brand p-[0.4rem] text-center text-[0.68rem] font-semibold text-white">
                Pay $90.00
              </div>
            </div>
          </div>

          {/* order notification card */}
          <div className="absolute left-[29%] top-[70%] w-[30%] min-w-[220px]">
            <div className="animate-float-order border-line w-full rounded-[14px] border bg-surface px-[1.05rem] py-[0.9rem] opacity-0 shadow-[0_1px_2px_var(--ah-shadow-sm),0_14px_28px_-14px_var(--ah-shadow-md),0_34px_60px_-34px_var(--ah-shadow-lg)]">
              <div className="mb-[0.4rem] flex items-center gap-2">
                <span className="rounded-full bg-text px-[0.55rem] py-[0.2rem] text-[0.66rem] font-semibold text-gray-100 dark:text-gray-900">
                  Order #1048
                </span>
                <span className="text-faint text-[0.7rem]">2m ago</span>
              </div>
              <div className="text-ink mb-[0.2rem] text-[0.85rem] font-bold">New order paid.</div>
              <div className="text-[var(--ah-muted)] text-[0.75rem] leading-[1.4]">
                Your inventory and dashboard updated automatically.
              </div>
            </div>
          </div>

          {/* payment successful receipt */}
          <div className="absolute left-[2%] top-[55%] w-[22%] min-w-[150px]">
            <div className="animate-float-receipt border-line w-full rounded-[14px] border bg-surface p-[0.8rem] text-center opacity-0 shadow-[0_1px_2px_var(--ah-shadow-sm),0_14px_28px_-14px_var(--ah-shadow-md),0_34px_60px_-34px_var(--ah-shadow-lg)]">
              <div className="mb-[0.5rem] flex justify-center gap-1">
                <span className="h-[3px] w-[14px] rounded-[2px] bg-brand" />
                <span className="h-[3px] w-[14px] rounded-[2px] bg-brand" />
                <span className="bg-description h-[3px] w-[14px] rounded-[2px]" />
              </div>
              <div className="animate-ring mx-auto mb-[0.4rem] flex h-[26px] w-[26px] items-center justify-center rounded-full bg-brand text-[0.8rem] text-white">
                ✓
              </div>
              <div className="text-ink mb-[0.25rem] text-[0.78rem] font-bold">Payment successful</div>
              <div className="text-[var(--ah-muted)] mb-[0.55rem] text-[0.66rem] leading-[1.35]">
                Your order has been placed. Track your order here.
              </div>
              <div className="rounded-[6px] bg-brand p-[0.4rem] text-[0.68rem] font-semibold text-white">
                Back to chat
              </div>
            </div>
          </div>

          {/* sale banner (your asset) */}
          <div className="absolute right-[1%] top-[76%] w-[40%] min-w-[210px]">
            <Image
              src="/about/image.png"
              width={500}
              height={500}
              alt="Mega sale"
              className="animate-sale block h-auto w-full rounded-[14px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
