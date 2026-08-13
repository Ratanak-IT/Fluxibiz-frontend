"use client";

import { useState, useMemo } from "react";
import {
    Check,
    ChevronLeft,
    ImageOff,
    Minus,
    Plus,
    ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { attributeIcon } from "@/lib/api/attribute-icons";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/store/productdetail/product";
import { StorefrontItemResponse, primaryItemImage, itemImageUrl, ItemAttributeValue, ItemAttribute, ItemVariant, ItemUomConversion, DescriptionBlockResponse, remainingStock, isVariantSelectable } from "@/lib/type/storeType";
import { resolveMediaUrl } from "@/lib/type/cartType";
import { isItemOutOfStock } from "@/lib/store/detailstore/detailstore";

/**
 * Above this, the exact count is noise — a shopper only needs the number when
 * it is small enough to change what they do.
 */
const LOW_STOCK_THRESHOLD = 10;

// We extract displayOf for options
function displayOf(value: ItemAttributeValue) {
    return value.label || value.value;
}

export function ProductStorefrontUI({
    item,
    currency,
    storeSlug,
    storeName,
    onClose,
    onAddToCart,
    isAddingToCart,
    quantity,
    setQuantity,
    selectedVariant,
    setSelectedVariant,
    selectedAttributes,
    setSelectedAttributes,
    selectedPack,
    setSelectedPack,
    hideAddToCart = false,
}: {
    item: StorefrontItemResponse;
    currency?: string;
    storeSlug?: string;
    storeName?: string;
    onClose?: () => void;
    onAddToCart?: () => void;
    isAddingToCart?: boolean;
    quantity: number;
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
    selectedVariant: ItemVariant | null;
    setSelectedVariant: React.Dispatch<React.SetStateAction<ItemVariant | null>>;
    selectedAttributes: Record<string, string>;
    setSelectedAttributes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    /** The pack being bought, or null for one of the base unit. */
    selectedPack: ItemUomConversion | null;
    setSelectedPack: React.Dispatch<React.SetStateAction<ItemUomConversion | null>>;
    hideAddToCart?: boolean;
}) {
    const t = useTranslations("Store");
    const attributes = item.attributes || [];
    // Memoised because the gallery depends on it: a fresh [] each render would
    // rebuild the rail on every keystroke elsewhere in the page.
    const variants = useMemo(() => item.variants || [], [item.variants]);
    const itemColors = useMemo(() => item.colors || [], [item.colors]);

    /** The size half of what is picked, which the colours below follow. */
    const pickedSize = selectedVariant?.optionName || selectedVariant?.name || "";

    /**
     * The sizes, folded out of the pairs.
     *
     * Storage keeps Large/Red and Large/Navy apart because each has its own
     * shelf; a shopper picks one Large and then a colour. The first pair of a
     * size stands for it — every colour of a size costs the same.
     */
    const sizes = useMemo(() => {
        const rows: { name: string; variant: ItemVariant }[] = [];
        const seen = new Set<string>();

        for (const variant of variants) {
            const name = (variant.optionName || variant.name || "").trim();
            const key = name.toLowerCase();

            if (!name || seen.has(key)) continue;

            seen.add(key);
            rows.push({ name, variant });
        }

        return rows;
    }, [variants]);

    /**
     * The colours the picked size comes in.
     *
     * Read off that size's own pairs, because Large may come in three and
     * Small in two — offering a colour the size does not come in offers
     * something the shop cannot sell.
     */
    const colorsOnOffer = useMemo(() => {
        if (!pickedSize) return [];

        return variants
            .filter(
                (variant) =>
                    (variant.optionName || variant.name || "").trim().toLowerCase() ===
                        pickedSize.trim().toLowerCase() && variant.colorValue,
            )
            .map((variant) => ({
                variant,
                color: itemColors.find(
                    (color) => color.value === variant.colorValue,
                ),
            }))
            .filter((row) => row.color);
    }, [variants, itemColors, pickedSize]);

    /** Picks a size, holding the colour when that size comes in it too. */
    const pickSize = (name: string) => {
        const ofSize = variants.filter(
            (variant) =>
                (variant.optionName || variant.name || "").trim().toLowerCase() ===
                name.trim().toLowerCase(),
        );

        const sameColour = ofSize.find(
            (variant) => variant.colorValue === selectedVariant?.colorValue,
        );

        setSelectedVariant(
            sameColour ?? ofSize.find(isVariantSelectable) ?? ofSize[0] ?? null,
        );
        // Packs belong to the option they were declared for, so the one that
        // was picked is not on offer any more.
        setSelectedPack(null);
    };

    // Stock is counted per option, so the chosen option answers this — not the
    // item, whose figure is the total across options and would happily sell a
    // Large that ran out while the Smalls are stacked up.
    const remaining = remainingStock(
        variants.length > 0 ? selectedVariant : item,
    );
    const outOfStock =
        (variants.length > 0
            ? !isVariantSelectable(selectedVariant)
            : isItemOutOfStock(item)) ||
        // A pack nothing on the shelf can fill is sold out even while single
        // bottles remain.
        (remaining !== null &&
            selectedPack !== null &&
            remaining < (Number(selectedPack.factor) || 1));

    /*
     * Never offer more than the online store may sell. Null means the shop
     * tracks no stock for it, and then there is no ceiling to hold to.
     *
     * Counted in packs, not bottles: four bottles left is zero six-packs, and
     * offering "1" would promise something the basket then refuses.
     */
    const packFactor = selectedPack ? Number(selectedPack.factor) || 1 : 1;
    const maxQuantity =
        remaining === null ? null : Math.floor(remaining / packFactor);
    const atStockCeiling = maxQuantity !== null && quantity >= maxQuantity;

    const options = attributes.filter(
        (attribute) =>
            attribute.placement === "OPTION" &&
            attribute.type !== "TOGGLE" &&
            attribute.values.length > 0,
    );
    const highlights = attributes.filter(
        (attribute) => attribute.placement === "HIGHLIGHT",
    );
    const specs = attributes.filter(
        (attribute) => attribute.placement === "SPECIFICATION",
    );
    const toggles = attributes.filter(
        (attribute) =>
            attribute.placement === "OPTION" && attribute.type === "TOGGLE",
    );

    const [imageIndex, setImageIndex] = useState(0);
    const [switched, setSwitched] = useState<Record<string, boolean>>({});

    /**
     * The packs on offer for what is currently picked.
     *
     * A case of Large is not a case of Small, so an item sold in options shows
     * only the packs declared for the one in hand. A pack the seller has not
     * priced is not something a shopper can buy, so it is not offered at all —
     * the back-office preview shows it as "Price not set" because that is a
     * seller's to-do, not a shopper's choice.
     */
    const selectedVariantId = selectedVariant?.id ?? null;
    const selectedVariantImage = selectedVariant?.imageUrl ?? null;

    const packs = useMemo(() => {
        const all = item.uomConversions ?? [];
        return all
            .filter((pack) => pack.unit?.name && pack.price !== null && pack.price !== undefined)
            .filter((pack) =>
                selectedVariantId
                    ? pack.variantId === selectedVariantId
                    : !pack.variantId,
            );
    }, [item.uomConversions, selectedVariantId]);

    /** "bottle", for reading inside "Holds 6 bottles". */
    const unitWord = (item.unit?.name || "unit").trim().toLowerCase();
    const singleLabel = selectedVariant?.name
        ? `One ${selectedVariant.name}`
        : `One ${unitWord}`;

    const singlePrice =
        selectedVariant?.price !== undefined && selectedVariant?.price !== null
            ? Number(selectedVariant.price)
            : item.price === undefined || item.price === null
                ? undefined
                : Number(item.price);

    /*
     * A pack is priced in its own right rather than as a multiple — a case is
     * not twenty-four times a can — so picking one replaces the price rather
     * than multiplying it.
     */
    const activePrice = selectedPack ? Number(selectedPack.price) : singlePrice;
    const compareAt = item.compareAtPrice ? Number(item.compareAtPrice) : 0;
    const discount =
        compareAt && activePrice !== undefined && compareAt > activePrice
            ? Math.round(((compareAt - activePrice) / compareAt) * 100)
            : 0;

    /**
     * Every picture the item has, in one rail down the left — the item's own
     * gallery, plus one per colour the seller photographed.
     *
     * The chips themselves stay text: a swatch and a name are enough to say
     * which choice it is, and a thumbnail repeated inside every chip is the
     * same picture twice on one screen. What the choice does instead is move
     * the rail — picking "Red" leads with the red one, which is what a shopper
     * came to see.
     */
    const images = useMemo(() => {
        const gallery: string[] = [];

        const push = (url: string | null) => {
            if (url && !gallery.includes(url)) gallery.push(url);
        };

        const sorted = [...(item.images ?? [])].sort(
            (a, b) => (a.position ?? 0) - (b.position ?? 0),
        );
        sorted.forEach((img) => push(itemImageUrl(img)));

        if (gallery.length === 0) push(primaryItemImage(item));

        // Every picture the item has, whichever choice it hangs off: the rail
        // is how a shopper browses them, not only how they see the one picked.
        itemColors.forEach((color) => push(resolveMediaUrl(color.imageUrl)));
        variants.forEach((option) => push(resolveMediaUrl(option.imageUrl)));

        return gallery;
    }, [item, variants, itemColors]);

    /**
     * Which picture the current choices point at.
     *
     * The colour wins, since that is the choice a photograph can actually
     * show — and it is uploaded once for every size that comes in it. The
     * pair's own picture is the fallback.
     */
    const chosenImage =
        resolveMediaUrl(
            itemColors.find(
                (color) => color.value === selectedVariant?.colorValue,
            )?.imageUrl,
        ) ?? resolveMediaUrl(selectedVariantImage);

    /*
     * Follow the choice rather than fight it: a shopper who just picked a
     * colour is asking to see that colour.
     *
     * Adjusted during render against the previous choice rather than in an
     * effect, so the rail never paints the old picture for a frame first — and
     * because it only fires when the choice actually changes, clicking a
     * thumbnail afterwards still wins.
     */
    const [shownChoice, setShownChoice] = useState<string | null>(null);

    if (chosenImage && chosenImage !== shownChoice) {
        setShownChoice(chosenImage);
        const position = images.indexOf(chosenImage);
        if (position >= 0) setImageIndex(position);
    }

    // find variant index based on selectedVariant

    return (
        <div className={cn(onClose ? "max-h-[90vh] overflow-y-auto scrollbar-none" : "w-full md:max-h-[90vh] md:overflow-y-auto scrollbar-none max-md:max-h-none max-md:overflow-visible")}>
            {onClose ? (
                <div className="flex items-center gap-2 px-6 pt-6 text-sm text-[#657064] dark:text-[#94a3b8]">
                    <button type="button" onClick={onClose} className="hover:text-primary transition-colors flex items-center gap-2">
                        <ChevronLeft className="size-4" />
                        <span>Store / {item.itemGroup?.name || "product"} / detail</span>
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 px-6 pt-6 text-sm text-[#657064] dark:text-[#94a3b8]">
                    <Link href={`/store/${storeSlug}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                        <ChevronLeft className="size-4" />
                        <span>Store / {item.itemGroup?.name || "product"} / detail</span>
                    </Link>
                </div>
            )}

            <div className="grid gap-8 p-6 md:grid-cols-2">
                <Gallery
                    images={images}
                    name={item.name}
                    index={imageIndex}
                    onSelect={setImageIndex}
                    outOfStock={outOfStock}
                />

                <div className="flex flex-col gap-4">
                    <div>
                        <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                            {item.badge || item.itemGroup?.name || item.itemType?.toLowerCase()}
                            {item.status === "INACTIVE" ? " · Hidden from store" : ""}
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-[#161d16] dark:text-[#f8fafc]">
                            {item.name || "Untitled item"}
                        </h2>
                    </div>

                    {outOfStock && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-600 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-400 font-bold text-sm flex items-center gap-2">
                            <span>⚠️</span>
                            <span>{t("detail.outOfStock") || "Out of Stock"}</span>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                        {/* An unpriced item says so rather than reading "$0.00",
                            which is a price, and a wrong one. */}
                        {activePrice === undefined ? (
                            <span className="text-base font-semibold text-[#657064] dark:text-[#94a3b8]">
                                {t("detail.priceNotSet")}
                            </span>
                        ) : (
                            <span className="text-2xl font-bold text-danger">
                                {formatPrice(activePrice, currency)}
                            </span>
                        )}
                        {discount ? (
                            <>
                                <span className="text-sm text-[#7b857a] dark:text-[#94a3b8] line-through">
                                    {formatPrice(compareAt, currency)}
                                </span>
                                <span className="rounded-full bg-[#d14341]/10 dark:bg-[#f87171]/20 px-2 py-0.5 text-xs font-semibold text-[#d14341] dark:text-[#f87171]">
                                    {discount}% OFF
                                </span>
                            </>
                        ) : null}
                        {selectedPack?.unit?.name ? (
                            <span className="text-sm text-[#657064] dark:text-[#94a3b8]">
                                per {selectedPack.unit.name}
                            </span>
                        ) : item.unit?.name ? (
                            <span className="text-sm text-[#657064] dark:text-[#94a3b8]">
                                per {item.unit.name}
                            </span>
                        ) : null}
                    </div>

                    {item.description ? (
                        <p className="text-sm leading-6 text-[#657064] dark:text-[#cbd5e1]">
                            {item.description}
                        </p>
                    ) : (
                        <p className="text-sm text-[#a3aca1] dark:text-[#94a3b8] italic">
                            No description yet — shoppers will see nothing here.
                        </p>
                    )}

                    {/*
                     * Two rows: the size, then the colours that size comes in.
                     *
                     * Both are the one selection — a variant is a size and a
                     * colour together, because that pair is what the shop
                     * counts. Picking a size re-reads the colours from it, so
                     * Large offering three and Small two is what a shopper
                     * sees rather than a list that lies about one of them.
                     */}
                    {sizes.length > 0 ? (
                        <OptionRow
                            label={t("detail.option")}
                            value={pickedSize || "—"}
                        >
                            {sizes.map(({ name, variant }) => (
                                <Chip
                                    key={name}
                                    active={
                                        name.trim().toLowerCase() ===
                                        pickedSize.trim().toLowerCase()
                                    }
                                    // A size is gone only when every colour of
                                    // it is: Navy running out does not stop
                                    // Large being sold in Red.
                                    disabled={
                                        !variants.some(
                                            (row) =>
                                                (row.optionName || row.name || "")
                                                    .trim()
                                                    .toLowerCase() ===
                                                    name.trim().toLowerCase() &&
                                                isVariantSelectable(row),
                                        )
                                    }
                                    onClick={() => pickSize(name)}
                                >
                                    <span>{name}</span>
                                    {variant.price === undefined ? null : (
                                        <span className="mt-0.5 block text-xs text-[#7b857a] dark:text-[#94a3b8]">
                                            {formatPrice(Number(variant.price), currency)}
                                        </span>
                                    )}
                                </Chip>
                            ))}
                        </OptionRow>
                    ) : null}

                    {colorsOnOffer.length > 0 ? (
                        <OptionRow
                            label={t("detail.colour")}
                            value={selectedVariant?.colorValue || "—"}
                        >
                            {colorsOnOffer.map(({ variant, color }) => {
                                const left = remainingStock(variant);

                                return (
                                    <Swatch
                                        key={color!.value}
                                        name={
                                            left !== null && left <= 0
                                                ? `${color!.value} — ${t("detail.outOfStock")}`
                                                : color!.value
                                        }
                                        colorHex={color!.colorHex}
                                        active={
                                            selectedVariant?.colorValue === color!.value
                                        }
                                        // Its own shelf, so its own answer: the
                                        // whole point of counting per colour.
                                        disabled={!isVariantSelectable(variant)}
                                        onClick={() => {
                                            setSelectedVariant(variant);
                                            setSelectedPack(null);
                                        }}
                                    />
                                );
                            })}
                        </OptionRow>
                    ) : null}

                    {/*
                     * The item's UoM conversions, as a shopper meets them: one,
                     * or a whole pack of them. Stock stays a single number in
                     * the base unit either way — the pack only says how many
                     * come off the shelf.
                     */}
                    {packs.length > 0 ? (
                        <OptionRow
                            label={t("detail.soldAs")}
                            value={selectedPack?.unit?.name || singleLabel}
                        >
                            <Chip
                                active={!selectedPack}
                                onClick={() => {
                                    setSelectedPack(null);
                                    setQuantity(1);
                                }}
                            >
                                <span>{singleLabel}</span>
                                <span className="mt-0.5 block text-xs text-[#7b857a] dark:text-[#94a3b8]">
                                    {singlePrice === undefined
                                        ? t("detail.priceNotSet")
                                        : formatPrice(singlePrice, currency)}
                                </span>
                            </Chip>
                            {packs.map((row) => {
                                const factor = Number(row.factor) || 1;
                                // A pack the shelf cannot fill is not on offer.
                                const packSoldOut =
                                    remaining !== null && remaining < factor;

                                return (
                                    <Chip
                                        key={row.id}
                                        active={selectedPack?.id === row.id}
                                        disabled={packSoldOut}
                                        onClick={() => {
                                            setSelectedPack(row);
                                            setQuantity(1);
                                        }}
                                    >
                                        <span>{row.unit?.name}</span>
                                        <span className="mt-0.5 block text-xs text-[#7b857a] dark:text-[#94a3b8]">
                                            {t("detail.holds", {
                                                count: factor,
                                                unit:
                                                    factor === 1
                                                        ? unitWord
                                                        : `${unitWord}s`,
                                            })}
                                        </span>
                                        <span className="mt-0.5 block text-xs text-[#7b857a] dark:text-[#94a3b8]">
                                            {formatPrice(Number(row.price), currency)}
                                        </span>
                                    </Chip>
                                );
                            })}
                        </OptionRow>
                    ) : null}

                    {options.map((attribute) => {
                        const chosen = attribute.values.find(
                            (value) => value.value === selectedAttributes[attribute.name],
                        );

                        return (
                            <OptionRow
                                key={attribute.name}
                                label={attribute.name}
                                value={chosen ? displayOf(chosen) : "—"}
                            >
                                {attribute.values.map((value) => (
                                        <Chip
                                            key={value.value}
                                            active={selectedAttributes[attribute.name] === value.value}
                                            disabled={value.available === false}
                                            onClick={() =>
                                                setSelectedAttributes((current) => ({
                                                    ...current,
                                                    [attribute.name]: value.value,
                                                }))
                                            }
                                        >
                                            {displayOf(value)}
                                        </Chip>
                                ))}
                            </OptionRow>
                        );
                    })}

                    {toggles.map((attribute) => (
                        <label
                            key={attribute.name}
                            className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium text-[#1a222b] dark:text-[#f8fafc]"
                        >
                            {attribute.name}
                            <input
                                type="checkbox"
                                checked={Boolean(switched[attribute.name])}
                                onChange={(event) =>
                                    setSwitched((current) => ({
                                        ...current,
                                        [attribute.name]: event.target.checked,
                                    }))
                                }
                                className="peer sr-only"
                            />
                            <span className="relative h-6 w-11 shrink-0 rounded-full bg-[#dfe3dd] dark:bg-[#2e3748] transition-colors peer-checked:bg-primary peer-checked:[&>span]:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30">
                                <span className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white dark:bg-[#f8fafc] shadow transition-transform" />
                            </span>
                        </label>
                    ))}

                    {!hideAddToCart && (
                        <>
                            <div className="flex items-center gap-3 self-start rounded-full border border-[#e8e8e8] dark:border-[#2a3042] bg-white dark:bg-[#1e2330] px-3 py-1.5 text-[#1a222b] dark:text-[#f8fafc]">
                                <button
                                    type="button"
                                    aria-label="Decrease quantity"
                                    disabled={outOfStock}
                                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                                    className={cn("text-red-500 dark:text-red-400 hover:text-red-600 transition-colors cursor-pointer", outOfStock && "opacity-40 cursor-not-allowed")}
                                >
                                    <Minus className="size-4" />
                                </button>
                                <span className="min-w-6 text-center text-sm font-medium">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    aria-label="Increase quantity"
                                    disabled={outOfStock || atStockCeiling}
                                    onClick={() =>
                                        setQuantity((current) =>
                                            maxQuantity === null
                                                ? current + 1
                                                : Math.min(maxQuantity, current + 1),
                                        )
                                    }
                                    className={cn(
                                        "text-primary cursor-pointer",
                                        (outOfStock || atStockCeiling) && "opacity-40 cursor-not-allowed",
                                    )}
                                >
                                    <Plus className="size-4" />
                                </button>
                            </div>

                            {!outOfStock && remaining !== null && remaining <= LOW_STOCK_THRESHOLD ? (
                                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                    {t("detail.onlyLeft", { count: remaining })}
                                </p>
                            ) : null}

                            <button
                                type="button"
                                onClick={onAddToCart}
                                disabled={isAddingToCart || outOfStock}
                                className={cn(
                                    "flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
                                    outOfStock && "bg-neutral-300 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-800 cursor-not-allowed shadow-none"
                                )}
                            >
                                <ShoppingBag className="size-4" />
                                {outOfStock ? (t("detail.outOfStock") || "Out of Stock") : isAddingToCart ? (t("detail.adding") || "Adding...") : (t("detail.add") || "Add to Cart")}
                            </button>
                        </>
                    )}

                    {highlights.length > 0 ? (
                        <div className="grid gap-4 border-t border-[#e4eae2] dark:border-[#242937] pt-4 sm:grid-cols-3">
                            {highlights.map((attribute) => {
                                const Glyph = attributeIcon(attribute.icon);

                                return (
                                    <div
                                        key={attribute.name}
                                        className="flex items-start gap-2"
                                    >
                                        <Glyph className="mt-0.5 size-4 shrink-0 text-primary" />
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-[#1a222b] dark:text-[#f8fafc]">
                                                {attribute.name}
                                            </p>
                                            {attribute.values[0] ? (
                                                <p className="text-xs text-[#7b857a] dark:text-[#94a3b8]">
                                                    {displayOf(attribute.values[0])}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}

                </div>
            </div>

            {item.descriptionBlocks && item.descriptionBlocks.length > 0 ? (
                <div className="mx-6 mb-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-card p-6">
                    <h3 className="mb-4 inline-block border-b-2 border-secondary pb-1 text-base font-semibold text-primary">
                        Description
                    </h3>
                    <BlockList blocks={item.descriptionBlocks} specs={specs} />
                </div>
            ) : specs.length > 0 ? (
                <div className="mx-6 mb-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-card p-6">
                    <h3 className="mb-4 inline-block border-b-2 border-secondary pb-1 text-base font-semibold text-primary">
                        Specifications
                    </h3>
                    <SpecGrid specs={specs} />
                </div>
            ) : null}

            {onClose && (
                <div className="sticky bottom-0 flex justify-end border-t border-[#e4eae2] dark:border-[#242937] bg-white dark:bg-[#1a1e29] px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-11 cursor-pointer rounded-full border border-[#e8e8e8] dark:border-[#384252] bg-white dark:bg-[#1e2330] px-6 text-sm font-medium text-[#1a222b] dark:text-[#f8fafc] transition-colors hover:bg-[#f7f8f7] dark:hover:bg-[#252a38]"
                    >
                        Close preview
                    </button>
                </div>
            )}
        </div>
    );
}

function SpecGrid({ specs }: { specs: ItemAttribute[] }) {
    if (!specs.length) {
        return (
            <p className="text-sm text-[#a3aca1] dark:text-[#94a3b8] italic">
                No specification attributes yet — this grid stays empty.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {specs.map((attribute) => {
                const Glyph = attributeIcon(attribute.icon);

                return (
                    <div
                        key={attribute.name}
                        className="rounded-xl border border-[#e8e8e8] dark:border-[#2a3042] bg-[#f7f8f7] dark:bg-[#1e2330] p-3 text-center"
                    >
                        <Glyph className="mx-auto size-4 text-[#657064] dark:text-[#94a3b8]" />
                        <p className="mt-2 text-xs font-semibold text-[#1a222b] dark:text-[#f8fafc]">
                            {attribute.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[#7b857a] dark:text-[#94a3b8]">
                            {attribute.values[0]
                                ? displayOf(attribute.values[0])
                                : "Yes"}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

function Gallery({
    images,
    name,
    index,
    onSelect,
    outOfStock,
}: {
    images: string[];
    name: string;
    index: number;
    onSelect: (index: number) => void;
    outOfStock?: boolean;
}) {
    if (!images.length) {
        return (
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-card text-center shadow-xs">
                <div className="flex flex-col items-center gap-2 text-[#a3aca1] dark:text-[#64748b]">
                    <ImageOff className="size-8" />
                    <p className="text-sm font-medium">No image available</p>
                </div>
            </div>
        );
    }

    const active = images[Math.min(index, images.length - 1)];

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-row sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-w-full shrink-0 scrollbar-none">
                {images.map((image, position) => (
                    <button
                        key={`${image}-${position}`}
                        type="button"
                        aria-label={`Show image ${position + 1}`}
                        aria-pressed={position === index}
                        onClick={() => onSelect(position)}
                        className={cn(
                            "relative size-14 shrink-0 overflow-hidden rounded-xl border-0 transition-all cursor-pointer",
                            position === index
                                ? "shadow-xs scale-[1.02] opacity-100 ring-0"
                                : "opacity-70 hover:opacity-100",
                        )}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={image}
                            alt=""
                            className={cn("size-full object-cover", outOfStock && "filter blur-[1.5px]")}
                        />
                    </button>
                ))}
            </div>
            <div className="relative aspect-square flex-1 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[#f8faf8] dark:bg-card shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={active}
                    alt={name || "Item image"}
                    className={cn("size-full object-cover transition-all duration-300", outOfStock && "filter blur-[1.5px]")}
                />
            </div>
        </div>
    );
}

function OptionRow({
    label,
    value,
    children,
}: {
    label: string;
    value: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <p className="text-xs text-[#657064] dark:text-[#94a3b8]">
                {label}:{" "}
                <span className="font-semibold text-[#1a222b] dark:text-[#f8fafc]">{value}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">{children}</div>
        </div>
    );
}

function Chip({
    active,
    disabled,
    onClick,
    children,
}: {
    active: boolean;
    disabled?: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-pressed={active}
            className={cn(
                "max-w-full cursor-pointer break-words rounded-lg border px-4 py-2 text-center text-sm leading-5 transition-colors",
                disabled
                    ? "cursor-not-allowed border-[#f0f1ef] dark:border-[#2a3042] bg-[#fafbfa] dark:bg-[#151821] text-[#c2c8c0] dark:text-[#64748b] line-through"
                    : active
                        ? "border-primary bg-primary/5 font-medium text-primary"
                        : "border-[#e8e8e8] dark:border-[#2a3042] bg-white dark:bg-[#1e2330] text-[#1a222b] dark:text-[#f8fafc] hover:border-[#cfd6cc] dark:hover:border-[#384252]",
            )}
        >
            {children}
        </button>
    );
}

/** The circle a shopper clicks to pick a colour Option. */
function Swatch({
    name,
    colorHex,
    active,
    disabled,
    onClick,
}: {
    name: string;
    colorHex?: string | null;
    active: boolean;
    disabled?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-pressed={active}
            aria-label={name}
            title={name}
            className={cn(
                "cursor-pointer grid size-9 place-items-center rounded-full border-2 transition-colors",
                active ? "border-primary" : "border-transparent",
                disabled && "cursor-not-allowed opacity-40",
            )}
        >
            <span
                className="size-7 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: colorHex || "#d9d9d9" }}
            />
        </button>
    );
}

export function BlockList({
    blocks,
    specs,
}: {
    blocks: DescriptionBlockResponse[];
    specs: ItemAttribute[];
}) {
    return (
        <div className="flex flex-col gap-4">
            {blocks.map((block, index) => (
                <Block key={index} block={block} specs={specs} />
            ))}
        </div>
    );
}

function Block({
    block,
    specs,
}: {
    block: DescriptionBlockResponse;
    specs: ItemAttribute[];
}) {
    if (block.type === "COLUMNS") {
        return (
            <div className="grid gap-6 md:grid-cols-2">
                {(block.columns || []).map((column, index) => (
                    <BlockList
                        key={index}
                        blocks={column.blocks || []}
                        specs={specs}
                    />
                ))}
            </div>
        );
    }

    if (block.type === "HEADING") {
        return (
            <h4 className="text-base font-semibold text-[#161d16] dark:text-[#f8fafc]">
                {block.text}
            </h4>
        );
    }

    if (block.type === "BULLETS") {
        return (
            <ul className="grid gap-2">
                {(block.items || []).map((line, index) => (
                    <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-[#657064] dark:text-[#cbd5e1]"
                    >
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        {line}
                    </li>
                ))}
            </ul>
        );
    }

    if (block.type === "IMAGE") {
        return block.url ? (
            <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={block.url}
                    alt={block.caption || ""}
                    className="w-full rounded-xl object-cover"
                />
                {block.caption ? (
                    <figcaption className="mt-2 text-xs text-[#7b857a] dark:text-[#94a3b8]">
                        {block.caption}
                    </figcaption>
                ) : null}
            </figure>
        ) : null;
    }

    if (block.type === "SPEC_GRID") {
        return <SpecGrid specs={specs} />;
    }

    return (
        <p className="text-sm leading-6 text-[#657064] dark:text-[#cbd5e1]">{block.text}</p>
    );
}
