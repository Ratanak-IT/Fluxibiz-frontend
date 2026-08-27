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
    provinceName?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    /** Straight-line distance from the shopper's position; null unless they shared it. */
    distanceKm?: number | null;
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
    provinceName?: string | null;
    districtName?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    /** Straight-line distance from the shopper's position; null unless they shared it. */
    distanceKm?: number | null;
    googleMap: string | null;
    website: string | null;
    storefrontUrl: string | null;
    baseCurrency: string;
    displayCurrency: string;
    category: BusinessSubCategory | null;
    socialLinks: Record<string, string>[] | null;
    facebookPageName?: string | null;
    facebookPageUrl?: string | null;
    facebookName?: string | null;
    facebookUrl?: string | null;
    facebook?: string | null;
    facebookPage?: {
        name?: string | null;
        pageName?: string | null;
        url?: string | null;
        link?: string | null;
        id?: string | null;
    } | null;
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
    /**
     * The hours the shop set for its Online Store, as the checkout enforces
     * them. Absent means it keeps none, which means always open.
     *
     * These are not the shopfront's `openTime`/`closeTime`: a shop can take
     * web orders after the doors are locked, or stop before.
     */
    onlineHours?: ChannelSchedule | null;
    /** The server's own answer, computed against those hours. */
    openNow?: boolean | null;
    /** What it is open for today — "open today 08:00–17:00", "closed today". */
    hoursToday?: string | null;
}

/** {@code HH:MM}, 24-hour. */
export interface StoreTimeWindow {
    open: string;
    close: string;
}

export interface ChannelSchedule {
    alwaysOpen: boolean;
    /** Keyed MON…SUN. A day may hold several windows — lunch, then dinner. */
    days?: Record<
        string,
        { closed: boolean; windows?: StoreTimeWindow[] | null }
    > | null;
}

/** MON…SUN, as the schedule keys them. `Date.getDay()` counts from Sunday. */
const SCHEDULE_DAY_KEYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

/**
 * "09:00" as a shopper reads a clock — "9:00 AM".
 *
 * The schedule stores 24-hour times because that is unambiguous to store;
 * nobody says "eighteen hundred" over a counter. Anything unparseable is
 * handed back untouched rather than guessed at.
 */
export function formatStoreTime(value?: string | null): string {
    if (!value) return "";

    const match = value.trim().match(/^(\d{1,2}):(\d{2})/);
    if (!match) return value.trim();

    const hours = Number(match[1]);
    const minutes = match[2];

    if (!Number.isFinite(hours)) return value.trim();

    const suffix = hours >= 12 ? "PM" : "AM";
    const shown = hours % 12 === 0 ? 12 : hours % 12;

    return `${shown}:${minutes} ${suffix}`;
}

/**
 * What the online store keeps today, read off the schedule itself.
 *
 * Built here rather than taken from the server's `hoursToday` because that
 * sentence is English and 24-hour; this is the same information in parts, for
 * a caller to word and translate as it likes. A day can hold several windows
 * — lunch, then dinner — so they come back as a list.
 */
export function todaysStoreHours(
    schedule?: ChannelSchedule | null,
    now: Date = new Date(),
): { alwaysOpen: boolean; closedToday: boolean; windows: string[] } {
    if (!schedule || schedule.alwaysOpen || !schedule.days) {
        return { alwaysOpen: true, closedToday: false, windows: [] };
    }

    const day = schedule.days[SCHEDULE_DAY_KEYS[now.getDay()]];
    const windows = (day?.windows ?? []).filter((window) => window?.open);

    if (!day || day.closed || windows.length === 0) {
        return { alwaysOpen: false, closedToday: true, windows: [] };
    }

    return {
        alwaysOpen: false,
        closedToday: false,
        windows: windows.map(
            (window) =>
                `${formatStoreTime(window.open)} – ${formatStoreTime(window.close)}`,
        ),
    };
}

/** One day of the week, as the online store keeps it. */
export interface StoreDayHours {
    /** MON…SUN, for looking up a translated name. */
    key: string;
    closed: boolean;
    /** "9:00 AM – 6:00 PM", one per window. Empty on a closed day. */
    windows: string[];
    /** Whether this is the day the shopper is reading it on. */
    today: boolean;
}

/** The days in the order a week is read, Monday first. */
const WEEK_ORDER = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

/**
 * The whole week, so a shopper who arrives after closing can see when to come
 * back rather than only that they are too late.
 *
 * Empty when the shop keeps no hours for the web — there is nothing to show
 * about a store that never closes.
 */
