"use client";

import type { ComponentType, PointerEvent } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  BarChart3,
  PackageCheck,
  ReceiptText,
  Sparkles,
  Store,
  type LucideProps,
} from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

interface FloatingCardProps {
  className: string;
  depth: number;
  icon: ComponentType<LucideProps>;
  label: string;
  value: string;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  delay: number;
}

function FloatingCard({
  className,
  depth,
  icon: Icon,
  label,
  value,
  pointerX,
  pointerY,
  delay,
}: FloatingCardProps) {
  const reduceMotion = useReducedMotion();

  const x = useTransform(pointerX, (latest) => latest * depth);
  const y = useTransform(pointerY, (latest) => latest * depth);

  return (
    <motion.div
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              scale: 0.82,
              y: 28,
            }
      }
      whileInView={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: reduceMotion ? 0 : 0.75,
        delay,
        ease,
      }}
      style={{ x, y }}
      className={cn(
        "pointer-events-none absolute hidden lg:block",
        className,
      )}
    >
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, -8, 0],
                rotate: [-0.6, 0.8, -0.6],
              }
        }
        transition={{
          duration: 6 + delay * 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn(
          "flex min-w-48 items-center gap-3 rounded-2xl border p-3.5 text-left",
          "border-primary/15 bg-white/80",
          "shadow-[0_24px_70px_-28px_rgba(0,55,16,0.28)]",
          "backdrop-blur-xl",
          "dark:border-white/15 dark:bg-background dark:text-white",
          "dark:shadow-[0_24px_70px_-28px_rgba(0,0,0,0.7)]",
        )}
      >
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl",
            "bg-white text-primary",
            "dark:bg-white/10 dark:text-primary",
          )}
        >
          <Icon className="size-5" />
        </span>

        <span>
          <span className="block text-[11px] text-muted-foreground ">
            {label}
          </span>

          <span className="mt-0.5 block text-sm font-bold text-text ">
            {value}
          </span>
        </span>
      </motion.div>
    </motion.div>
  );
}

