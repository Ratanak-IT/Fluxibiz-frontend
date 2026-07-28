'use client';

import React, { useEffect, useRef, useState } from 'react';

const FEATURES = [
  { n: '01', title: 'Simple by default',     desc: 'Powerful, yet easy from day one.' },
  { n: '02', title: 'Made for Cambodia',     desc: 'Built for how business works here.' },
  { n: '03', title: 'One connected system',  desc: 'Everything in one place, in sync.' },
  { n: '04', title: 'Fair and affordable',   desc: 'Serious tools without the big price.' },
  { n: '05', title: 'Better every week',     desc: 'Always improving, shaped by users.' },
  { n: '06', title: 'Here for the long run', desc: 'A local team, in it for the long haul.' },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);

  // initial state already accounts for reduced motion, so we never setState for it in the effect
  const [shown, setShown] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="wc-scope text-ink font-googlesans py-[clamp(4rem,8vw,7rem)] antialiased"
    >
      <div className="mx-auto w-full max-w-[1900px] px-[5.5%]">
        {/* -------- heading -------- */}
        <header className="mb-[clamp(2rem,5vw,3.5rem)]">
          <span
            className={`ease-hero mb-4 inline-block text-[0.78rem] font-bold uppercase tracking-[0.14em] text-brand transition-[opacity,transform] duration-[600ms] motion-reduce:transition-none ${
              shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            Why FluxiBiz
          </span>

          <h2
            className={`ease-hero m-0 text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[1.1] tracking-[-0.02em] transition-[opacity,transform] duration-700 [transition-delay:80ms] motion-reduce:transition-none ${
              shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            The principles behind
            <br />
            <span className="animate-sheen bg-clip-text text-transparent bg-[length:220%_100%] bg-[linear-gradient(100deg,var(--ah-brand-strong)_0%,var(--ah-brand)_40%,var(--ah-brand-light)_65%,var(--ah-brand)_100%)] motion-reduce:animate-none">
              Everything we build.
            </span>
          </h2>

          <span
            className={`ease-hero mt-[1.4rem] block h-1 rounded bg-brand-secondary transition-[width] delay-300 duration-[800ms] motion-reduce:transition-none ${
              shown ? 'w-[72px]' : 'w-0'
            }`}
          />
        </header>

        {/* -------- ledger rows -------- */}
        <ul className="m-0 list-none border-t border-[color-mix(in_srgb,var(--ah-ink)_12%,transparent)] p-0 dark:border-[color-mix(in_srgb,white_12%,transparent)]">
          {FEATURES.map((f, i) => (
            <li
              key={f.title}
              style={{ transitionDelay: `${120 + i * 85}ms` }}
              className={`group ease-hero relative grid cursor-pointer grid-cols-[auto_1fr] items-center gap-[clamp(1rem,3vw,2.5rem)] border-b border-[color-mix(in_srgb,var(--ah-ink)_12%,transparent)] px-[clamp(0.6rem,2vw,1.4rem)] py-[clamp(1.4rem,3vw,2.1rem)] transition-[opacity,transform] duration-[600ms] motion-reduce:transition-none dark:border-[color-mix(in_srgb,white_12%,transparent)]
              before:absolute before:inset-0 before:z-0 before:origin-left before:scale-x-0 before:bg-[color-mix(in_srgb,var(--ah-brand)_7%,transparent)] before:transition-transform before:duration-500 before:ease-hero before:content-[''] group-hover:before:scale-x-100 dark:before:bg-[color-mix(in_srgb,var(--ah-brand)_12%,transparent)]
              after:absolute after:bottom-0 after:left-0 after:top-0 after:z-[1] after:w-[3px] after:origin-center after:scale-y-0 after:bg-brand after:transition-transform after:duration-[450ms] after:ease-hero after:content-[''] group-hover:after:scale-y-100 ${
                shown ? 'translate-y-0 opacity-100' : 'translate-y-[22px] opacity-0'
              }`}
            >
              <span className="ease-hero relative z-[1] text-[0.9rem] font-semibold tabular-nums tracking-[0.02em] text-[color-mix(in_srgb,var(--ah-ink)_30%,var(--background))] transition-[color,transform] duration-[450ms] group-hover:-translate-y-0.5 group-hover:text-brand motion-reduce:transition-none dark:text-[color-mix(in_srgb,var(--ah-ink)_35%,var(--background))]">
                {f.n}
              </span>

              <div className="ease-hero relative z-[1] flex flex-wrap items-baseline justify-between gap-[clamp(0.75rem,3vw,2.5rem)] transition-transform duration-[450ms] group-hover:translate-x-2 motion-reduce:transition-none max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-[0.4rem] max-[720px]:group-hover:translate-x-1">
                <h3 className="m-0 text-[clamp(1.4rem,3.2vw,2.25rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink">
                  {f.title}
                </h3>
                <p className="ease-hero m-0 min-w-[180px] flex-[1_1_auto] text-right text-[clamp(0.9rem,1.3vw,1.05rem)] font-medium text-[color-mix(in_srgb,var(--ah-ink)_48%,var(--background))] transition-colors duration-[350ms] group-hover:text-ink motion-reduce:transition-none max-[720px]:min-w-0 max-[720px]:text-left dark:text-[color-mix(in_srgb,var(--ah-ink)_65%,var(--background))]">
                  {f.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}