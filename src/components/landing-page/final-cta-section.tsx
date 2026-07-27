import Link from "next/link";
import {
    ChartNoAxesCombined,
    PackageSearch,
    QrCode,
    ReceiptText,
    Store,
    type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "./landing-shared";
import { ScrollReveal } from "./scroll-reveal";

const FLOW: { label: string; icon: LucideIcon }[] = [
    { label: "Storefront", icon: Store },
    { label: "Order", icon: ReceiptText },
    { label: "Payment", icon: QrCode },
    { label: "Inventory", icon: PackageSearch },
    { label: "Report", icon: ChartNoAxesCombined },
];

/** Dashed link between two flow nodes. The dash animation is switched off by
 *  the global prefers-reduced-motion rule. */
function Connector() {
    return (
        <svg
            className="mt-5 hidden h-2 w-10 shrink-0 self-start md:block lg:w-16"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
            aria-hidden
        >
            <line
                className="connector-dash"
                x1="0"
                y1="1"
                x2="100"
                y2="1"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 7"
                strokeLinecap="round"
                opacity="0.5"
            />
        </svg>
    );
}

export function FinalCTASection() {
    return (
        <Section className="bg-brand-surface text-white">
            <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-display text-3xl font-extrabold leading-[1.12] text-white md:text-[2.75rem]">
                    Your counter is only the beginning.
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/75">
                    Connect sales, payments, inventory, customers, staff, and
                    reports in one business workspace.
                </p>

                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                    <Button
                        nativeButton={false}
                        render={<Link href="/register" />}
                        size="lg"
                        className="h-12 rounded-full bg-white px-7 text-sm font-semibold text-brand-surface shadow-sm transition-colors duration-200 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
                    >
                        Get started
                    </Button>

                    <a
                        href="#product-preview"
                        className="inline-flex items-center rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
                    >
                        Explore the product
                    </a>
                </div>
            </div>

            {/* Storefront → Order → Payment → Inventory → Report */}
            <ScrollReveal direction="up" delay={120}>
                <ol className="mx-auto mt-16 flex max-w-4xl flex-wrap items-start justify-center gap-x-5 gap-y-7 text-white/80 md:flex-nowrap md:gap-x-0">
                    {FLOW.map(({ label, icon: Icon }, index) => (
                        <li key={label} className="flex items-center">
                            <div className="flex w-20 shrink-0 flex-col items-center gap-2">
                                <span
                                    className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-amber"
                                    aria-hidden
                                >
                                    <Icon className="size-4.5" />
                                </span>
                                <span className="text-center text-xs font-medium text-white/80">
                                    {label}
                                </span>
                            </div>

                            {index < FLOW.length - 1 ? <Connector /> : null}
                        </li>
                    ))}
                </ol>
            </ScrollReveal>
        </Section>
    );
}
