"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { MARQUEE } from "@/components/feature-page/modules";
import { Reveal } from "./reveal";

/** Scroll speed in pixels per second. Lower is slower. */
const SPEED = 60;

export function TechnologyMarquee() {
  const t = useTranslations("Feature.technology");
  const reduceMotion = useReducedMotion();
  const groupRef = useRef<HTMLDivElement | null>(null);

  const [groupWidth, setGroupWidth] = useState(0);
  const [copies, setCopies] = useState(2);

  const measure = useCallback(() => {
    const element = groupRef.current;

    if (!element) return;

    const width = element.offsetWidth;

    if (!width) return;

    setGroupWidth(width);

    setCopies(
      Math.max(
        2,
        Math.ceil((window.innerWidth * 2) / width) + 1,
      ),
    );
  }, []);

  useEffect(() => {
    measure();

    const element = groupRef.current;
    const observer = new ResizeObserver(measure);

    if (element) {
      observer.observe(element);
    }

    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const animating = !reduceMotion && groupWidth > 0;

  return (
    <section
      aria-labelledby="technology-title"
      className="overflow-hidden dark:bg-background"
    >
      {/* Text area */}
      <div
        className="
          flex
          min-h-[310px]
          items-center
          px-4
          pb-6
          pt-12

          sm:min-h-[360px]
          sm:px-5
          sm:pb-8
          sm:pt-16

          md:min-h-[420px]
          md:px-8
          md:pb-12
          md:pt-20
        "
      >
        <Reveal className="mx-auto w-full max-w-3xl text-center">
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-primary

              sm:text-xs
              sm:tracking-[0.2em]
            "
          >
            {t("eyebrow")}
          </p>

          <h2
            id="technology-title"
            className="
              mt-4
              text-[2.35rem]
              font-bold
              leading-[1.05]
              tracking-[-0.04em]
              text-text

              sm:mt-5
              sm:text-5xl

              md:text-6xl

              dark:text-white
            "
          >
            {t("headingLine1")}

            <span
              className="
                mt-2
                block
                text-primary

                sm:mt-3
              "
            >
              {t("headingLine2")}
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-[320px]
              text-sm
              leading-6
              text-muted-foreground

              sm:mt-5
              sm:max-w-2xl
              sm:text-base
              sm:leading-7

              md:text-lg

              dark:text-white/70
            "
          >
            {t("description")}
          </p>
        </Reveal>
      </div>

      {/* Technology icons */}
      <div
        className="
          border-y
          border-border
          py-3
          [--logo-h:1.65rem]

          sm:py-5
          sm:[--logo-h:2.25rem]

          md:py-6
          md:[--logo-h:3rem]
        "
      >
        <motion.div
          className="flex w-max items-center will-change-transform"
          animate={
            animating
              ? {
                  x: [0, -groupWidth],
                }
              : {
                  x: 0,
                }
          }
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
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-3
                    pl-3

                    sm:gap-5
                    sm:pl-5

                    md:gap-7
                    md:pl-7
                  "
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={name}
                    title={name}
                    loading="eager"
                    decoding="async"
                    onLoad={measure}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      measure();
                    }}
                    style={{
                      height: `calc(var(--logo-h) * ${scale ?? 1})`,
                    }}
                    className="w-auto shrink-0 object-contain"
                  />

                  <span
                    aria-hidden="true"
                    className="
                      text-sm
                      text-secondary
                      sm:text-base
                      md:text-lg
                    "
                  >
                    •
                  </span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}