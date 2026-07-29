"use client"
import React, { useEffect, useRef } from 'react';

interface ContentItem {
  title: string;
  body: string;
}

interface SlotStyle {
  top: string;
  width: string;
  opacity: number;
  scale: number;
  blur: number;
  bright: number;
  bg: string | null;
}

export interface OurVisionInfiniteLoopProps {
  items?: ContentItem[];
  eyebrowLine1?: string;
  eyebrowLine2?: string;
  headline?: [string, string];
  watermark?: string;
  stepDurationMs?: number;
  dwellMs?: number;
  className?: string;
}

const DEFAULT_ITEMS: ContentItem[] = [
  { title: 'Empower', body: 'Give every business the tools to succeed.' },
  { title: 'Simplify', body: 'Make business management effortless in one platform.' },
  { title: 'Connect', body: 'Unify POS, e-commerce, social commerce, and inventory.' },
  { title: 'Innovate', body: 'Drive smarter operations through automation and technology.' },
  { title: 'Grow Together', body: 'Help businesses scale with confidence.' },
];

// Slot visual definitions, index 0..6 (bg references --ov-primary/--ov-secondary set on the stage)
const SLOTS: SlotStyle[] = [
  { top: '10%', width: '40%', opacity: 0, scale: 0.9, blur: 8, bright: 1, bg: null },
  { top: '21%', width: '46%', opacity: 0.5, scale: 0.94, blur: 2.5, bright: 1, bg: 'color-mix(in srgb, var(--ov-primary) 46%, white 54%)' },
  { top: '33.6%', width: '55%', opacity: 0.72, scale: 0.97, blur: 1.2, bright: 1, bg: 'color-mix(in srgb, var(--ov-primary) 70%, #063d1c 30%)' },
  { top: '46.4%', width: '64%', opacity: 0.88, scale: 0.99, blur: 0.4, bright: 1.05, bg: 'var(--ov-primary)' },
  { top: '59.4%', width: '70%', opacity: 1, scale: 1.04, blur: 0, bright: 1.15, bg: 'linear-gradient(120deg, var(--ov-primary), color-mix(in srgb, var(--ov-secondary) 55%, var(--ov-primary) 45%))' },
  { top: '72.6%', width: '55%', opacity: 0.9, scale: 0.99, blur: 0.6, bright: 1.05, bg: 'color-mix(in srgb, var(--ov-primary) 88%, #052 12%)' },
  { top: '86%', width: '46%', opacity: 0, scale: 0.9, blur: 8, bright: 1, bg: 'color-mix(in srgb, var(--ov-secondary) 70%, #6b4f00 30%)' },
];

// utility strings for the imperatively-created blocks (kept static so Tailwind's JIT can see them)
const OV_BLOCK_CLASS =
  'absolute right-0 flex flex-col justify-center overflow-hidden rounded-l-xl border border-white/20 dark:border-white/10 ' +
  'backdrop-blur-[10px] backdrop-saturate-[1.25] ' +
  'transition-[top,width,opacity,transform,filter,box-shadow] duration-[var(--ov-step-duration)] ' +
  'ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none';

const OV_BLOCK_INNER = (title: string, body: string) => `
  <div class="pointer-events-none absolute inset-x-0 top-0 h-[45%] bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0))]"></div>
  <div class="relative z-[2] pl-[3.6%] pr-[4%]">
    <h3 class="mb-[0.3rem] text-[1.1rem] font-bold uppercase tracking-[0.01em] text-white max-[720px]:text-[0.85rem]">${title}</h3>
    <p class="m-0 max-w-[620px] text-[0.8rem] leading-[1.35] text-white/90 max-[720px]:text-[0.68rem]">${body}</p>
  </div>`;

