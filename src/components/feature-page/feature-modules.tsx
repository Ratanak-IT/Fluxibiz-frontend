"use client";

import { useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { FEATURE_MODULES } from "./feature-data";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

export function FeatureModules() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerY, { stiffness: 100, damping: 22 });
  const rotateY = useSpring(pointerX, { stiffness: 100, damping: 22 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const timelineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const nextIndex = Math.min(
      FEATURE_MODULES.length - 1,
      Math.floor(progress * FEATURE_MODULES.length),
    );

    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
  });

  const activeModule = FEATURE_MODULES[activeIndex];
  const Icon = activeModule.icon;
  const imageFirst = activeIndex % 2 === 1;
  const isPhone = activeModule.index === "06";

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    pointerX.set(x * 5);
    pointerY.set(y * -4);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <section
      ref={sectionRef}
      aria-label="FluxiBiz platform modules"
      style={{ height: `${FEATURE_MODULES.length * 112}svh` }}
      className="relative bg-[#f5f5f5]"
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-80"
          animate={
            reduceMotion
              ? undefined
              : {
                  backgroundPosition: ["0% 20%", "100% 80%", "0% 20%"],
                }
          }
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 32%, rgba(0,147,42,0.14), transparent 30%), radial-gradient(circle at 82% 68%, rgba(254,185,13,0.12), transparent 28%)",
            backgroundSize: "140% 140%",
          }}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#f5f5f5] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f5f5f5] to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[72px_1fr] lg:gap-10">
            <div className="relative hidden h-[64vh] lg:block">
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-primary/15" />
              <motion.div
                style={{ height: timelineHeight }}
                className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-primary via-[#4ade80] to-secondary shadow-[0_0_18px_rgba(0,147,42,0.65)]"
              />

              {FEATURE_MODULES.map((module, index) => {
                const active = index === activeIndex;
                return (
                  <div
                    key={module.index}
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{ top: `${(index / (FEATURE_MODULES.length - 1)) * 100}%` }}
                  >
                    <motion.span
                      animate={{
                        scale: active ? 1.35 : 1,
                        backgroundColor: active ? "#00932A" : "#ffffff",
                        borderColor: active ? "#00932A" : "rgba(0,147,42,0.25)",
                      }}
                      transition={{ duration: 0.35, ease }}
                      className="grid size-7 -translate-y-1/2 place-items-center rounded-full border text-[9px] font-bold text-primary shadow-[0_0_0_5px_#f5f5f5]"
                    >
                      <span className={active ? "text-white" : ""}>{module.index}</span>
                    </motion.span>
                  </div>
                );
              })}
            </div>

            <div
              onPointerMove={handlePointerMove}
              onPointerLeave={resetPointer}
              className="relative min-h-[680px] lg:min-h-[620px]"
            >
              <AnimatePresence mode="wait">
                <motion.article
                  key={activeModule.index}
                  initial={reduceMotion ? false : { opacity: 0, y: 72 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -54 }}
                  transition={{ duration: reduceMotion ? 0 : 0.72, ease }}
                  className="absolute inset-0 grid items-center gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16"
                >
                  <motion.div
                    className={cn("relative z-10", imageFirst && "lg:order-2")}
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: { staggerChildren: reduceMotion ? 0 : 0.09, delayChildren: 0.12 },
                      },
                    }}
                  >
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 18 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
                      }}
                      className="flex items-center gap-3"
                    >
                      <span className="grid size-11 place-items-center rounded-xl bg-primary text-white shadow-[0_12px_30px_-12px_rgba(0,147,42,0.8)]">
                        <Icon className="size-5" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                        {activeModule.index} · Module
                      </span>
                    </motion.div>

                    <motion.h3
                      variants={{
                        hidden: { opacity: 0, y: 22 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease } },
                      }}
                      className="mt-7 text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] text-text sm:text-5xl"
                    >
                      {activeModule.title}
                    </motion.h3>

                    <motion.p
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
                      }}
                      className="mt-5 max-w-xl text-base leading-7 text-muted-foreground"
                    >
                      One connected workspace built to make {activeModule.title.toLowerCase()} clear,
                      fast, and effortless for your team.
                    </motion.p>

                    <motion.ul
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: reduceMotion ? 0 : 0.07,
                            delayChildren: reduceMotion ? 0 : 0.28,
                          },
                        },
                      }}
                      className="mt-7 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:gap-x-7 sm:gap-y-3"
                    >
                      {activeModule.features.map((feature) => (
                        <motion.li
                          key={feature}
                          variants={{
                            hidden: { opacity: 0, y: 14 },
                            visible: {
                              opacity: 1,
                              y: 0,
                              transition: { duration: 0.42, ease },
                            },
                          }}
                          className="flex items-center gap-3 text-sm font-medium text-[#344239]"
                        >
                          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10">
                            <Check className="size-3.5 text-primary" />
                          </span>
                          {feature}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>

                  <motion.div
                    className={cn(
                      "relative mx-auto w-full [perspective:1400px]",
                      imageFirst && "lg:order-1",
                      isPhone ? "max-w-[390px]" : activeIndex % 3 === 0 ? "max-w-[720px]" : "max-w-[640px]",
                    )}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 48 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.08, ease }}
                  >
                    <motion.div
                      style={
                        reduceMotion
                          ? undefined
                          : {
                              rotateX,
                              rotateY,
                              transformStyle: "preserve-3d",
                            }
                      }
                      className="relative"
                    >
                      <div
                        className={cn(
                          "relative",
                          isPhone ? "h-[260px] sm:h-[380px] lg:h-[500px]" : "aspect-[1.48/1]",
                        )}
                        style={{ transform: "translateZ(34px)" }}
                      >
                        <Image
                          src={activeModule.image}
                          alt={activeModule.alt}
                          fill
                          priority={activeIndex === 0}
                          sizes="(max-width: 1024px) 90vw, 58vw"
                          className={cn(
                            isPhone ? "object-contain" : "object-contain object-center",
                            activeModule.imageClassName,
                          )}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.article>
              </AnimatePresence>

              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 lg:hidden">
                {FEATURE_MODULES.map((module, index) => (
                  <motion.span
                    key={module.index}
                    animate={{ width: index === activeIndex ? 28 : 6, opacity: index === activeIndex ? 1 : 0.3 }}
                    className="h-1.5 rounded-full bg-primary"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