export function weeklyStoreHours(
    schedule?: ChannelSchedule | null,
    now: Date = new Date(),
): StoreDayHours[] {
    if (!schedule || schedule.alwaysOpen || !schedule.days) {
        return [];
    }

    const todayKey = SCHEDULE_DAY_KEYS[now.getDay()];

    return WEEK_ORDER.map((key) => {
        const day = schedule.days?.[key];
        const windows = (day?.windows ?? []).filter((window) => window?.open);
        const closed = !day || day.closed || windows.length === 0;

        return {
            key,
            closed,
            windows: closed
                ? []
                : windows.map(
                      (window) =>
                          `${formatStoreTime(window.open)} – ${formatStoreTime(window.close)}`,
                  ),
            today: key === todayKey,
        };
    });
}

/** A run of days that keep the same hours — "Mon – Fri", or one day alone. */
export interface StoreHoursRun {
    from: string;
    /** Same as {@link from} on a run of one. */
    to: string;
    closed: boolean;
    windows: string[];
    /** Whether today falls inside this run. */
    today: boolean;
}

/**
 * The week folded into runs, because that is how hours are actually read.
 *
 * Seven rows saying the same thing five times over is a table to be scanned;
 * "Mon – Fri 9:00 AM – 6:00 PM, Sat – Sun closed" is a sentence to be read.
 * Consecutive days with identical hours join, and a shop with genuinely
 * different hours every day still gets its seven rows — it earns them.
 */
export function groupedWeeklyStoreHours(
    schedule?: ChannelSchedule | null,
    now: Date = new Date(),
): StoreHoursRun[] {
    const week = weeklyStoreHours(schedule, now);
    const runs: StoreHoursRun[] = [];

    for (const day of week) {
        const held = runs[runs.length - 1];
        const sameHours =
            held &&
            held.closed === day.closed &&
            held.windows.join("|") === day.windows.join("|");

        if (sameHours) {
            held.to = day.key;
            held.today = held.today || day.today;
            continue;
        }

        runs.push({
            from: day.key,
            to: day.key,
            closed: day.closed,
            windows: day.windows,
            today: day.today,
        });
    }

    return runs;
}

/**
 * Whether the online store is taking orders right now.
 *
 * The server's `openNow` is the authority — it is the same schedule the
 * checkout enforces, read on the same clock — so a storefront that decided
 * for itself could offer an Add to Cart the basket then refuses. The local
 * reading below is only for a payload sent before the field existed.
 */
export function isStorefrontOpen(
    store?: {
        isClosed?: boolean | null;
        openNow?: boolean | null;
        openTime?: string | null;
        closeTime?: string | null;
        isOpen?: boolean | null;
    } | null,
): boolean {
    if (!store) return true;
    if (store.isClosed === true) return false;
    if (store.openNow !== undefined && store.openNow !== null) {
        return store.openNow;
    }

    return isStoreCurrentlyOpen(store);
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
    /** A province name as returned by /public/stores/provinces — geocoded text, not an id. */
    province?: string;
    district?: string;
    /** Shopper's own position — when both are present, results sort nearest-first. */
    lat?: number;
    lng?: number;
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
    distanceKm?: number | null;
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
        distanceKm: store.distanceKm ?? null,
    };
}

