"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";

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

const SLOTS: SlotStyle[] = [
  {
    top: "8%",
    width: "40%",
    opacity: 0,
    scale: 0.9,
    blur: 8,
    bright: 1,
    bg: null,
  },
  {
    top: "19%",
    width: "46%",
    opacity: 0.5,
    scale: 0.94,
    blur: 2.5,
    bright: 1,
    bg: "color-mix(in srgb, var(--ov-primary) 46%, white 54%)",
  },
  {
    top: "31.5%",
    width: "55%",
    opacity: 0.72,
    scale: 0.97,
    blur: 1.2,
    bright: 1,
    bg: "color-mix(in srgb, var(--ov-primary) 70%, #063d1c 30%)",
  },
  {
    top: "44.5%",
    width: "64%",
    opacity: 0.88,
    scale: 0.99,
    blur: 0.4,
    bright: 1.05,
    bg: "var(--ov-primary)",
  },
  {
    top: "58%",
    width: "70%",
    opacity: 1,
    scale: 1.04,
    blur: 0,
    bright: 1.15,
    bg: "linear-gradient(120deg, var(--ov-primary), color-mix(in srgb, var(--ov-secondary) 55%, var(--ov-primary) 45%))",
  },
  {
    top: "73%",
    width: "55%",
    opacity: 0.9,
    scale: 0.99,
    blur: 0.6,
    bright: 1.05,
    bg: "color-mix(in srgb, var(--ov-primary) 88%, #052 12%)",
  },
  {
    top: "88%",
    width: "46%",
    opacity: 0,
    scale: 0.9,
    blur: 8,
    bright: 1,
    bg: "color-mix(in srgb, var(--ov-secondary) 70%, #6b4f00 30%)",
  },
];

const OV_BLOCK_CLASS =
  "absolute right-0 flex flex-col justify-center overflow-hidden rounded-l-2xl border border-white/20 dark:border-white/10 " +
  "backdrop-blur-[10px] backdrop-saturate-[1.25] " +
  "transition-[top,width,height,opacity,transform,filter,box-shadow] duration-[var(--ov-step-duration)] " +
  "ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const OV_BLOCK_INNER = (title: string, body: string) => `
  <div
    class="pointer-events-none absolute inset-x-0 top-0 h-[45%]
    bg-[linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))]"
  ></div>

  <div class="relative z-[2] flex h-full flex-col justify-center px-[5%]">
    <h3
      class="mb-2 whitespace-normal text-[1rem] font-extrabold uppercase
      leading-[1.05] tracking-[-0.01em] text-white
      sm:text-[1.25rem] md:text-[1.4rem] lg:text-[1.6rem]"
    >
      ${escapeHtml(title)}
    </h3>

    <p
      class="m-0 max-w-[680px] whitespace-normal text-[0.78rem]
      font-medium leading-[1.45] text-white/95
      sm:text-[0.92rem] md:text-[1rem] lg:text-[1.12rem]"
    >
      ${escapeHtml(body)}
    </p>
  </div>
