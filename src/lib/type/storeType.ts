import { resolveMediaUrl } from "@/lib/type/cartType";

export interface BusinessSubCategory {
    id: string;
    name: string;
    slug: string;
}

export interface BusinessCategory {
    id: string;
    name: string;
    slug: string;
    subCategories: BusinessSubCategory[] | null;
}


export function leafCategories(
    category: BusinessCategory,
): BusinessSubCategory[] {
    const subs = category.subCategories ?? [];
    if (subs.length > 0) return subs;
    return [{ id: category.id, name: category.name, slug: category.slug }];
}


export interface PublicStore {
    id: string;
    slug: string;
    name: string;
    logo: string | null;
    thumbnail: string | null;
    about: string | null;
    cityOrProvince: string | null;
    address: string | null;
    googleMap: string | null;
    storefrontUrl: string | null;
    category: BusinessSubCategory | null;
    openTime?: string | null;
    closeTime?: string | null;
    operatingHours?: string | null;
    hours?: string | null;
    isOpen?: boolean | null;
    open?: boolean | null;
    discountLabel?: string | null;
    promotionLabel?: string | null;
    promotion?: string | null;
}

export interface PublicStoreDetailResponse {
    id: string;
    slug: string;
    name: string;
    displayName?: string;
    logo: string | null;
    thumbnail: string | null;
    about: string | null;
    phoneNumber: string | null;
    address: string | null;
    cityOrProvince: string | null;
    googleMap: string | null;
    website: string | null;
    storefrontUrl: string | null;
    baseCurrency: string;
    displayCurrency: string;
    category: BusinessSubCategory | null;
    socialLinks: Record<string, string>[] | null;
    isClosed?: boolean | null;
    openTime?: string | null;
    closeTime?: string | null;
    operatingHours?: string | null;
    hours?: string | null;
    isOpen?: boolean | null;
    open?: boolean | null;
    discountLabel?: string | null;
    promotionLabel?: string | null;
    promotion?: string | null;
}

export function isStoreCurrentlyOpen(
    store?: {
        isClosed?: boolean | null;
        openTime?: string | null;
        closeTime?: string | null;
        isOpen?: boolean | null;
    } | null,
): boolean {
    if (!store) return true;
    if (store.isClosed === true) return false;
    if (store.isOpen === false) return false;

    const openStr = store.openTime;
    const closeStr = store.closeTime;

    if (!openStr || !closeStr) return true;

    try {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const parseTimeToMinutes = (tStr: string): number | null => {
            let s = tStr.trim().toUpperCase();
            const isPM = s.includes("PM");
            const isAM = s.includes("AM");
            s = s.replace(/AM|PM/g, "").trim();

            const parts = s.split(":");
            if (parts.length < 2) return null;

            let hours = parseInt(parts[0], 10);
            const minutes = parseInt(parts[1], 10);

            if (isNaN(hours) || isNaN(minutes)) return null;

            if (isPM && hours < 12) hours += 12;
            if (isAM && hours === 12) hours = 0;

            return hours * 60 + minutes;
        };

        const openMin = parseTimeToMinutes(openStr);
        const closeMin = parseTimeToMinutes(closeStr);

        if (openMin === null || closeMin === null) return true;

        if (openMin <= closeMin) {
            return currentMinutes >= openMin && currentMinutes <= closeMin;
        } else {
            return currentMinutes >= openMin || currentMinutes <= closeMin;
        }
    } catch {
        return true;
    }
}

export interface PageMetadata {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}

export interface PublicStorePage {
    content: PublicStore[];
    page: PageMetadata;
}

export interface PublicStoreQuery {
    categoryIds?: string[];
    cityOrProvince?: string;
    keyword?: string;
    page?: number;
    size?: number;
}


export interface Store {
    id: string;
    slug: string;
    name: string;
    category: string;
    description: string;
    location: string;
    address?: string | null;
    googleMap?: string | null;
    image: string;
    hours?: string;
    openTime?: string | null;
    closeTime?: string | null;
    isOpen?: boolean;
    discountLabel?: string;
}

export function isStoreOpenNow(
    hoursStr?: string | null,
    openTime?: string | null,
    closeTime?: string | null,
): boolean {
    if (!hoursStr && openTime && closeTime) {
        hoursStr = `${openTime} - ${closeTime}`;
    }
    if (!hoursStr || !hoursStr.trim()) return true;

    try {
        const parts = hoursStr.split("-").map((s) => s.trim());
        if (parts.length !== 2) return true;

        const parseTime = (timeStr: string) => {
            const match = timeStr.match(/^(\d{1,2}):(\d{2})/);
            if (!match) return null;
            return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
        };

        const openMinutes = parseTime(parts[0]);
        const closeMinutes = parseTime(parts[1]);

        if (openMinutes === null || closeMinutes === null) return true;

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        if (closeMinutes > openMinutes) {
            return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
        } else {
            return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
        }
    } catch {
        return true;
    }
}

export function toStoreCard(store: PublicStore): Store {
    const resolvedImage =
        resolveMediaUrl(store.logo) ?? resolveMediaUrl(store.thumbnail);

    const openTime = store.openTime ?? null;
    const closeTime = store.closeTime ?? null;
    let operatingHours = store.operatingHours ?? store.hours ?? null;

    if (!operatingHours && openTime && closeTime) {
        operatingHours = `${openTime} - ${closeTime}`;
    }

    const explicitOpen = store.isOpen ?? store.open;
    const computedOpen =
        explicitOpen !== undefined && explicitOpen !== null
            ? Boolean(explicitOpen)
            : isStoreOpenNow(operatingHours, openTime, closeTime);

    const discountLabel =
        store.discountLabel ?? store.promotionLabel ?? store.promotion ?? undefined;

    return {
        id: store.id,
        slug: store.slug,
        name: store.name,
        category: store.category?.name ?? "",
        description: store.about ?? "",
        location: store.cityOrProvince ?? "",
        address: store.address ?? store.cityOrProvince ?? "",
        googleMap: store.googleMap,
        image: resolvedImage ?? "",
        hours: operatingHours ?? undefined,
        openTime: openTime ?? undefined,
        closeTime: closeTime ?? undefined,
        isOpen: computedOpen,
        discountLabel,
    };
}

