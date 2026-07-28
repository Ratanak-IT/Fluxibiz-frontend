"use client";

import { motion, useReducedMotion } from "framer-motion";

import { MARQUEE } from "@/components/feature-page/modules";

export function TechnologyMarquee() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Platform capabilities"
      className="overflow-hidden border-y border-white/15 bg-brand py-5 text-white"
    >
      <motion.div
        className="flex w-max items-center"
        animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {[0, 1].map((group) => (
          <div
            key={group}
            className="flex shrink-0 items-center gap-5 px-5 text-sm font-semibold tracking-[0.08em] sm:gap-7 sm:px-7"
          >
            {MARQUEE.map((technology) => (
              <span key={technology} className="flex items-center gap-5 sm:gap-7">
                <span className="whitespace-nowrap">{technology}</span>
                <span aria-hidden className="text-secondary">
                  •
                </span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
