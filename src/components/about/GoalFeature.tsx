'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { FeatureMark, MarkId } from './MarkForGoalFeature';

/* -------------------------------------------------------------------------- */
/*  data                                                                       */
/* -------------------------------------------------------------------------- */

type Feature = { n: string; title: string; desc: string; mark: MarkId };

const FEATURES: Feature[] = [
  { n: '', mark: 'simple',    title: 'Simple by default',     desc: 'Powerful, yet easy from day one.' },
  { n: '', mark: 'local',     title: 'Made for Cambodia',     desc: 'Built for how business works here.' },
  { n: '', mark: 'connected', title: 'One connected system',  desc: 'Everything in one place, in sync.' },
  { n: '', mark: 'fair',      title: 'Fair and affordable',   desc: 'Serious tools without the big price.' },
  { n: '', mark: 'better',    title: 'Better every week',     desc: 'Always improving, shaped by users.' },
  { n: '', mark: 'longrun',   title: 'Here for the long run', desc: 'A local team, in it for the long haul.' },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* -------------------------------------------------------------------------- */
/*  helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** True when the device has no real hover (touch). Drives the active row from scroll instead. */
function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: none)');
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return coarse;
}

type SplitWord = { chars: { ch: string; i: number }[] };

/** Splits text into words → characters, keeping one running index for stagger. */
function useSplit(text: string): SplitWord[] {
  return useMemo(() => {
    let k = 0;
    return text.split(' ').map((word) => ({
      chars: word.split('').map((ch) => ({ ch, i: k++ })),
    }));
  }, [text]);
}

/**
 * Two stacked character layers inside a clip.
 * Layer A rises in on scroll, then slides out when the row goes active;
 * layer B (brand colour) takes its place from below. Pure CSS transforms —
 * no motion component per character, so 6 rows stay cheap on low-end phones.
 *
 * Each character translates by a percentage of ITS OWN height, which only lines
 * up while the text sits on a single line. As soon as the title wraps — narrow
 * screens, long titles — line two would slide into line one's slot and you'd see
 * both copies at once. So the component measures itself and falls back to a
 * plain block fade whenever it wraps. No breakpoint to keep in sync.
 */
