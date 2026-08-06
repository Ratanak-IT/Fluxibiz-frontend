import Image from "next/image";
import { Check } from "lucide-react";

import { LANDING_IMAGES, Section } from "./landing-shared";
import { ScrollReveal } from "./scroll-reveal";

export function ProductPreview() {
    return (
        <Section className="pt-0 relative">
            <div className="hero-float absolute -top-8 -left-6 z-30 w-48 -rotate-6 rounded-xl border border-border/60 bg-white p-3.5 shadow-2xl sm:top-10 sm:left-15 sm:w-56 sm:p-4">
                <div className="flex items-center justify-between border-b border-dashed border-zinc-200 pb-2">
                    <div>
                        <p className="font-mono text-xs font-bold text-zinc-900">
                            IPOS · #2241
                        </p>
                        <p className="text-[10px] text-zinc-500">
                            Table 04 · 12:41
                        </p>
                    </div>
                </div>

                <div className="my-2.5 space-y-1 text-[11px] text-zinc-600">
                    <div className="flex justify-between">
                        <span>1× Iced Latte</span>
                        <span>$2.75</span>
                    </div>
                    <div className="flex justify-between">
                        <span>2× Beef Lok Lak</span>
                        <span>$13.00</span>
                    </div>
                    <div className="flex justify-between">
                        <span>1× Kampot Cola</span>
                        <span>$1.50</span>
                    </div>
                </div>

                <div className="border-t border-dashed border-zinc-200 pt-2">
                    <div className="flex items-center justify-between font-bold text-zinc-900">
                        <span className="text-[11px] uppercase tracking-wider">
                            TOTAL
                        </span>
                        <span className="text-emerald-600">$17.25</span>
                    </div>
                    <p className="mt-1 text-[9px] font-medium text-zinc-400">
                        KHQR · paid ✓
                    </p>
                </div>
            </div>
            <div className="hero-float-slow absolute -top-6 -right-4 z-30 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-3.5 shadow-xl sm:top-20 sm:right-6 sm:px-4 sm:py-3">
                <div className="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="size-4" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-zinc-900 sm:text-sm">
                        Cash drawer opened
                    </p>
                    <p className="text-[10px] text-zinc-500">
                        Order #2246 · Counter
                    </p>
                </div>
                <span className="ml-2 text-xs font-bold text-emerald-600 sm:text-sm">
                    +$11.00
                </span>
            </div>
            <ScrollReveal direction="scale" className="relative">
                <div className="group relative overflow-visible rounded-2xl border border-border bg-card p-1.5 sm:p-2.5">
                    <figure className="hero-float-lg overflow-hidden rounded-xl">
                        <Image
                            src={LANDING_IMAGES.dashboardPreview}
                            alt="FluxiBiz dashboard preview"
                            width={1536}
                            height={1068}
                            priority
                            sizes="(max-width: 768px) 100vw, 1152px"
                            className="h-auto w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                        />
                        <figcaption className="sr-only">
                            FluxiBiz business dashboard preview
                        </figcaption>
                    </figure>
                </div>
            </ScrollReveal>
        </Section>
    );
}
