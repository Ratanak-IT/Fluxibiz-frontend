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
 * The cards are fixed-width and never shrink, so the row keeps overflowing
 * sideways rather than squeezing more in — which is what gives it something
 * to scroll.
 *
 * The scrollbar itself is hidden: an arrow appears at whichever end still has
 * items past it, which says the same thing more quietly and doubles as the
 * control for a pointer that has no touch swipe to offer.
 */
function ProductRow({ items }: { items: MenuItemData[] }) {
    const t = useTranslations("Store");
    const trackRef = useRef<HTMLDivElement>(null);
    const [canScrollBack, setCanScrollBack] = useState(false);
    const [canScrollOn, setCanScrollOn] = useState(false);

    const syncArrows = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;

        // Fractional layout widths leave a sub-pixel remainder at either end,
        // so a whole pixel of slack keeps an arrow from lingering on a row
        // that is already scrolled as far as it goes.
        const remaining = track.scrollWidth - track.clientWidth - track.scrollLeft;
        setCanScrollBack(track.scrollLeft > 1);
        setCanScrollOn(remaining > 1);
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        syncArrows();

        // Both the row's own width and its content can change after mount —
        // a filter narrowing the list, the viewport rotating — and either
        // decides whether there is anything left to scroll to.
        const observer = new ResizeObserver(syncArrows);
        observer.observe(track);
        return () => observer.disconnect();
    }, [syncArrows, items.length]);

    const scrollByCard = (direction: 1 | -1) => {
        const track = trackRef.current;
        if (!track) return;

        // One card and its gap, so a click lands the next card where the
        // last one was rather than at some arbitrary offset.
        const card = track.firstElementChild;
        const step = (card ? card.clientWidth : track.clientWidth) + CARD_GAP;
        track.scrollBy({ left: direction * step, behavior: "smooth" });
    };

    return (
        <div className="group relative">
            <div
                ref={trackRef}
                onScroll={syncArrows}
                className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-1 py-1"
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
                            // Bare chevron, no chrome behind it — the arrow
                            // is a hint about the row, not a control panel
                            // sitting on top of it. The box stays 8x8 so
                            // there is still something to click at.
                            "absolute top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center text-neutral-400 transition hover:text-neutral-700 sm:flex dark:text-neutral-500 dark:hover:text-neutral-200",
                            side === "back" ? "-left-3" : "-right-3",
                        )}
                    >
                        <Icon className="h-4 w-4" />
                    </button>
                ) : null,
            )}

            {/* A touch screen has no pointer to hover an arrow with, and the
                arrows are hidden there; this is the hint in its place. */}
            {canScrollOn && (
                <div className="pointer-events-none absolute -right-1 top-1/2 z-20 -translate-y-1/2 text-neutral-400 sm:hidden dark:text-neutral-500">
                    <ChevronRight className="h-4 w-4" />
                </div>
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

<<<<<<< HEAD
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.isArray(items) && items.map((item) => (
                    <MenuProductCard key={item.id} item={item} />
=======
            <div className="space-y-3">
                {rows.map((row, index) => (
                    <ProductRow key={index} items={row} />
>>>>>>> 518ace3c769eb440171b054a0225a48a8795294d
                ))}
            </div>
        </section>
    );
}
