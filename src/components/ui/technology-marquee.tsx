
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { MARQUEE } from "@/components/feature-page/modules";

/** Scroll speed in pixels per second. Lower is slower. */
const SPEED = 60;

export function TechnologyMarquee() {
  const reduceMotion = useReducedMotion();
  const groupRef = useRef<HTMLDivElement | null>(null);
  const [groupWidth, setGroupWidth] = useState(0);
  const [copies, setCopies] = useState(2);

  const measure = useCallback(() => {
    const el = groupRef.current;
    if (!el) return;

    const width = el.offsetWidth;
    if (!width) return;

    setGroupWidth(width);
    setCopies(Math.max(2, Math.ceil((window.innerWidth * 2) / width) + 1));
  }, []);

  useEffect(() => {
    measure();

    const el = groupRef.current;
    const observer = new ResizeObserver(measure);
    if (el) observer.observe(el);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const animating = !reduceMotion && groupWidth > 0;

  return (
    <section
      aria-label="Platform capabilities"
      className="overflow-hidden border-y  py-2 text-white [--logo-h:2rem] sm:[--logo-h:2.25rem]"
    >
      <motion.div
        className="flex w-max items-center will-change-transform"
        animate={animating ? { x: [0, -groupWidth] } : { x: 0 }}
        transition={
          animating
            ? {
                duration: groupWidth / SPEED,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }
            : undefined
        }
      >
        {Array.from({ length: copies }).map((_, index) => (
          <div
            key={index}
            ref={index === 0 ? groupRef : undefined}
            aria-hidden={index > 0}
            className="flex shrink-0 items-center"
          >
            {MARQUEE.map(({ name, src, scale }) => (
              <span
                key={name}
                className="flex shrink-0 items-center gap-5 pl-5 sm:gap-7 sm:pl-7"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={name}
                  title={name}
                  loading="eager"
                  decoding="sync"
                  onLoad={measure}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                    measure();
                  }}
                  style={{ height: `calc(var(--logo-h) * ${scale ?? 1})` }}
                  className="w-auto shrink-0"
                />
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
