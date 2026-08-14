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

/**
 * When the online store takes orders — today at a glance, the week behind a
 * click.
 *
 * Today answers the only question most shoppers have; the week answers the
 * one a shopper who arrives after closing has, which is when to come back.
 * Folded away rather than listed out, because seven rows is a lot of card for
 * a shop that is open right now.
 *
 * These are the Online Store's hours, not the shopfront's: they are what the
 * checkout enforces, so they are the only ones worth printing here.
 */
/**
 * Today's hours as one readable line — "Open today 9:00 AM – 6:00 PM".
 *
 * Composed here rather than taken from the server's `hoursToday`, which is an
 * English sentence in 24-hour time. Null when the shop keeps no web hours:
 * there is nothing to say about a store that never closes.
 */
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
                    "rounded-full px-2 py-0.5 text-[11px] font-bold",
                    isOpen
                        ? "bg-primary/10 text-primary"
                        : "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
                )}
            >
                {isOpen ? t("open") : t("closed")}
            </span>
        );

    // Nothing to unfold on a shop that keeps no hours: the summary already
    // says everything there is to say.
    if (week.length === 0) {
        return (
            <div className={cn("flex items-center gap-1.5", className)}>
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <span>{todayLabel}</span>
                {pill}
            </div>
        );
    }

    // Floated rather than unfolded in place: the card's bottom row is a line
    // of facts, and pushing a table into it shoves the rest of the card down
    // every time someone glances at the week.
    return (
        <div className={cn("flex items-center gap-1.5", className)}>
            <Clock className="h-4 w-4 shrink-0 text-primary" />
            <span>{todayLabel}</span>
            {pill}

            <Popover>
                <PopoverTrigger className="cursor-pointer text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
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
