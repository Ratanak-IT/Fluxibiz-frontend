"use client";

import { useState, type ComponentType } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Section, SectionHeading } from "./landing-shared";
import {
    CustomerMockup,
    PosMockup,
    StockMockup,
} from "./product-mockups";

/**
 * Base UI's Tabs supplies the roles, arrow-key roving focus and aria wiring.
 * Motion is used here — and only here on this page — because the panel swap is a
 * presence transition that CSS alone cannot sequence cleanly.
 */
const BUSINESS_TYPES: {
    value: string;
    label: string;
    points: string[];
    visual: ComponentType<{ className?: string }>;
}[] = [
    {
        value: "retail",
        label: "Retail",
        points: [
            "Barcode sales",
            "Item groups",
            "Stock quantities",
            "Product variants",
            "Discounts",
            "Customer memberships",
        ],
        visual: StockMockup,
    },
    {
        value: "cafe",
        label: "Café & Restaurant",
        points: [
            "Fast ordering",
            "Counter or table sales",
            "Item options",
            "KHQR payments",
            "Order preparation flow",
        ],
        visual: PosMockup,
    },
    {
        value: "service",
        label: "Service Business",
        points: [
            "Service items",
            "Timed sessions",
            "Staff assignment",
            "Customer history",
            "Payment tracking",
        ],
        visual: CustomerMockup,
    },
];

export function BusinessTypeSwitcher() {
    const [value, setValue] = useState(BUSINESS_TYPES[0].value);
    const reduceMotion = useReducedMotion();

    return (
        <Section id="business" className="bg-card">
            <SectionHeading
                align="center"
                description="Choose a business type to see how the same connected system supports different workflows."
            >
                FluxiBiz adapts to the way you work
            </SectionHeading>

            <Tabs
                value={value}
                onValueChange={(next) => setValue(String(next))}
                className="mt-12 items-center"
            >
                <TabsList
                    className="h-auto flex-wrap justify-center gap-2 rounded-full border border-hairline bg-muted/60 p-1.5"
                >
                    {BUSINESS_TYPES.map((type) => (
                        <TabsTrigger
                            key={type.value}
                            value={type.value}
                            className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors duration-200 after:hidden hover:text-foreground data-active:bg-brand data-active:text-brand-foreground focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            {type.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {BUSINESS_TYPES.map((type) => {
                    const Visual = type.visual;

                    return (
                        <TabsContent
                            key={type.value}
                            value={type.value}
                            className="mt-10 w-full"
                        >
                            {/* initial={false} keeps the active panel visible in
                                the server-rendered HTML — the transition only
                                plays once a visitor actually switches tabs. */}
                            <motion.div
                                initial={false}
                                animate={
                                    value === type.value
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: reduceMotion ? 0 : 12 }
                                }
                                transition={{
                                    duration: reduceMotion ? 0 : 0.35,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="grid items-center gap-10 rounded-2xl border border-hairline bg-background p-6 md:grid-cols-2 md:p-8"
                            >
                                <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                                    {type.points.map((point) => (
                                        <li
                                            key={point}
                                            className="flex items-center gap-2.5 text-sm text-foreground"
                                        >
                                            <span
                                                className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-deep"
                                                aria-hidden
                                            >
                                                <Check className="size-3" />
                                            </span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mx-auto w-full max-w-sm">
                                    <Visual />
                                </div>
                            </motion.div>
                        </TabsContent>
                    );
                })}
            </Tabs>
        </Section>
    );
}