function CharSwap({
  text,
  revealed,
  active,
  reduced,
  step = 18,
  baseDelay = 0,
  duration = 560,
  className = '',
  swapClassName = 'text-brand',
}: {
  text: string;
  revealed: boolean;
  active: boolean;
  reduced: boolean;
  step?: number;
  baseDelay?: number;
  duration?: number;
  className?: string;
  swapClassName?: string;
}) {
  const words = useSplit(text);
  const layerRef = useRef<HTMLSpanElement>(null);
  const [wrapped, setWrapped] = useState(false);

  useEffect(() => {
    const el = layerRef.current;
    if (!el) return;
    const measure = () => {
      const word = el.querySelector<HTMLElement>('[data-word]');
      if (!word || !word.offsetHeight) return;
      // more than ~1.5 line boxes tall => the text has wrapped
      setWrapped(el.offsetHeight > word.offsetHeight * 1.5);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  /** single-line char choreography, or the safe fallback */
  const plain = reduced || wrapped;

  const layerA = plain
    ? 'none'
    : !revealed
      ? 'translateY(110%)'
      : active
        ? 'translateY(-105%)'
        : 'translateY(0)';
  const layerB = !plain && revealed && active ? 'translateY(0)' : 'translateY(105%)';

  const renderLayer = (transform: string) =>
    words.map((word, wi) => (
      <span key={wi} data-word className="inline-block whitespace-nowrap">
        {word.chars.map(({ ch, i }) => (
          <span
            key={i}
            className="inline-block ease-hero"
            style={{
              transform,
              willChange: plain ? undefined : 'transform',
              transitionProperty: 'transform',
              transitionDuration: `${duration}ms`,
              transitionDelay: `${baseDelay + i * step}ms`,
            }}
          >
            {ch}
          </span>
        ))}
        {wi < words.length - 1 && <span className="inline-block w-[0.3em]" />}
      </span>
    ));

  return (
    <span
      className={`relative block overflow-hidden pb-[0.14em] transition-[opacity,transform,color] duration-700 ease-hero motion-reduce:transition-none ${className} ${
        plain && active ? swapClassName : ''
      }`}
      style={
        plain
          ? {
              opacity: revealed ? 1 : 0,
              transform: revealed || reduced ? 'translateY(0)' : 'translateY(14px)',
              transitionDelay: `${baseDelay}ms`,
            }
          : undefined
      }
    >
      <span ref={layerRef} className="block">
        {renderLayer(layerA)}
      </span>
      {!plain && (
        <span aria-hidden className={`absolute inset-0 block ${swapClassName}`}>
          {renderLayer(layerB)}
        </span>
      )}
    </span>
  );
}

/** Word-by-word mask reveal for the heading. Inherits hidden/show from its motion parent. */
function MaskedWords({
  text,
  delay = 0,
  reduced,
  className = '',
}: {
  text: string;
  delay?: number;
  reduced: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {text.split(' ').map((word, i) => (
        <span key={`${word}-${i}`} className="inline-flex overflow-hidden pb-[0.09em] pr-[0.26em]">
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: reduced ? 0 : '112%', opacity: reduced ? 0 : 1 },
              show: {
                y: '0%',
                opacity: 1,
                transition: { duration: 0.85, ease: EASE, delay: delay + i * 0.055 },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}



/* -------------------------------------------------------------------------- */
/*  row                                                                        */
/* -------------------------------------------------------------------------- */

function FeatureRow({
  feature,
  index,
  isActive,
  reduced,
  onHover,
  onCentered,
}: {
  feature: Feature;
  index: number;
  isActive: boolean;
  reduced: boolean;
  onHover: (i: number | null) => void;
  onCentered: (i: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const revealed = useInView(ref, { once: true, amount: 0.4 });
  const centered = useInView(ref, { margin: '-48% 0px -48% 0px' });

  useEffect(() => {
    if (centered) onCentered(index);
  }, [centered, index, onCentered]);

  const rowDelay = index * 55;

  return (
    <li
      ref={ref}
      onPointerEnter={() => onHover(index)}
      onPointerLeave={() => onHover(null)}
      className="group relative isolate"
    >
      {/* gliding highlight — one element shared across every row */}
      {isActive && (
        <motion.span
          layoutId="wc-active-row"
          className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--ah-brand)_11%,transparent)_0%,transparent_78%)] dark:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--ah-brand)_20%,transparent)_0%,transparent_78%)]"
          transition={
            reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 42, mass: 0.8 }
          }
        >
          <span className="absolute inset-y-0 left-0 w-[3px] bg-brand" />
        </motion.span>
      )}


      <div className="relative z-10 grid grid-cols-[auto_auto_1fr_auto] items-center gap-[clamp(0.9rem,2.4vw,2.2rem)] px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(1.5rem,3.2vw,2.35rem)]">
        {/* index — digits roll over one at a time */}
        <span
          className="text-[0.82rem] font-semibold tabular-nums tracking-[0.16em] text-[color-mix(in_srgb,var(--ah-ink)_32%,var(--background))] dark:text-[color-mix(in_srgb,var(--ah-ink)_40%,var(--background))]"
        >
          <CharSwap
            text={feature.n}
            revealed={revealed}
            active={isActive}
            reduced={reduced}
            step={70}
            baseDelay={rowDelay}
            duration={480}
          />
        </span>

        {/* animated mark */}
        <span
          className={`grid aspect-square h-[clamp(2.4rem,4.2vw,3.15rem)] shrink-0 place-items-center rounded-[0.85rem] border transition-colors duration-500 ease-hero motion-reduce:transition-none ${
            isActive
              ? 'border-[color-mix(in_srgb,var(--ah-brand)_45%,transparent)] text-brand'
              : 'border-[color-mix(in_srgb,var(--ah-ink)_14%,transparent)] text-[color-mix(in_srgb,var(--ah-ink)_38%,var(--background))] dark:border-[color-mix(in_srgb,white_15%,transparent)] dark:text-[color-mix(in_srgb,var(--ah-ink)_48%,var(--background))]'
          }`}
        >
          <span className="h-[58%] w-[58%]">
            <FeatureMark
              id={feature.mark}
              revealed={revealed}
              active={isActive}
              reduced={reduced}
              delay={rowDelay + 120}
            />
          </span>
        </span>

        {/* title + copy */}
        <div
          className="flex flex-wrap items-baseline justify-between gap-[clamp(0.5rem,3vw,2.5rem)] transition-transform duration-[550ms] ease-hero motion-reduce:transition-none max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-[0.35rem]"
          style={{ transform: isActive && !reduced ? 'translateX(10px)' : 'translateX(0)' }}
        >
          <h3 className="m-0 text-[clamp(1.45rem,3.4vw,2.35rem)] font-extrabold leading-[1.12] tracking-[-0.025em] text-ink">
            <CharSwap
              text={feature.title}
              revealed={revealed}
              active={isActive}
              reduced={reduced}
              step={20}
              baseDelay={rowDelay}
            />
          </h3>

          {/* description wipes in, then brightens on active */}
          <p
            className={`m-0 min-w-[180px] flex-[1_1_auto] text-right text-[clamp(0.9rem,1.3vw,1.05rem)] font-medium transition-[clip-path,color,transform] duration-[800ms] ease-hero motion-reduce:transition-none max-[720px]:min-w-0 max-[720px]:text-left ${
              isActive
                ? 'text-ink'
                : 'text-[color-mix(in_srgb,var(--ah-ink)_46%,var(--background))] dark:text-[color-mix(in_srgb,var(--ah-ink)_62%,var(--background))]'
            }`}
            style={{
              clipPath: revealed || reduced ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)',
              opacity: revealed || reduced ? 1 : 0,
              transitionDelay: `${rowDelay + 180}ms`,
            }}
          >
            {feature.desc}
          </p>
        </div>

        {/* arrow */}
        <span
          aria-hidden
          className="h-[clamp(1rem,1.6vw,1.35rem)] w-[clamp(1rem,1.6vw,1.35rem)] shrink-0 text-brand transition-[opacity,transform] duration-500 ease-hero motion-reduce:transition-none max-[720px]:hidden"
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive || reduced ? 'translateX(0)' : 'translateX(-14px)',
          }}
        >
        </span>
      </div>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*  section                                                                    */
