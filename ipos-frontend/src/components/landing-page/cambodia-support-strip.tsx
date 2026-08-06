import {
    Banknote,
    Languages,
    MessagesSquare,
    MonitorSmartphone,
    QrCode,
} from "lucide-react";

import { ScrollReveal } from "./scroll-reveal";

const SUPPORT_ITEMS = [
    { icon: Banknote, label: "USD and KHR" },
    { icon: QrCode, label: "KHQR payment workflow" },
    { icon: Languages, label: "Khmer and English" },
    { icon: MessagesSquare, label: "Telegram and Messenger" },
    { icon: MonitorSmartphone, label: "Desktop, tablet, and mobile" },
] as const;

export function CambodiaSupportStrip() {
    return (
        <section className="w-full border-y border-hairline bg-card px-5 py-10 md:px-8 md:py-12">
            <div className="mx-auto w-full max-w-6xl">
                <ScrollReveal direction="up">
                    <h2 className="text-center font-display text-base font-bold text-brand-ink md:text-lg">
                        Built for how businesses operate in Cambodia
                    </h2>

                    {/* Two columns on small screens, a single row from md up. */}
                    <ul className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 md:flex md:items-center md:justify-between md:gap-4">
                        {SUPPORT_ITEMS.map(({ icon: Icon, label }) => (
                            <li
                                key={label}
                                className="flex items-center gap-2.5 text-[13px] font-medium text-muted-foreground"
                            >
                                <Icon
                                    className="size-4 shrink-0 text-brand"
                                    strokeWidth={1.75}
                                    aria-hidden
                                />
                                {label}
                            </li>
                        ))}
                    </ul>
                </ScrollReveal>
            </div>
        </section>
    );
}
