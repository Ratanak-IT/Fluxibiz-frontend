"use client";

import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    groupedWeeklyStoreHours,
    todaysStoreHours,
    type ChannelSchedule,
} from "@/lib/type/storeType";
import { cn } from "@/lib/utils";

export function useTodayHoursLabel(
    onlineHours?: ChannelSchedule | null,
): string | null {
    const t = useTranslations("Store.common");
    const today = todaysStoreHours(onlineHours);

    if (today.alwaysOpen) return null;

    return today.closedToday
        ? t("closedToday")
        : t("openToday", { hours: today.windows.join(", ") });
}

export default function StoreHours({
    onlineHours,
    isOpen,
    className,
}: {
    onlineHours?: ChannelSchedule | null;
    /** Whether orders are being taken this minute, as the server read it. */
    isOpen?: boolean;
    className?: string;
}) {
    const t = useTranslations("Store.common");

    const today = todaysStoreHours(onlineHours);
    const week = groupedWeeklyStoreHours(onlineHours);

    const todayLabel = today.alwaysOpen
        ? t("openAllDay")
        : today.closedToday
          ? t("closedToday")
          : t("openToday", { hours: today.windows.join(", ") });

    const pill =
        isOpen === undefined ? null : (
            <span
                className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    isOpen
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-[#26533c] dark:bg-[#1c382b] dark:text-[#4ade80]"
                        : "border border-red-200 bg-red-50 text-red-600 dark:border-[#5c2424] dark:bg-[#3b1919] dark:text-[#f87171]",
                )}
            >
                {isOpen ? t("open") : t("closed")}
            </span>
        );

    if (week.length === 0) {
        return (
            <div className={cn("flex flex-wrap items-center gap-2", className)}>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-[#4ade80] font-medium">
                    <Clock className="h-4 w-4 shrink-0 text-emerald-600 dark:text-[#4ade80]" />
                    <span>{todayLabel}</span>
                </div>
                {pill}
            </div>
        );
    }

    return (
        <div className={cn("flex flex-wrap items-center gap-2", className)}>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-[#4ade80] font-medium">
                <Clock className="h-4 w-4 shrink-0 text-emerald-600 dark:text-[#4ade80]" />
                <span>{todayLabel}</span>
            </div>
            {pill}

            <Popover>
                <PopoverTrigger className="cursor-pointer text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">
                    {t("allHours")}
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto min-w-56 p-3">
                    <dl className="grid gap-1.5 text-xs">
                        {week.map((run) => (
                            <div
                                key={run.from}
                                className={cn(
                                    "flex items-baseline justify-between gap-6",
                                    run.today && "font-bold text-foreground",
                                )}
                            >
                                <dt className="whitespace-nowrap">
                                    {run.from === run.to
                                        ? t(`daysShort.${run.from}`)
                                        : `${t(`daysShort.${run.from}`)} – ${t(`daysShort.${run.to}`)}`}
                                </dt>
                                <dd
                                    className={cn(
                                        "whitespace-nowrap text-right",
                                        run.closed && "text-muted-foreground",
                                    )}
                                >
                                    {run.closed
                                        ? t("closed")
                                        : run.windows.join(", ")}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </PopoverContent>
            </Popover>
        </div>
    );
}