export interface ItemImage {
    id: string;

    url?: string | null;
    imageUrl?: string | null;
    position: number;
}

export function itemImageUrl(image?: ItemImage | null): string | null {
    if (!image) return null;
    return resolveMediaUrl(image.url ?? image.imageUrl);
}

export function primaryItemImage(
    item?: { images?: ItemImage[] | null } | null,
): string | null {
    const images = item?.images ?? [];
    if (images.length === 0) return null;

    const sorted = [...images].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0),
    );

    for (const image of sorted) {
        const url = itemImageUrl(image);
        if (url) return url;
    }

    return null;
}

export interface ItemVariant {
    id: string;
    slug?: string;
    variantName?: string;
    name?: string;
    variant_name?: string;
    title?: string;
    price: number;
    /**
     * The option's own picture. It leads the gallery while the option is
     * picked, so choosing a size changes what is on show — and on an item
     * whose only pictures live on its options, it is the only picture there is.
     */
    imageUrl?: string | null;
    /**
     * The swatch this option shows — the circle a shopper clicks. Empty on an
     * option that is not a colour; a size has nothing to show.
     */
    /** The size half of the pair — "Large". */
    optionName?: string | null;
    /** Which of the item's colours this row is; null when sold by size alone. */
    colorValue?: string | null;
    /** Seller's own on/off switch for the option, independent of stock. */
    available?: boolean | null;
    /**
     * How many the online store may still sell, already capped to whatever the
     * seller allocated this channel. `null` means the shop keeps no stock
     * record for it — unlimited as far as the storefront is concerned — while
     * `0` means sold out. Never conflate the two.
     */
    availableQuantity?: number | null;
}

/**
 * One colour the item comes in, declared once for the whole item.
 *
 * The photograph hangs off the colour rather than off every size that comes in
 * it: one picture of the red shirt serves Small, Medium and Large.
 */
export interface ItemColor {
    value: string;
    colorHex?: string | null;
    imageUrl?: string | null;
}

export interface ItemAttributeValue {
    value: string;
    label?: string;
    /** Retired: colour moved to Options, which carry stock and a price. */
    colorHex?: string;
    available?: boolean;
}

export interface ItemAttribute {
    name: string;
    type?: string;
    placement?: string;
    icon?: string;
    values: ItemAttributeValue[];
}

export interface DescriptionBlockResponse {
    type: string;
    text?: string | null;
    items?: string[] | null;
    url?: string | null;
    caption?: string | null;
    columns?: { blocks: DescriptionBlockResponse[] }[] | null;
}

/**
 * A bigger unit the item is sold in — a six-pack, a case.
 *
 * Priced in its own right rather than as a multiple: a case is not twenty-four
 * times a can, or nobody would buy the case. `factor` only says how many base
 * units come off the shelf.
 */
export interface ItemUomConversion {
    id: string;
    unit: { id: string; name: string; symbol?: string | null } | null;
    /** The option it is for — a case of Large is not a case of Small. */
    variantId: string | null;
    variantName: string | null;
    factor: number;
    /** Null when the seller has not priced it as a pack yet, so it cannot be bought. */
    price: number | null;
}

export interface StorefrontItemResponse {
    id: string;
    businessId: string;
    businessName?: string | null;
    itemGroup: { id: string; name: string; slug: string } | null;
    unit: { id: string; name: string; symbol: string } | null;
    slug: string;
    name: string;
    sku: string | null;
    code: string | null;
    description: string | null;
    images: ItemImage[];
    barcode: string | null;
    price: number;
    compareAtPrice?: number | null;
    badge?: string | null;
    itemType: string;
    attributes: ItemAttribute[] | null;
    /** The colours this item comes in, shared by every size that offers them. */
    colors?: ItemColor[] | null;
    descriptionBlocks?: DescriptionBlockResponse[] | null;
    variants: ItemVariant[];
    /** The packs this item can be bought by. Empty when it only sells as itself. */
    uomConversions?: ItemUomConversion[] | null;
    lowStockDefault: number | null;
    status: string;
    /**
     * How many the online store may still sell, summed over the item's options.
     * `null` means untracked, `0` means sold out — see {@link ItemVariant}.
     *
     * This is the only stock signal the public API sends. Fields like
     * `quantity`, `stock` or `isOutOfStock` were never part of the response and
     * are gone; reading them made every item look permanently in stock.
     */
    availableQuantity?: number | null;
}

/** `null` when untracked, so an untracked item is never mistaken for a sold-out one. */
export function remainingStock(
    source?: { availableQuantity?: number | null } | null,
): number | null {
    const remaining = source?.availableQuantity;
    if (remaining === undefined || remaining === null) return null;
    return Number(remaining);
}

export function isSoldOut(
    source?: { availableQuantity?: number | null } | null,
): boolean {
    const remaining = remainingStock(source);
    return remaining !== null && remaining <= 0;
}

/**
 * Whether an option can be picked at all: the seller's own switch first, then
 * whatever the web has left.
 */
export function isVariantSelectable(variant?: ItemVariant | null): boolean {
    if (!variant) return false;
    if (variant.available === false) return false;
    return !isSoldOut(variant);
}