/* -------------------------------------------------------------------------- */

export default function GoalFeature() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const prefersReduced = useReducedMotion();
  const reduced = !!prefersReduced;
  const coarse = useCoarsePointer();

  const headerInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const [hovered, setHovered] = useState<number | null>(null);
  const [centered, setCentered] = useState(0);
  const activeIndex = hovered !== null ? hovered : coarse ? centered : null;

  const onCentered = useCallback((i: number) => setCentered(i), []);

  /* cursor-tracked glow ---------------------------------------------------- */
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const sx = useSpring(mx, { stiffness: 260, damping: 32, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 260, damping: 32, mass: 0.5 });
  const glow = useMotionTemplate`radial-gradient(260px circle at ${sx}px ${sy}px, color-mix(in srgb, var(--ah-brand) 16%, transparent), transparent 72%)`;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || coarse) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  /* scroll progress rail --------------------------------------------------- */
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 82%', 'end 55%'],
  });
  const railScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const railOpacity = useTransform(railScale, [0, 0.05], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="wc-scope relative overflow-hidden text-ink font-googlesans py-[clamp(4.5rem,9vw,8rem)] antialiased"
    >
      {/* ambient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55] [mask-image:radial-gradient(75%_60%_at_20%_20%,black,transparent)]"
        style={{
          backgroundImage:
            'linear-gradient(to right, color-mix(in srgb, var(--ah-ink) 7%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--ah-ink) 7%, transparent) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="mx-auto w-full max-w-[1900px] px-[5.5%]">
        {/* -------- heading -------- */}
        <motion.header
          initial="hidden"
          animate={headerInView ? 'show' : 'hidden'}
          className="mb-[clamp(2.5rem,5vw,4rem)]"
        >
          <div className="mb-5 flex items-center gap-3 overflow-hidden">
            <motion.span
              variants={{
                hidden: { scaleX: 0 },
                show: { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
              }}
              className="block h-px w-[clamp(1.5rem,4vw,3.5rem)] origin-left bg-brand"
            />
            <motion.span
              variants={{
                hidden: { opacity: 0, y: reduced ? 0 : 12 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.1 } },
              }}
              className="text-[0.74rem] font-bold uppercase tracking-[0.22em] text-brand"
            >
              Why FluxiBiz
            </motion.span>
          </div>

          <h2 className="m-0 max-w-[18ch] text-[clamp(2.1rem,5.4vw,3.9rem)] font-extrabold leading-[1.06] tracking-[-0.03em]">
            <MaskedWords text="The principles behind" reduced={reduced} delay={0.15} />
            <br />
            <span className="animate-sheen bg-clip-text bg-[length:220%_100%] text-transparent bg-[linear-gradient(100deg,var(--ah-brand-strong)_0%,var(--ah-brand)_40%,var(--ah-brand-light)_65%,var(--ah-brand)_100%)] motion-reduce:animate-none">
              <MaskedWords text="everything we build." reduced={reduced} delay={0.32} />
            </span>
          </h2>
        </motion.header>

        {/* -------- ledger -------- */}
        <div ref={listRef} className="relative" onPointerMove={handleMove}>
          {/* cursor glow */}
          {!reduced && !coarse && (
            <motion.div
              aria-hidden
              style={{ background: glow }}
              animate={{ opacity: hovered !== null ? 1 : 0 }}
              transition={{ duration: 0.35, ease: 'linear' }}
              className="pointer-events-none absolute inset-0"
            />
          )}

          {/* progress rail */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-[clamp(0.75rem,2vw,1.75rem)] top-0 hidden h-full w-px bg-[color-mix(in_srgb,var(--ah-ink)_10%,transparent)] md:block dark:bg-[color-mix(in_srgb,white_12%,transparent)]"
          >
            <motion.span
              style={{ scaleY: railScale, opacity: railOpacity }}
              className="absolute inset-0 block origin-top bg-brand"
            />
          </div>

          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            className="block h-px origin-left bg-[color-mix(in_srgb,var(--ah-ink)_13%,transparent)] dark:bg-[color-mix(in_srgb,white_13%,transparent)]"
          />

          <ul className="relative m-0 list-none p-0" onPointerLeave={() => setHovered(null)}>
            {FEATURES.map((f, i) => (
              <FeatureRow
                key={f.title}
                feature={f}
                index={i}
                isActive={activeIndex === i}
                reduced={reduced}
                onHover={setHovered}
                onCentered={onCentered}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}