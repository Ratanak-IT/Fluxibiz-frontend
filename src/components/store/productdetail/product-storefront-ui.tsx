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
import { StorefrontItemResponse, primaryItemImage, itemImageUrl, ItemAttributeValue, ItemAttribute, DescriptionBlockResponse } from "@/lib/type/storeType";

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
    selectedVariant: any;
    setSelectedVariant: any;
    selectedAttributes: Record<string, string>;
    setSelectedAttributes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    hideAddToCart?: boolean;
}) {
    const t = useTranslations("Store");
    const attributes = item.attributes || [];
    const variants = item.variants || [];

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

    const activePrice = selectedVariant?.price !== undefined ? Number(selectedVariant.price) : Number(item.price || 0);
    const compareAt = item.compareAtPrice ? Number(item.compareAtPrice) : 0;
    const discount =
        compareAt && compareAt > activePrice
            ? Math.round(((compareAt - activePrice) / compareAt) * 100)
            : 0;

    // Resolve images
    const images = useMemo(() => {
        if (item.images && item.images.length > 0) {
            const list: string[] = [];
            const sorted = [...item.images].sort(
                (a, b) => (a.position ?? 0) - (b.position ?? 0)
            );
            sorted.forEach((img) => {
                const url = itemImageUrl(img);
                if (url) list.push(url);
            });
            if (list.length > 0) return list;
        }
        const prim = primaryItemImage(item);
        if (prim) return [prim];
        return [];
    }, [item]);

    // find variant index based on selectedVariant
    const variantIndex = variants.findIndex(v => v.id === selectedVariant?.id);

    return (
        <div className="max-h-[90vh] overflow-y-auto">
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

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-2xl font-bold text-danger">
                            {formatPrice(activePrice, currency)}
                        </span>
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
                        {item.unit?.name ? (
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

                    {variants.length > 0 ? (
                        <OptionRow
                            label="Option"
                            value={selectedVariant?.name || selectedVariant?.title || "—"}
                        >
                            {variants.map((option, index) => (
                                <Chip
                                    key={`${option.name}-${index}`}
                                    active={index === variantIndex}
                                    onClick={() => setSelectedVariant(option)}
                                >
                                    <span>{option.name || option.title}</span>
                                    {option.price === undefined ? null : (
                                        <span className="mt-0.5 block text-xs text-[#7b857a] dark:text-[#94a3b8]">
                                            {formatPrice(Number(option.price), currency)}
                                        </span>
                                    )}
                                </Chip>
                            ))}
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
                                {attribute.values.map((value) =>
                                    attribute.type === "COLOR" ? (
                                        <Swatch
                                            key={value.value}
                                            value={value}
                                            active={selectedAttributes[attribute.name] === value.value}
                                            onClick={() =>
                                                setSelectedAttributes((current) => ({
                                                    ...current,
                                                    [attribute.name]: value.value,
                                                }))
                                            }
                                        />
                                    ) : (
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
                                    ),
                                )}
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
                                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                                    className="text-danger cursor-pointer"
                                >
                                    <Minus className="size-4" />
                                </button>
                                <span className="min-w-6 text-center text-sm font-medium">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    aria-label="Increase quantity"
                                    onClick={() => setQuantity((current) => current + 1)}
                                    className="text-primary cursor-pointer"
                                >
                                    <Plus className="size-4" />
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={onAddToCart}
                                disabled={isAddingToCart}
                                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <ShoppingBag className="size-4" />
                                {isAddingToCart ? t("detail.adding") || "Adding..." : t("detail.add") || "Add to Cart"}
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

                    {item.sku ? (
                        <p className="text-xs text-[#7b857a] dark:text-[#94a3b8]">
                            SKU {item.sku}
                        </p>
                    ) : null}
                </div>
            </div>

            {item.descriptionBlocks && item.descriptionBlocks.length > 0 ? (
                <div className="mx-6 mb-6 rounded-2xl border border-[#e4eae2] dark:border-[#242937] bg-white dark:bg-[#1a1e29] p-6">
                    <h3 className="mb-4 inline-block border-b-2 border-secondary pb-1 text-base font-semibold text-primary">
                        Description
                    </h3>
                    <BlockList blocks={item.descriptionBlocks} specs={specs} />
                </div>
            ) : specs.length > 0 ? (
                <div className="mx-6 mb-6 rounded-2xl border border-[#e4eae2] dark:border-[#242937] bg-white dark:bg-[#1a1e29] p-6">
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
}: {
    images: string[];
    name: string;
    index: number;
    onSelect: (index: number) => void;
}) {
    if (!images.length) {
        return (
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-[#e4eae2] dark:border-[#242937] bg-white dark:bg-[#1a1e29] text-center shadow-xs">
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
            <div className="flex flex-row sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-w-full shrink-0">
                {images.map((image, position) => (
                    <button
                        key={`${image}-${position}`}
                        type="button"
                        aria-label={`Show image ${position + 1}`}
                        aria-pressed={position === index}
                        onClick={() => onSelect(position)}
                        className={cn(
                            "relative size-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer",
                            position === index
                                ? "border-primary ring-2 ring-primary/20 shadow-xs scale-[1.02]"
                                : "border-transparent dark:border-[#242937] hover:border-primary/40 opacity-70 hover:opacity-100",
                        )}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={image}
                            alt=""
                            className="size-full object-cover"
                        />
                    </button>
                ))}
            </div>
            <div className="relative aspect-square flex-1 overflow-hidden rounded-2xl border border-[#e4eae2] dark:border-[#242937] bg-[#f8faf8] dark:bg-[#151821] shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={active}
                    alt={name || "Item image"}
                    className="size-full object-cover transition-all duration-300"
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
                "cursor-pointer rounded-lg border px-4 py-2 text-center text-sm transition-colors",
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

function Swatch({
    value,
    active,
    onClick,
}: {
    value: ItemAttributeValue;
    active: boolean;
    onClick: () => void;
}) {
    const disabled = value.available === false;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-pressed={active}
            aria-label={value.label || value.value}
            title={value.label || value.value}
            className={cn(
                "cursor-pointer grid size-9 place-items-center rounded-full border-2 transition-colors",
                active ? "border-primary" : "border-transparent",
                disabled && "cursor-not-allowed opacity-40",
            )}
        >
            <span
                className="size-7 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: value.colorHex || "#d9d9d9" }}
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
