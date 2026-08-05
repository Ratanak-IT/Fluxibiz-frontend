"use client";

import { Play } from "lucide-react";
import { useTranslations } from "next-intl";

const PRIMARY = "#006B26";
const ACCENT = "#FEB90D";
const INK = "#333333";
const WHITE = "#FFFFFF";

const SANS = "var(--font-body), ui-sans-serif, system-ui, sans-serif";

/* Ring geometry — centre (170,190), outer r130, inner r88, gap at the top right.
   Built as one filled path so the ends cut flat and the arrow joins cleanly. */
const RING =
  "M158.7 60.5 A130 130 0 1 0 292.2 145.5 L252.7 159.9 A88 88 0 1 1 162.3 102.3 Z";
const ARROW = "M157 43 L256 105 L164 121 Z";

export function HeroSection() {
  const t = useTranslations("Support.hero");

  return (
    <section className="overflow-hidden bg-background py-12 font-body lg:py-16">
      <div className="mx-auto grid w-full max-w-[1500px] items-center gap-12 px-8 sm:px-12 lg:grid-cols-[0.9fr_1.3fr] lg:gap-10 lg:px-20 xl:px-24 2xl:px-28">
        {/* ================= Left: text ================= */}
        <div className="relative pb-8 lg:pb-20">
          {/* Badge row */}
          <div
            className="hero-in flex items-center gap-3"
            style={{ animationDelay: "0.05s" }}
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary"
              
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M5 13a7 7 0 0 1 14 0"
                  stroke={WHITE}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="5" cy="15" r="2.2" fill={WHITE} />
                <circle cx="19" cy="15" r="2.2" fill={WHITE} />
              </svg>
            </span>
            <span className="rounded-full bg-[#F1F3F1] px-6 py-3 text-base font-medium text-[#333333] lg:text-lg">
              {t("badge")}
            </span>
          </div>

          {/* Headline */}
          <h1 className="mt-8 font-body text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]">
            <span
              className="hero-in block dark:text-gray-300"

            >
              {t("headlineFirst")}
            </span>
            <span
              className="hero-in relative mt-2 inline-block text-primary"
             
            >
              {t("headlineSecond")}
              <svg
                viewBox="0 0 300 26"
                fill="none"
                aria-hidden
                className="absolute -bottom-7 left-0 w-full"
              >
                <path
                  className="hero-draw"
                  pathLength={1}
                  d="M6 17 C 70 6, 190 6, 292 12"
                  stroke={PRIMARY}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  className="hero-draw"
                  pathLength={1}
                  style={{ animationDelay: "0.5s" }}
                  d="M14 21 C 90 13, 200 13, 286 18"
                  stroke={PRIMARY}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              </svg>
            </span>
          </h1>

          {/* Paragraph */}
          <p
            className="hero-in mt-14 max-w-lg text-base leading-relaxed text-[#717171] lg:text-lg dark:text-white"
            style={{ animationDelay: "0.45s" }}
          >
            {t("description")}
          </p>

          {/* Doodle arrow */}
          <svg
            viewBox="0 0 120 90"
            fill="none"
            aria-hidden
            className="absolute -bottom-2 right-4 hidden h-24 w-32 lg:block"
          >
            <path
              className="hero-draw"
              pathLength={1}
              style={{ animationDelay: "0.8s" }}
              d="M8 78 C 30 74, 44 58, 34 46 C 26 36, 12 44, 22 56 C 36 72, 72 62, 100 26"
              stroke={ACCENT}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              className="hero-draw"
              pathLength={1}
              style={{ animationDelay: "1.3s" }}
              d="M84 26 L102 24 L98 42"
              stroke={ACCENT}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* ================= Right: 24hr service badge ================= */}
        <div className="relative mx-auto w-full max-w-[720px]">
          <svg
            viewBox="0 0 660 360"
            fill="none"
            aria-label={t("badgeAria")}
            role="img"
            className="badge-float w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.13)]"
          >
            <defs>
              <clipPath id="ringClip">
                <path d={RING} />
              </clipPath>
              <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={WHITE} stopOpacity="0" />
                <stop offset="50%" stopColor={WHITE} stopOpacity="0.42" />
                <stop offset="100%" stopColor={WHITE} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* ---------- ring + arrow, one rotating unit ---------- */}
            <g className="ring-spin">
              <g className="ring-in">
                {/* white sticker edge */}
                <path
                  d={RING}
                  fill={WHITE}
                  stroke={WHITE}
                  strokeWidth="26"
                  strokeLinejoin="round"
                />
                <path d={RING} fill={PRIMARY} />
                {/* sheen sweeping across the ring */}
                <g clipPath="url(#ringClip)">
                  <rect
                    className="sheen"
                    x="-140"
                    y="0"
                    width="120"
                    height="360"
                    fill="url(#sheen)"
                  />
                </g>
              </g>

              <g className="arrow-in">
                <path
                  d={ARROW}
                  fill={WHITE}
                  stroke={WHITE}
                  strokeWidth="26"
                  strokeLinejoin="round"
                />
                <path d={ARROW} fill={PRIMARY} />
              </g>
            </g>

            {/* ---------- 24 ---------- */}
            <text
              className="item-in"
              style={{ animationDelay: "0.5s" }}
              x="168"
              y="232"
              textAnchor="middle"
              fontSize="120"
              fontWeight="800"
              fontStyle="italic"
              fill={PRIMARY}
              stroke={WHITE}
              strokeWidth="16"
              paintOrder="stroke"
              fontFamily={SANS}
            >
              24
            </text>

            {/* ---------- hr ---------- */}
            <text
              className="item-in"
              style={{ animationDelay: "0.62s" }}
              x="250"
              y="232"
              fontSize="66"
              fontWeight="800"
              fontStyle="italic"
              fill={INK}
              stroke={WHITE}
              strokeWidth="15"
              paintOrder="stroke"
              fontFamily={SANS}
            >
              hr
            </text>

            {/* ---------- {t("service")} banner ---------- */}
            <g className="item-in" style={{ animationDelay: "0.74s" }}>
              <path
                d="M330 158 H520 L552 191 L520 224 H330 Z"
                fill={ACCENT}
                stroke={WHITE}
                strokeWidth="16"
                strokeLinejoin="round"
              />
              <text
                x="425"
                y="204"
                textAnchor="middle"
                fontSize="34"
                fontWeight="800"
                letterSpacing="5"
                fill={INK}
                fontFamily={SANS}
              >
                {t("service")}
              </text>
            </g>

            {/* ---------- {t("everyday")} ---------- */}
            <text
              className="item-in"
              style={{ animationDelay: "0.86s" }}
              x="326"
              y="300"
              fontSize="56"
              fontWeight="800"
              fontStyle="italic"
              letterSpacing="1"
              fill={INK}
              stroke={WHITE}
              strokeWidth="16"
              paintOrder="stroke"
              fontFamily={SANS}
            >
              {t("everyday")}
            </text>
          </svg>
        </div>
      </div>

      <style>{`
        /* Everything animates on transform + opacity only, so the compositor
           handles it and nothing triggers layout or paint. */
        .hero-in, .badge-float, .ring-in, .arrow-in, .item-in, .sheen {
          will-change: transform, opacity;
        }

        /* ---------- left column ---------- */
        .hero-in {
          opacity: 0;
          animation: heroIn 1.1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
        @keyframes heroIn {
          from { opacity: 0; transform: translate3d(0, 24px, 0); }
          to   { opacity: 1; transform: none; }
        }

        .hero-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: heroDraw 1.4s cubic-bezier(0.33, 1, 0.68, 1) 0.5s forwards;
        }
        @keyframes heroDraw { to { stroke-dashoffset: 0; } }

        /* ---------- badge ---------- */
        .badge-float { animation: badgeFloat 9s cubic-bezier(0.37, 0, 0.63, 1) 2s infinite; }
        @keyframes badgeFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(0, -12px, 0); }
        }

        .ring-in {
          transform-box: fill-box;
          transform-origin: center;
          animation: ringIn 1.5s cubic-bezier(0.22, 0.61, 0.36, 1) 0.15s both;
        }
        @keyframes ringIn {
          from { opacity: 0; transform: rotate(-48deg) scale(0.86); }
          to   { opacity: 1; transform: none; }
        }

        .arrow-in {
          transform-box: fill-box;
          transform-origin: 15% 85%;
          animation: arrowIn 1.1s cubic-bezier(0.22, 0.61, 0.36, 1) 0.75s both;
        }
        @keyframes arrowIn {
          from { opacity: 0; transform: rotate(-26deg) scale(0.82); }
          to   { opacity: 1; transform: none; }
        }

        .item-in {
          transform-box: fill-box;
          transform-origin: center;
          animation: itemIn 1s cubic-bezier(0.22, 0.61, 0.36, 1) both;
        }
        @keyframes itemIn {
          from { opacity: 0; transform: translate3d(0, 12px, 0) scale(0.96); }
          to   { opacity: 1; transform: none; }
        }

        .sheen { animation: sheen 6s cubic-bezier(0.45, 0, 0.55, 1) 2.4s infinite; }
        @keyframes sheen {
          0%        { transform: translate3d(0, 0, 0); }
          38%, 100% { transform: translate3d(620px, 0, 0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-in, .hero-draw, .badge-float,
          .ring-in, .arrow-in, .item-in, .sheen {
            animation: none;
            opacity: 1;
            stroke-dashoffset: 0;
          }
          .sheen { opacity: 0; }
        }
          .ring-spin {
          transform-box: view-box;
          transform-origin: 170px 190px;
          animation: ringSpin 7s cubic-bezier(0.65, 0, 0.35, 1) 1.8s infinite;
        }
        @keyframes ringSpin {
          0%, 18%   { transform: rotate(0deg); }
          72%, 100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}