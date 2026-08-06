"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "./landing-shared";

/**
 * Answers describe only what FluxiBiz does today. Nothing here promises
 * unfinished functionality, hardware integrations, or guaranteed outcomes.
 */
const FAQS: { question: string; answer: string }[] = [
    {
        question: "What types of businesses can use FluxiBiz?",
        answer: "FluxiBiz is built for small and medium businesses in Cambodia, including retail shops, cafés and restaurants, and service businesses. The same connected system supports each of them — you choose the items, item groups, and workflow that match how you sell.",
    },
    {
        question: "Can FluxiBiz manage both USD and KHR?",
        answer: "Yes. FluxiBiz supports both US dollars and Cambodian riel, so you can price items and record sales and payments in the currencies your customers actually use.",
    },
    {
        question: "Does FluxiBiz support KHQR payments?",
        answer: "Yes. FluxiBiz includes a KHQR payment workflow alongside cash. The order records the payment method and moves from pending to paid, so digital and cash payments are recorded the same way.",
    },
    {
        question: "Can employees have different roles and permissions?",
        answer: "Yes. FluxiBiz supports staff roles and permissions, so owners, cashiers, stock managers, and staff each see only the parts of the system their role needs.",
    },
    {
        question: "Can customers order through Telegram or Messenger?",
        answer: "Yes. FluxiBiz supports Telegram and Messenger ordering as well as your online storefront. Orders from those channels arrive in the same order workflow as counter sales, so your team works from one queue.",
    },
    {
        question: "Can I access FluxiBiz from a phone or tablet?",
        answer: "Yes. FluxiBiz works on desktop, tablet, and mobile, so you can sell at the counter and review sales, stock, and reports from another device.",
    },
    {
        question: "How does low-stock monitoring work?",
        answer: "Every sale and stock movement updates the item's quantity. You set the level at which an item counts as low, and FluxiBiz flags items at or below it so you can restock before they run out.",
    },
    {
        question: "Do I need special POS hardware?",
        answer: "No. FluxiBiz runs in a web browser on a standard computer, tablet, or phone, so you can start with the devices you already have.",
    },
    {
        question: "How is my business data protected?",
        answer: "Business accounts are protected by secure authentication and controlled sessions, and staff permissions limit what each role can access. Orders, payments, sales, and stock movements are kept as clear records you can review.",
    },
];

export function FAQSection() {
    return (
        <Section id="faq">
            <SectionHeading align="center">
                Questions before getting started
            </SectionHeading>

            <Accordion className="mx-auto mt-12 max-w-3xl">
                {FAQS.map((faq) => (
                    <AccordionItem
                        key={faq.question}
                        value={faq.question}
                        className="border-b border-hairline"
                    >
                        <AccordionTrigger className="gap-6 py-5 text-left font-display text-base font-semibold text-brand-ink hover:no-underline hover:text-brand-deep">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-5 pr-8 text-sm leading-relaxed text-muted-foreground">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </Section>
    );
}