`;

export default function VisionSection({
  items,
  eyebrowLine1,
  eyebrowLine2,
  headline,
  watermark,
  stepDurationMs = 1200,
  dwellMs = 2400,
  className = "",
}: OurVisionInfiniteLoopProps) {
  const t = useTranslations("About.vision");
  const trackRef = useRef<HTMLDivElement>(null);

  const translatedItems = useMemo<ContentItem[]>(
    () => [
      {
        title: t("items.empower.title"),
        body: t("items.empower.description"),
      },
      {
        title: t("items.simplify.title"),
        body: t("items.simplify.description"),
      },
      {
        title: t("items.connect.title"),
        body: t("items.connect.description"),
      },
      {
        title: t("items.innovate.title"),
        body: t("items.innovate.description"),
      },
      {
        title: t("items.growTogether.title"),
        body: t("items.growTogether.description"),
      },
    ],
    [t],
  );

  const displayedItems = items ?? translatedItems;
  const displayedEyebrowLine1 = eyebrowLine1 ?? t("location");
  const displayedEyebrowLine2 = eyebrowLine2 ?? t("date");
  const displayedHeadline: [string, string] =
    headline ?? [t("headlineFirst"), t("headlineSecond")];
  const displayedWatermark = watermark ?? t("watermark");

  useEffect(() => {
    const track = trackRef.current;

    if (!track || displayedItems.length === 0) {
      return;
    }

    const contentFor = (position: number): ContentItem => {
      const index =
        ((position % displayedItems.length) + displayedItems.length) % displayedItems.length;

      return displayedItems[index];
    };

    const styleForSlot = (
      element: HTMLDivElement,
      slot: number,
    ) => {
      const safeSlot = Math.max(
        0,
        Math.min(SLOTS.length - 1, slot),
      );

      const style = SLOTS[safeSlot];

      element.style.top = style.top;
      element.style.width = style.width;
      element.style.opacity = String(style.opacity);
      element.style.transform = `scale(${style.scale})`;

      element.style.filter = `
        blur(${style.blur}px)
        brightness(${style.bright})
        saturate(${slot === 4 ? 1.25 : 1})
      `;

      element.style.background = style.bg ?? "transparent";
      element.style.zIndex = String(10 - Math.abs(slot - 4));

      // Main green box is taller so large text fits clearly.
      element.style.height = slot === 4 ? "18%" : "14%";

      element.style.boxShadow =
        slot === 4
          ? "0 20px 46px -10px rgba(0,147,42,0.45), 0 0 0 1px rgba(255,255,255,0.25) inset"
          : "0 10px 26px -12px rgba(3,7,18,0.18)";
    };

    let currentTick = 0;
    let nextId = 0;

    const elements = new Map<
      number,
      {
        element: HTMLDivElement;
        position: number;
      }
    >();

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const createBlockElement = (position: number) => {
      const id = nextId++;
      const element = document.createElement("div");
      const content = contentFor(position);

      element.className = OV_BLOCK_CLASS;
      element.innerHTML = OV_BLOCK_INNER(
        content.title,
        content.body,
      );

      track.appendChild(element);

      elements.set(id, {
        element,
        position,
      });

      return id;
    };

    for (
      let position = 0;
      position < SLOTS.length;
      position++
    ) {
      const id = createBlockElement(position);
      const record = elements.get(id);

      if (record) {
        styleForSlot(record.element, position);
      }
    }

    const tick = () => {
      currentTick += 1;

      for (const [id, record] of Array.from(
        elements.entries(),
      )) {
        const slot = record.position - currentTick;

        if (slot < 0) {
          styleForSlot(record.element, 0);
          record.element.style.opacity = "0";

          const timeout = setTimeout(() => {
            record.element.remove();
            elements.delete(id);
          }, stepDurationMs + 400);

          timeouts.push(timeout);
        } else {
          styleForSlot(record.element, slot);
        }
      }

      const hasLastSlot = Array.from(elements.values()).some(
        (record) =>
          record.position - currentTick === SLOTS.length - 1,
      );

      if (!hasLastSlot) {
        const position = currentTick + SLOTS.length - 1;
        const id = createBlockElement(position);
        const record = elements.get(id);

        if (record) {
          record.element.style.transition = "none";

          styleForSlot(record.element, SLOTS.length - 1);

          void record.element.offsetWidth;

          record.element.style.transition = "";
        }
      }
    };

    const interval = window.setInterval(
      tick,
      stepDurationMs + dwellMs,
    );

    return () => {
      window.clearInterval(interval);

      timeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });

      track.innerHTML = "";
    };
  }, [displayedItems, stepDurationMs, dwellMs]);

  return (
    <section
      style={
        {
          "--ov-step-duration": `${stepDurationMs}ms`,
        } as React.CSSProperties
      }
      className={`
        flex
        min-h-[720px]
        w-full
        items-center
        justify-center
        overflow-hidden
        bg-[radial-gradient(circle_at_88%_20%,rgba(0,147,42,0.06),transparent_45%),repeating-linear-gradient(135deg,rgba(3,7,18,0.012)_0px,rgba(3,7,18,0.012)_1px,transparent_1px,transparent_3px),#F5F5F5]
        font-googlesans
        antialiased
        [--ov-primary:#00932A]
        [--ov-secondary:#FEB90D]
        dark:bg-[radial-gradient(circle_at_88%_20%,rgba(0,147,42,0.10),transparent_45%),repeating-linear-gradient(135deg,rgba(255,255,255,0.02)_0px,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_3px),#0B0B0B]
        dark:[--ov-primary:#22C55E]
        dark:[--ov-secondary:#FACC15]
        md:h-screen
        ${className}
      `}
    >
      <div className="relative h-[720px] w-full overflow-hidden md:h-full">
        {/* Watermark */}
        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            left-[-2%]
            top-[38%]
            z-0
            select-none
            text-[27vw]
            font-black
            leading-none
            tracking-[-0.04em]
            text-[#00932A]
            opacity-5
            motion-reduce:animate-none
            dark:text-gray-200
            md:text-[22vw]
            md:animate-[ov-breathe_6s_ease-in-out_infinite]
          "
        >
          {displayedWatermark}
        </div>

        {/* Background glow */}
        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            right-0
            top-[61.8%]
            z-[1]
            h-[22%]
            w-[70%]
            animate-[ov-spot-breathe_4.2s_ease-in-out_infinite]
            bg-[radial-gradient(ellipse_at_70%_50%,rgba(255,255,255,0.55),rgba(254,185,13,0.18)_45%,transparent_72%)]
            blur-[18px]
            motion-reduce:animate-none
          "
        />

        {/* Location */}
        <div
          className="
            absolute
            left-[5.5%]
            top-[7%]
            z-[5]
            text-[0.68rem]
            font-medium
            leading-[1.5]
            text-[#030712]
            dark:text-[#F8FAFC]
            sm:text-[0.74rem]
            lg:text-[0.8rem]
          "
        >
          <span
            className="
              mr-1.5
              inline-block
              size-1.5
              animate-[ms-pulse_2.4s_ease-in-out_infinite]
              rounded-full
              bg-[#00932A]
              motion-reduce:animate-none
              dark:bg-[#22C55E]
            "
          />

          {displayedEyebrowLine1}

          <br />

          &nbsp;&nbsp;{displayedEyebrowLine2}
        </div>

        {/* Heading */}
        <div
          className="
            absolute
            left-[5%]
            top-[14%]
            z-[5]
            text-[10vw]
            font-extrabold
            uppercase
            leading-[0.94]
            tracking-[-0.03em]
            text-[#00932A]
            dark:text-[#22C55E]
            sm:text-[7vw]
            lg:text-[4.5vw]
          "
        >
          {displayedHeadline[0]}

          <br />

          {displayedHeadline[1]}
        </div>

        {/* Animated cards */}
        <div
          ref={trackRef}
          className="absolute inset-0 z-[3]"
        />
      </div>
    </section>
  );
}