export function FeatureCta() {
  const t = useTranslations("Feature.cta");
  const reduceMotion = useReducedMotion();

  const rawPointerX = useMotionValue(0);
  const rawPointerY = useMotionValue(0);

  const rawSpotlightX = useMotionValue(50);
  const rawSpotlightY = useMotionValue(46);

  const pointerX = useSpring(rawPointerX, {
    stiffness: 70,
    damping: 22,
  });

  const pointerY = useSpring(rawPointerY, {
    stiffness: 70,
    damping: 22,
  });

  const spotlightX = useSpring(rawSpotlightX, {
    stiffness: 55,
    damping: 24,
  });

  const spotlightY = useSpring(rawSpotlightY, {
    stiffness: 55,
    damping: 24,
  });

  const spotlight = useMotionTemplate`
    radial-gradient(
      circle at ${spotlightX}% ${spotlightY}%,
      rgba(74,222,128,0.25) 0%,
      rgba(0,147,42,0.12) 25%,
      transparent 58%
    )
  `;

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (reduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();

    const normalizedX =
      (event.clientX - bounds.left) / bounds.width;

    const normalizedY =
      (event.clientY - bounds.top) / bounds.height;

    rawPointerX.set((normalizedX - 0.5) * 2);
    rawPointerY.set((normalizedY - 0.5) * 2);

    rawSpotlightX.set(normalizedX * 100);
    rawSpotlightY.set(normalizedY * 100);
  }

  function resetPointer() {
    rawPointerX.set(0);
    rawPointerY.set(0);

    rawSpotlightX.set(50);
    rawSpotlightY.set(46);
  }

  return (
    <motion.section
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className={cn(
        "relative isolate overflow-hidden",
        "bg-background px-5 py-20 text-text",
        "md:px-8 md:py-28",
        "lg:min-h-[720px]",
        "dark:text-white",
      )}
    >
      <motion.div
        style={{ backgroundImage: spotlight }}
        className="absolute inset-0"
      />

      <motion.div
        aria-hidden
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [0.92, 1.08, 0.92],
                opacity: [0.35, 0.62, 0.35],
              }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn(
          "absolute left-1/2 top-1/2",
          "size-[34rem]",
          "-translate-x-1/2 -translate-y-1/2",
          "rounded-full bg-primary/20 blur-[110px]",
        )}
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-[0.05]",
          "[background-image:linear-gradient(rgba(0,147,42,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,147,42,.3)_1px,transparent_1px)]",
          "[background-size:72px_72px]",
        )}
      />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />

      <FloatingCard
        className="left-[5%] top-[17%]"
        depth={22}
        icon={BarChart3}
        label={t("todaySales")}
        value="$12,450 · +12.5%"
        pointerX={pointerX}
        pointerY={pointerY}
        delay={0.15}
      />

      <FloatingCard
        className="right-[4%] top-[20%]"
        depth={-18}
        icon={ReceiptText}
        label={t("orders")}
        value={t("ordersValue")}
        pointerX={pointerX}
        pointerY={pointerY}
        delay={0.25}
      />

      <FloatingCard
        className="bottom-[15%] left-[8%]"
        depth={-14}
        icon={PackageCheck}
        label={t("inventory")}
        value={t("inventoryValue")}
        pointerX={pointerX}
        pointerY={pointerY}
        delay={0.35}
      />

      <FloatingCard
        className="bottom-[12%] right-[7%]"
        depth={19}
        icon={Store}
        label={t("onlineStore")}
        value={t("onlineStoreValue")}
        pointerX={pointerX}
        pointerY={pointerY}
        delay={0.45}
      />

      <div
        className={cn(
          "relative z-10 mx-auto flex max-w-4xl flex-col",
          "items-center justify-center text-center",
          "lg:min-h-[560px]",
        )}
      >
        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 24,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.6,
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.75,
            ease,
          }}
          className={cn(
            "mx-auto inline-flex items-center gap-2 rounded-full",
            "border border-primary/20 bg-primary/8",
            "px-4 py-2",
            "text-xs font-semibold uppercase tracking-[0.16em]",
            "text-primary",
            "dark:border-primary/30 dark:bg-primary/10",
          )}
        >
          <Sparkles className="size-3.5" />
          {t("eyebrow")}
        </motion.div>

        <motion.h2
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 34,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.5,
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.85,
            delay: 0.1,
            ease,
          }}
          className={cn(
            "mx-auto mt-7 text-balance",
            "text-4xl font-extrabold leading-[0.98]",
            "tracking-[-0.055em]",
            "sm:text-6xl lg:text-7xl",
            "text-text ",
          )}
        >
          {t("headingLine1")}

          <motion.span
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 24,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: reduceMotion ? 0 : 0.75,
              delay: 0.28,
              ease,
            }}
            className="mx-auto block text-[#FEB90D]"
          >
            {t("headingLine2")}
          </motion.span>
        </motion.h2>

        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  scale: 0.88,
                  y: 18,
                }
          }
          whileInView={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: reduceMotion ? 0 : 0.65,
            delay: 0.5,
            ease,
          }}
          className={cn(
            "mx-auto mt-9 flex flex-col",
            "items-center justify-center gap-3",
            "sm:flex-row",
          )}
        >
          <Button
            render={<Link href="/register" />}
            nativeButton={false}
            className={cn(
              "h-13 rounded-full bg-primary px-7",
              "text-base font-bold text-white",
              "shadow-[0_16px_45px_-16px_rgba(0,147,42,0.5)]",
              "hover:scale-[1.03] hover:bg-primary",
            )}
          >
            {t("primaryCta")}
            <ArrowRight className="size-4" />
          </Button>

          <Button
            render={<a href="mailto:ipos.istad@gmail.com" />}
            nativeButton={false}
            variant="outline"
            className={cn(
              "h-13 rounded-full border-primary/25",
              "bg-white/70 px-7",
              "text-base font-semibold text-primary",
              "backdrop-blur-md",
              "hover:scale-[1.03]",
              "hover:bg-primary/5 hover:text-primary",
              "dark:border-white/15",
              "dark:bg-background",
              "dark:text-white",
              "dark:hover:bg-white/5",
              "dark:hover:text-primary",
            )}
          >
            {t("secondaryCta")}
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}