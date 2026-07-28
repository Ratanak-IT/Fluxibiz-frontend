"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";

interface StickyStackCardProps {
  index: number;
  total: number;
  /** Smoothed scroll progress (0 → 1) shared across the whole stack */
  progress: MotionValue<number>;
  children: ReactNode;
}

/**
 * A single full-screen card that pins to the top of the viewport.
 * As the next card slides up over it, this one scales to 0.96 and fades to 0.9.
 * Only `transform` (scale) + `opacity` are animated — both GPU-composited.
 */
export function StickyStackCard({
  index,
  total,
  progress,
  children,
}: StickyStackCardProps) {
  const isLast = index === total - 1;

  // Each card "owns" a slice of the total scroll timeline.
  // Card i finishes pinning at i/(total-1); the next card covers it by (i+1)/(total-1).
  const step = total > 1 ? 1 / (total - 1) : 1;
  const start = index * step;
  const end = isLast ? start + 0.001 : Math.min((index + 1) * step, 1);

  const scale = useTransform(progress, [start, end], [1, isLast ? 1 : 0.96]);
  const opacity = useTransform(progress, [start, end], [1, isLast ? 1 : 0.9]);

  return (
    <div
      className="sticky top-[6svh] flex h-[88svh] items-center justify-center"
      style={{ zIndex: index + 1 }}
    >
      <motion.article
        style={{ scale, opacity, willChange: "transform" }}
        className="h-[78svh] min-h-[560px] max-h-[680px] w-full overflow-hidden rounded-[32px] bg-white shadow-[0_40px_90px_-25px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5 transition-shadow duration-500 hover:shadow-[0_50px_110px_-25px_rgba(15,23,42,0.45)]"
      >
        {children}
      </motion.article>
    </div>
  );
}
