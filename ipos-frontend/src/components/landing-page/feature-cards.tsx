import {
    LayoutDashboard,
    PackageSearch,
    Utensils,
    type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { LANDING_IMAGES, Section, SectionHeading } from "./landing-shared";
import { ScrollReveal } from "./scroll-reveal";
import { EditableImage } from "./editable-image";

const FEATURES: {
    title: string;
    body: string;
    image: string;
    alt: string;
    icon: LucideIcon;
    tag: string;
}[] = [
    {
        title: "Dynamic business",
        body: "A fast, intuitive point-of-sale built for front-of-house speed and serve with zero friction.",
        image: LANDING_IMAGES.features.pos,
        alt: "Waiter taking an order on a tablet at a café table",
        icon: Utensils,
        tag: "Zero friction",
    },
    {
        title: "Inventory management",
        body: "Track stock in real time, automate reorders, and cut waste with recipe-level counts.",
        image: LANDING_IMAGES.features.inventory,
        alt: "Inventory analytics overview with turnover charts",
        icon: PackageSearch,
        tag: "Auto reorder",
    },
    {
        title: "Clean dashboard",
        body: "Stay in control with insights across every location - from sales channels to inventory.",
        image: LANDING_IMAGES.features.dashboard,
        alt: "Owner reviewing sales reports on a laptop in an office",
        icon: LayoutDashboard,
        tag: "Live insights",
    },
];

export function FeatureCards() {
    return (
        <Section id="features">
            <span className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full bg-brand-soft py-1 pl-1 pr-3 text-brand-ink">
                <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Why us
                </span>
                <span className="text-xs font-medium">
                    Built for busy counters
                </span>
            </span>

            <SectionHeading
                align="center"
                description="Everything you need to run your business smoothly. Three things that make your business easier to manage."
            >
                <span className="relative inline-block px-1">
                    <span
                        className="absolute inset-x-0 bottom-1 top-1/2 -z-10 -rotate-1 rounded-sm bg-amber/70"
                        aria-hidden
                    />
                    Everything
                </span>{" "}
                a till should do — and the{" "}
                <span className="relative inline-block">
                    back office
                    <svg
                        viewBox="0 0 220 14"
                        preserveAspectRatio="none"
                        className="absolute -bottom-2 left-0 h-3.5 w-full text-brand"
                        aria-hidden
                    >
                        <path
                            d="M2 9c28-9 56 8 84 0s56-8 84 0s24 5 44-1"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </svg>
                </span>{" "}
                too
            </SectionHeading>

            <ol className="mt-16 grid grid-cols-1 gap-8 md:mt-20 md:grid-cols-3 md:items-stretch md:gap-6">
                {FEATURES.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <ScrollReveal
                            key={feature.title}
                            direction="up"
                            delay={index * 120}
                            className="h-full"
                        >
                            <li className="h-full">
                                <Card className="group relative h-full gap-0 overflow-hidden rounded-2xl border-hairline p-6 transition-[border-color] duration-500 ease-out hover:border-brand/40">
                                    <div className="origin-center transition-transform duration-500 ease-out group-hover:scale-[1.04]">
                                        <div
                                            className="flex items-center gap-2"
                                            aria-hidden
                                        ></div>

                                        <div className="mt-3 flex items-center gap-3">
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-brand text-brand transition-colors duration-300 group-hover:border-brand-deep group-hover:text-brand-deep">
                                                <Icon className="size-4" />
                                            </span>
                                            <h3 className="font-display text-lg font-bold text-primary transition-colors duration-300 group-hover:text-brand-deep">
                                                {feature.title}
                                            </h3>
                                        </div>

                                        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                                            {feature.body}
                                        </p>

                                        <div className="relative mt-8 aspect-16/10 overflow-hidden rounded-xl bg-brand-soft ring-1 ring-inset ring-hairline">
                                            <EditableImage
                                                src={feature.image}
                                                alt={feature.alt}
                                                label={feature.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="object-cover object-top"
                                            />
                                            <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                            <span className="hero-float-sm absolute top-3 right-3 rotate-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-brand-ink shadow-md transition-transform duration-300 group-hover:rotate-0 dark:bg-card/95">
                                                {feature.tag}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </li>
                        </ScrollReveal>
                    );
                })}
            </ol>
        </Section>
    );
}
