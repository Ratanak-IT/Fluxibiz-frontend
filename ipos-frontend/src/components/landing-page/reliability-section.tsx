import {
    RefreshCw,
    ScrollText,
    ShieldCheck,
    UserRoundCog,
    type LucideIcon,
} from "lucide-react";

import { Section } from "./landing-shared";
import { ScrollReveal } from "./scroll-reveal";

const BENEFITS: { title: string; body: string; icon: LucideIcon }[] = [
    {
        title: "Secure access",
        body: "Protect business accounts through secure authentication and controlled sessions.",
        icon: ShieldCheck,
    },
    {
        title: "Staff permissions",
        body: "Control what owners, cashiers, stock managers, and staff can access.",
        icon: UserRoundCog,
    },
    {
        title: "Auditable records",
        body: "Keep clear records of orders, payments, sales, and stock movements.",
        icon: ScrollText,
    },
    {
        title: "Connected data",
        body: "Keep information consistent across the POS, storefront, dashboards, and order channels.",
        icon: RefreshCw,
    },
];

export function ReliabilitySection() {
    return (
        <Section className="bg-brand-surface text-white">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-amber">
                Secure and dependable
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-3xl font-extrabold leading-[1.15] text-white md:text-[2.5rem]">
                Built for the moments your business cannot afford to miss
            </h2>

            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {BENEFITS.map(({ title, body, icon: Icon }, index) => (
                    <ScrollReveal
                        key={title}
                        direction="up"
                        delay={index * 90}
                        className="h-full"
                    >
                        <li className="h-full list-none rounded-2xl border border-white/12 bg-white/5 p-5 transition-colors duration-300 hover:border-white/25 hover:bg-white/8">
                            <span
                                className="flex size-10 items-center justify-center rounded-full bg-white/10 text-amber"
                                aria-hidden
                            >
                                <Icon className="size-4.5" />
                            </span>

                            <h3 className="mt-4 font-display text-base font-bold text-white">
                                {title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-white/70">
                                {body}
                            </p>
                        </li>
                    </ScrollReveal>
                ))}
            </ul>
        </Section>
    );
}
