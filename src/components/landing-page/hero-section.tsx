"use client";

import { useRef, type MouseEvent, type RefObject } from "react";
import { Check } from "lucide-react";

import { Card } from "@/components/ui/card";

const GLANCE_ROWS = [
    { label: "Orders", value: "124", dot: "bg-brand" },
    { label: "Stock synced", value: "86 SKUs", dot: "bg-brand" },
    { label: "Revenue", value: "$2,410", dot: "bg-amber" },
] as const;

const FLOAT_DOTS = [
    {
        top: "8%",
        left: "6%",
        size: "size-2",
        color: "bg-brand/30",
        anim: "hero-float-sm",
        depth: 1.4,
    },
    {
        top: "18%",
        left: "42%",
        size: "size-1.5",
        color: "bg-amber/40",
        anim: "hero-float",
        depth: 0.8,
    },
    {
        top: "6%",
        left: "68%",
        size: "size-2.5",
        color: "bg-brand/25",
        anim: "hero-float-slow",
        depth: 1.8,
    },
    {
        top: "34%",
        left: "12%",
        size: "size-1.5",
        color: "bg-amber/35",
        anim: "hero-float-slow",
        depth: 1,
    },
    {
        top: "60%",
        left: "4%",
        size: "size-2",
        color: "bg-brand/20",
        anim: "hero-float",
        depth: 1.6,
    },
    {
        top: "72%",
        left: "36%",
        size: "size-1.5",
        color: "bg-brand/30",
        anim: "hero-float-sm",
        depth: 0.7,
    },
    {
        top: "50%",
        left: "88%",
        size: "size-2",
        color: "bg-amber/30",
        anim: "hero-float-slow",
        depth: 1.3,
    },
    {
        top: "80%",
        left: "70%",
        size: "size-1.5",
        color: "bg-brand/25",
        anim: "hero-float",
        depth: 0.9,
    },
    {
        top: "14%",
        left: "92%",
        size: "size-2",
        color: "bg-brand/20",
        anim: "hero-float-sm",
        depth: 1.5,
    },
    {
        top: "88%",
        left: "18%",
        size: "size-2.5",
        color: "bg-amber/25",
        anim: "hero-float",
        depth: 1.1,
    },
] as const;

function FloatingDots({
    containerRef,
}: {
    containerRef: RefObject<HTMLDivElement | null>;
}) {
    return (
        <div
            ref={containerRef}
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden
        >
            {FLOAT_DOTS.map((dot, i) => (
                <div
                    key={i}
                    className="absolute transition-transform duration-300 ease-out"
                    style={{
                        top: dot.top,
                        left: dot.left,
                        transform: `translate3d(calc(var(--mx, 0) * ${dot.depth * 26}px), calc(var(--my, 0) * ${dot.depth * 26}px), 0)`,
                    }}
                >
                    <span
                        className={`block rounded-full ${dot.size} ${dot.color} ${dot.anim}`}
                    />
                </div>
            ))}
        </div>
    );
}

/** Sparkline for the "Today, at a glance" card. Static by design — it's a preview, not live data. */
function Sparkline() {
    return (
        <svg
            viewBox="0 0 220 60"
            className="h-14 w-full"
            role="img"
            aria-label="Orders trend, last 7 days"
        >
            <polyline
                className="sparkline-draw"
                points="0,42 32,20 64,8 96,26 128,34 160,22 192,40 220,10"
                fill="none"
                stroke="var(--brand)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function GlanceCard() {
    return (
        <Card className="hero-float w-70 rotate-1 gap-0 rounded-2xl border-hairline p-5 shadow-[0_24px_60px_-24px_rgba(15,36,23,0.35)] sm:w-[430px]">
            <div className="mb-4 flex gap-1.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                    <span
                        key={i}
                        className="size-1.5 rounded-full bg-hairline"
                    />
                ))}
            </div>

            <h3 className="font-display text-lg font-bold text-brand-ink">
                Today, at a glance
            </h3>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                FluxiBiz · all systems synced
            </p>

            <div className="mt-5 space-y-3">
                <Row {...GLANCE_ROWS[0]} />
                <Sparkline />
                <Row {...GLANCE_ROWS[1]} />
                <Row {...GLANCE_ROWS[2]} />
            </div>

            <div className="mt-5 flex items-baseline justify-between border-t border-brand-ink pt-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-ink">
                    Net today
                </span>
                <span className="font-display text-2xl font-bold text-brand-ink">
                    $2,410
                </span>
            </div>
        </Card>
    );
}

function Row({
    label,
    value,
    dot,
}: {
    label: string;
    value: string;
    dot: string;
}) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-brand-ink">
                <span className={`size-2 rounded-full ${dot}`} aria-hidden />
                {label}
            </span>
            <span className="text-muted-foreground">{value}</span>
        </div>
    );
}

