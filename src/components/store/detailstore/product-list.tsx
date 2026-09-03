"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { MenuItemData } from "@/lib/store/detailstore/detailstore";
import { MenuProductCard } from "./product-card";
import { cn } from "@/lib/utils";

/** Up to this many items stay on one row; past it the section splits in two. */
const SINGLE_ROW_MAX = 2;

/** The gap between cards, in px — kept in step with the `gap-4` below. */
const CARD_GAP = 16;

interface ProductListProps {
    title?: string;
    items: MenuItemData[];
}

/**
 * One horizontally scrolling row of cards, with its own scroll position.
 *
 * An arrow button appears on hover at whichever end still has items past it,
 * styled with a clean white circle, drop shadow, and smooth fade transition.
 */
function ProductRow({ items }: { items: MenuItemData[] }) {
    const t = useTranslations("Store");
    const trackRef = useRef<HTMLDivElement>(null);
    const [canScrollBack, setCanScrollBack] = useState(false);
    const [canScrollOn, setCanScrollOn] = useState(false);

    const syncArrows = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;

        const maxScroll = track.scrollWidth - track.clientWidth;
        // If content fits without scrolling, neither button should appear
        if (maxScroll <= 8) {
            setCanScrollBack(false);
            setCanScrollOn(false);
            return;
        }

        // Threshold of 12px accounts for subpixel snapping and padding
        setCanScrollBack(track.scrollLeft > 12);
        setCanScrollOn(track.scrollLeft < maxScroll - 12);
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        syncArrows();

        track.addEventListener("scroll", syncArrows, { passive: true });
        track.addEventListener("scrollend", syncArrows, { passive: true } as any);
        window.addEventListener("resize", syncArrows);

        const observer = new ResizeObserver(syncArrows);
        observer.observe(track);

        return () => {
            track.removeEventListener("scroll", syncArrows);
            track.removeEventListener("scrollend", syncArrows as any);
            window.removeEventListener("resize", syncArrows);
            observer.disconnect();
        };
    }, [syncArrows, items.length]);

    const scrollByCard = (direction: 1 | -1) => {
        const track = trackRef.current;
        if (!track) return;

        const maxScroll = track.scrollWidth - track.clientWidth;
        const card = track.firstElementChild as HTMLElement | null;
        const step = (card ? card.clientWidth : track.clientWidth) + CARD_GAP;

        if (direction === -1) {
            // When within one card of the start, scroll cleanly to 0
            if (track.scrollLeft <= step + 20) {
                track.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                track.scrollBy({ left: -step, behavior: "smooth" });
            }
        } else {
            // When within one card of the end, scroll cleanly to maxScroll
            if (track.scrollLeft + step >= maxScroll - 20) {
                track.scrollTo({ left: maxScroll, behavior: "smooth" });
            } else {
                track.scrollBy({ left: step, behavior: "smooth" });
            }
        }

        // Re-check as smooth scroll animation progresses and finishes
        setTimeout(syncArrows, 80);
        setTimeout(syncArrows, 220);
        setTimeout(syncArrows, 420);
    };

    return (
        <div className="group/row relative">
            <div
                ref={trackRef}
                className="no-scrollbar -mx-2 -my-2 flex snap-x snap-mandatory scroll-pl-2 gap-4 overflow-x-auto overscroll-x-contain px-2 py-3"
            >
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="w-[85%] shrink-0 snap-start sm:w-[380px]"
                    >
                        <MenuProductCard item={item} />
                    </div>
                ))}
            </div>

            {([
                { side: "back", show: canScrollBack, label: t("listing.scrollLeft"), Icon: ChevronLeft },
                { side: "on", show: canScrollOn, label: t("listing.scrollRight"), Icon: ChevronRight },
            ] as const).map(({ side, show, label, Icon }) =>
                show ? (
                    <button
                        key={side}
                        type="button"
                        aria-label={label}
                        onClick={() => scrollByCard(side === "back" ? -1 : 1)}
                        className={cn(
                            "absolute top-1/2 z-20 flex h-8 w-8 sm:h-10 sm:w-10 -translate-y-1/2 items-center justify-center",
                            "rounded-full bg-white text-neutral-900 shadow-sm border border-neutral-200/80 dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-800",
                            "opacity-100 sm:opacity-0 sm:group-hover/row:opacity-100 transition-all duration-200",
                            "hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-105 active:scale-95",
                            side === "back" ? "left-1 sm:left-2" : "right-1 sm:right-2",
                        )}
                    >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-900 dark:text-neutral-100" />
                    </button>
                ) : null,
            )}
        </div>
    );
}

export default function ProductList({ title, items = [] }: ProductListProps) {
    const list = Array.isArray(items) ? items : [];

    // Two rows, each scrolling on its own — so a shopper can leave one where
    // it is while working through the other. Split down the middle rather
    // than dealt alternately: each row is then a run of consecutive items and
    // reads as its own sequence, which dealing would scramble the moment the
    // two scroll positions differ.
    const splitAt = Math.ceil(list.length / 2);
    const rows =
        list.length > SINGLE_ROW_MAX
            ? [list.slice(0, splitAt), list.slice(splitAt)]
            : [list];

    return (
        <section className="py-4">
            {title && (
                <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                    {title}
                </h2>
            )}

            <div className="space-y-4">
                {rows.map((row, index) => (
                    <ProductRow key={index} items={row} />
                ))}
            </div>
        </section>
    );
}