/** "850 m away" under a kilometer, "4.2 km away" past it — never claiming false precision. */
export function formatDistance(distanceKm?: number | null): string | null {
    if (distanceKm === null || distanceKm === undefined || !Number.isFinite(distanceKm)) {
        return null;
    }
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
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

/**
 * The one picture that stands for the item — on a card, in the cart, on a
 * shared link.
 *
 * The item's own gallery leads, in the order the seller arranged it. Where
 * there is none, the pictures hanging off its choices answer instead: a
 * colour's photograph first, since that is the choice a photograph can
 * actually show, then an option's own. A seller who uploaded nothing at item
 * level and a shot for every colour did not mean "no picture" — the product
 * page already shows those, and the card that sent a shopper there should not
 * be the one blank thing about the item.
 */
export function primaryItemImage(
    item?: {
        images?: ItemImage[] | null;
        colors?: { imageUrl?: string | null }[] | null;
        variants?: { imageUrl?: string | null }[] | null;
    } | null,
): string | null {
    const sorted = [...(item?.images ?? [])].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0),
    );

    for (const image of sorted) {
        const url = itemImageUrl(image);
        if (url) return url;
    }

    for (const option of [...(item?.colors ?? []), ...(item?.variants ?? [])]) {
        const url = resolveMediaUrl(option.imageUrl);
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
    /** The extras this item offers — pearls, an extra shot. */
    addOns?: ItemAddOn[] | null;
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

/**
 * An extra piled on top of an item — pearls, an extra shot.
 *
 * It belongs to the shop's library rather than to one item, so the same
 * "Extra shot" costs the same on every drink that offers it. `available` is
 * per item: a shop out of pearls takes them off one drink without unlinking
 * them from it.
 */
export interface ItemAddOn {
    id: string;
    name: string;
    slug?: string | null;
    /** Null until it has been priced, and it cannot be sold until it has. */
    price?: number | null;
    available?: boolean | null;
    note?: string | null;
}

/** Whether this item still sells that extra today, and at a price it can. */
export function isAddOnSellable(addOn?: ItemAddOn | null): boolean {
    if (!addOn) return false;
    if (addOn.available === false) return false;
    return addOn.price !== undefined && addOn.price !== null;
}

/** The extras an item can actually be bought with, in the order it offers them. */
export function sellableAddOns(
    item?: { addOns?: ItemAddOn[] | null } | null,
): ItemAddOn[] {
    return (item?.addOns ?? []).filter(isAddOnSellable);
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

/** What the item costs, from the cheapest option to the dearest. */
export interface ItemPriceRange {
    min: number;
    max: number;
}

/**
 * What an item sold in options actually costs.
 *
 * An item sold as Small, Medium and Large is never sold as itself, so its own
 * `price` stays empty and the card read "Price not set" while three priced
 * sizes sat behind it. The prices a shopper can really pay are the options',
 * and the honest headline is the span of them.
 *
 * Only options that can be picked count — quoting a price off a sold-out size
 * is quoting a price nobody can pay. If none can be picked the whole spread is
 * used anyway, so a sold-out item still says what it went for.
 */
export function itemPriceRange(
    item?: { variants?: ItemVariant[] | null } | null,
): ItemPriceRange | null {
    const variants = item?.variants ?? [];
    const priced = variants.filter((variant) =>
        Number.isFinite(Number(variant?.price)),
    );
    const onOffer = priced.filter(isVariantSelectable);
    const prices = (onOffer.length ? onOffer : priced).map((variant) =>
        Number(variant.price),
    );

    if (!prices.length) return null;

    return { min: Math.min(...prices), max: Math.max(...prices) };
}

/**
 * The number to sort and filter an item by: its own price, or the least it can
 * be bought for. `null` on an item that carries no price at all — which sorts
 * differently from one that is free.
 */
export function sellingPriceFrom(
    item?: { price?: number | null; variants?: ItemVariant[] | null } | null,
): number | null {
    if (item?.price !== undefined && item?.price !== null) {
        return Number(item.price);
    }

    return itemPriceRange(item)?.min ?? null;
}




export interface ItemResponse {
    id: string;
    name: string;
    description?: string;
    unitPrice?: number | string;
    itemGroup?: { id: string; name: string };
    images?: ItemImage[];
    status?: string;
}

/**
 * Resolves the effective selling price and compare-at price for any product/variant/line item.
 *
 * Guarantees:
 * - `sellingPrice`: Always the lower discount price (e.g. 1.5) when a discount exists.
 * - `compareAtPrice`: Always the higher original price (e.g. 2.0) when a discount exists, or undefined if no discount.
 */
export function resolveItemPrices(
    item?: {
        price?: number | string | null;
        compareAtPrice?: number | string | null;
        variants?: { price?: number | string | null; compareAtPrice?: number | string | null }[] | null;
    } | null,
    selectedVariant?: { price?: number | string | null; compareAtPrice?: number | string | null } | null
): {
    sellingPrice: number;
    compareAtPrice?: number;
    hasDiscount: boolean;
    discountPercent?: number;
} {
    if (!item) {
        return { sellingPrice: 0, hasDiscount: false };
    }

    const rawVariantPrice = selectedVariant?.price !== undefined && selectedVariant?.price !== null && Number(selectedVariant.price) > 0
        ? Number(selectedVariant.price)
        : null;

    const rawItemPrice = item.price !== undefined && item.price !== null
        ? Number(item.price)
        : 0;

    const basePrice = rawVariantPrice ?? rawItemPrice;

    const rawVariantCompare = selectedVariant?.compareAtPrice !== undefined && selectedVariant?.compareAtPrice !== null && Number(selectedVariant.compareAtPrice) > 0
        ? Number(selectedVariant.compareAtPrice)
        : null;

    const rawItemCompare = item.compareAtPrice !== undefined && item.compareAtPrice !== null && Number(item.compareAtPrice) > 0
        ? Number(item.compareAtPrice)
        : null;

    const rawCompare = rawVariantCompare ?? rawItemCompare;

    if (rawCompare !== null && rawCompare > 0 && rawCompare !== basePrice) {
        const sellingPrice = Math.min(basePrice, rawCompare);
        const compareAtPrice = Math.max(basePrice, rawCompare);
        const discountPercent = Math.round(((compareAtPrice - sellingPrice) / compareAtPrice) * 100);
        return {
            sellingPrice,
            compareAtPrice,
            hasDiscount: compareAtPrice > sellingPrice,
            discountPercent,
        };
    }

    return {
        sellingPrice: basePrice,
        hasDiscount: false,
    };
}