export default function VisionSection({
  items = DEFAULT_ITEMS,
  eyebrowLine1 = 'Phnom Penh',
  eyebrowLine2 = 'Cambodia · 2026',
  headline = ['Our', 'Vision'],
  watermark = 'GRO',
  stepDurationMs = 1200,
  dwellMs = 2400,
  className = '',
}: OurVisionInfiniteLoopProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const contentFor = (position: number): ContentItem => {
      const i = ((position % items.length) + items.length) % items.length;
      return items[i];
    };

    const styleForSlot = (el: HTMLDivElement, slot: number) => {
      const s = SLOTS[Math.max(0, Math.min(6, slot))];
      el.style.top = s.top;
      el.style.width = s.width;
      el.style.opacity = String(s.opacity);
      el.style.transform = `scale(${s.scale})`;
      el.style.filter = `blur(${s.blur}px) brightness(${s.bright}) saturate(${slot === 4 ? 1.25 : 1})`;
      el.style.background = s.bg || 'transparent';
      el.style.zIndex = String(10 - Math.abs(slot - 4));
      el.style.height = '15%';
      el.style.boxShadow =
        slot === 4
          ? '0 20px 46px -10px rgba(0,147,42,0.45), 0 0 0 1px rgba(255,255,255,0.25) inset'
          : '0 10px 26px -12px rgba(3,7,18,0.18)';
    };

    let currentTick = 0;
    let nextId = 0;
    const els = new Map<number, { el: HTMLDivElement; position: number }>();
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const createBlockEl = (position: number) => {
      const id = nextId++;
      const el = document.createElement('div');
      el.className = OV_BLOCK_CLASS;
      const c = contentFor(position);
      el.innerHTML = OV_BLOCK_INNER(c.title, c.body);
      track.appendChild(el);
      els.set(id, { el, position });
      return id;
    };

    // init: 7 items at positions 0..6
    for (let p = 0; p < 7; p++) {
      const id = createBlockEl(p);
      styleForSlot(els.get(id)!.el, p);
    }

    const tick = () => {
      currentTick += 1;

      for (const [id, rec] of Array.from(els.entries())) {
        const slot = rec.position - currentTick;
        if (slot < 0) {
          styleForSlot(rec.el, 0);
          rec.el.style.opacity = '0';
          const t = setTimeout(() => {
            rec.el.remove();
            els.delete(id);
          }, 1600);
          timeouts.push(t);
        } else {
          styleForSlot(rec.el, slot);
        }
      }

      const hasSlot6 = Array.from(els.values()).some((r) => r.position - currentTick === 6);
      if (!hasSlot6) {
        const position = currentTick + 6;
        const id = createBlockEl(position);
        const el = els.get(id)!.el;
        el.style.transition = 'none';
        styleForSlot(el, 6);
        void el.offsetWidth; // force reflow
        el.style.transition = '';
      }
    };

    const interval = setInterval(tick, stepDurationMs + dwellMs);

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
      track.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, stepDurationMs, dwellMs]);

  return (
    <div
      style={{ ['--ov-step-duration']: `${stepDurationMs}ms` } as React.CSSProperties}
      className={`flex h-screen w-full items-center justify-center font-googlesans antialiased [--ov-primary:#00932A] [--ov-secondary:#FEB90D] dark:[--ov-primary:#22C55E] dark:[--ov-secondary:#FACC15] bg-[radial-gradient(circle_at_88%_20%,rgba(0,147,42,0.06),transparent_45%),repeating-linear-gradient(135deg,rgba(3,7,18,0.012)_0px,rgba(3,7,18,0.012)_1px,transparent_1px,transparent_3px),#F5F5F5] dark:bg-[radial-gradient(circle_at_88%_20%,rgba(0,147,42,0.10),transparent_45%),repeating-linear-gradient(135deg,rgba(255,255,255,0.02)_0px,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_3px),#0B0B0B] ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden">
        <div className="pointer-events-none absolute left-[-2%] top-[38%] z-0 animate-[ov-breathe_6s_ease-in-out_infinite] select-none text-[22vw] font-black leading-none tracking-[-0.04em] text-[#00932A] dark:text-gray-200 opacity-5 motion-reduce:animate-none">
          {watermark}
        </div>

        <div className="pointer-events-none absolute right-0 top-[61.8%] z-[1] h-[22%] w-[70%] animate-[ov-spot-breathe_4.2s_ease-in-out_infinite] blur-[18px] bg-[radial-gradient(ellipse_at_70%_50%,rgba(255,255,255,0.55),rgba(254,185,13,0.18)_45%,transparent_72%)] motion-reduce:animate-none" />

        <div className="absolute left-[5.5%] top-[8%] z-[5] animate-[ov-vibrate_0.18s_infinite_linear_alternate] text-[0.78rem] font-medium leading-[1.5] text-[#030712] dark:text-[#F8FAFC] motion-reduce:animate-none">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-[ms-pulse_2.4s_ease-in-out_infinite] rounded-full bg-[#00932A] dark:bg-[#22C55E] motion-reduce:animate-none" />
          {eyebrowLine1}
          <br />
          &nbsp;&nbsp;{eyebrowLine2}
        </div>

        <div className="absolute left-[5%] top-[15.5%] z-[5] text-[4.5vw] font-extrabold uppercase leading-[0.94] tracking-[-0.03em] text-[#00932A] dark:text-[#22C55E] max-[720px]:text-[8vw]">
          {headline[0]}
          <br />
          {headline[1]}
        </div>

        <div className="absolute inset-0 z-[3]" ref={trackRef} />
      </div>
    </div>
  );
}