function MonthCard() {
    return (
        <Card className="hero-float-slow absolute -bottom-2 -right-2 z-10 w-47.5 gap-0 rounded-xl border-hairline bg-background p-4 shadow-[0_20px_45px_-20px_rgba(15,36,23,0.4)]">
            <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                    This month
                </span>
                <span className="flex items-center gap-1 text-[10px] text-brand">
                    <span
                        className="size-1.5 rounded-full bg-brand"
                        aria-hidden
                    />
                    live
                </span>
            </div>
            <p className="mt-2 font-display text-xl font-bold text-brand-ink">
                $11,284<span className="text-muted-foreground">.50</span>
            </p>
            <div className="mt-3 flex h-10 items-end gap-1.5" aria-hidden>
                {[35, 55, 45, 70, 100, 60].map((h, i) => (
                    <span
                        key={i}
                        style={{ height: `${h}%` }}
                        className={`flex-1 rounded-sm ${h === 100 ? "bg-brand-deep" : "bg-brand/15"}`}
                    />
                ))}
            </div>
        </Card>
    );
}

function HeroWave() {
    return (
        <div
            className="pointer-events-none absolute inset-x-0 bottom-0"
            aria-hidden
        >
            <svg
                viewBox="0 0 1440 220"
                preserveAspectRatio="none"
                className="h-32 w-full md:h-64"
            >
                <path
                    className="hero-wave-dash"
                    d="M0 118C160 156 320 70 480 96C640 122 720 192 880 168C1040 144 1120 54 1280 82C1360 96 1400 110 1440 104"
                    fill="none"
                    stroke="var(--brand)"
                    strokeWidth="2"
                    strokeDasharray="6 7"
                    opacity="0.7"
                />
                
                <path
                    d="M0 132C160 170 320 84 480 110C640 136 720 206 880 182C1040 158 1120 68 1280 96C1360 110 1400 124 1440 118V300H0Z"
                    fill="var(--brand)"
                />
            </svg>
        </div>
    );
}

export function HeroSection() {
    const dotsRef = useRef<HTMLDivElement>(null);

    function handleMouseMove(event: MouseEvent<HTMLElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const mx = (event.clientX - rect.left) / rect.width - 0.5;
        const my = (event.clientY - rect.top) / rect.height - 0.5;
        dotsRef.current?.style.setProperty("--mx", String(mx));
        dotsRef.current?.style.setProperty("--my", String(my));
    }

    function handleMouseLeave() {
        dotsRef.current?.style.setProperty("--mx", "0");
        dotsRef.current?.style.setProperty("--my", "0");
    }

    return (
        <section
            className="relative overflow-hidden pb-32 pt-14 md:pb-44 md:pt-20"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <FloatingDots containerRef={dotsRef} />

            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 px-5 md:px-8 lg:grid-cols-[1.05fr_1fr]">
                <div className="py-8 relative">
                    {/* <Badge className="gap-2 rounded-full bg-brand-soft py-1 pl-1 pr-3 text-brand-ink hover:bg-brand-soft">
                        <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            News
                        </span>
                        <span className="text-xs font-medium">
                            Explore our new business features
                        </span>
                    </Badge> */}

                    <h1 className="mt-6 font-display text-[2.85rem] font-extrabold leading-[1.02] tracking-tight text-brand-ink md:text-[4rem]">
                        Run your whole{" "}
                        <span className="relative inline-block px-1">
                            <span
                                className="absolute inset-x-0 bottom-1 top-1/2 -z-10 -rotate-2 rounded-sm bg-amber/70"
                                aria-hidden
                            />
                            Business
                        </span>{" "}
                        from{" "}
                        <span className="relative inline-block">
                            <em className="font-serif italic text-brand">
                                one screen
                            </em>
                            <svg
                                viewBox="0 0 170 14"
                                preserveAspectRatio="none"
                                className="absolute -bottom-2 left-0 h-3.5 w-full text-brand"
                                aria-hidden
                            >
                                <path
                                    d="M2 9c22-9 44 8 66 0s44-8 66 0s18 5 34-1"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>
                    </h1>

                    <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                        Founded in Phnom Penh in 2026 by a group of IT enthusiasts, FluxiBiz brings everything a business needs to sell, manage and grow into one simple place.
                    </p>

                   
                </div>

                {/* ── Preview cluster ──────────────────────────────────── */}
                <div className="relative mx-auto w-fit lg:mr-0">
                    <span className="hero-float-sm absolute -left-6 -top-6 z-10 -rotate-7 rounded-md bg-brand-deep px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg ">
                        +18% this week
                    </span>
                    <GlanceCard />
                    <span className="hero-float-sm absolute -left-16 -rotate-3 bottom-16 hidden items-center gap-1 rounded-full bg-amber px-3 py-1.5 text-[11px] font-semibold text-brand-ink shadow-md sm:inline-flex">
                        Synced <Check className="size-3" />
                    </span>
                    <MonthCard />
                </div>
            </div>

            <HeroWave />
        </section>
    );
}
