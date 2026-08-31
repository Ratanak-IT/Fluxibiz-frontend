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
    
    onlineHours?: ChannelSchedule | null;
    openNow?: boolean | null;
    hoursToday?: string | null;
    taxEnabled?: boolean | null;
    taxRate?: number | null;
    taxInclusionType?: "EXCLUSIVE" | "INCLUSIVE" | null;
    taxLabel?: string | null;
}

/** {@code HH:MM}, 24-hour. */
export interface StoreTimeWindow {
    open: string;
    close: string;
}

export interface ChannelSchedule {
    alwaysOpen: boolean;
    days?: Record<
        string,
        { closed: boolean; windows?: StoreTimeWindow[] | null }
    > | null;
}

const SCHEDULE_DAY_KEYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];


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

const WEEK_ORDER = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];


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

export interface StoreHoursRun {
    from: string;
    /** Same as {@link from} on a run of one. */
    to: string;
    closed: boolean;
    windows: string[];
    today: boolean;
}


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
    compareAtPrice?: number | null;
    /**
     * The option's own picture. It leads the gallery while the option is
     * picked, so choosing a size changes what is on show — and on an item
     * whose only pictures live on its options, it is the only picture there is.
     */
    imageUrl?: string | null;

    optionName?: string | null;
    colorValue?: string | null;
    available?: boolean | null;
 
    availableQuantity?: number | null;
}


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
    colors?: ItemColor[] | null;
    descriptionBlocks?: DescriptionBlockResponse[] | null;
    variants: ItemVariant[];
    addOns?: ItemAddOn[] | null;
    uomConversions?: ItemUomConversion[] | null;
    lowStockDefault: number | null;
    status: string;
 
    availableQuantity?: number | null;
}


export interface ItemAddOn {
    id: string;
    name: string;
    slug?: string | null;
    /** Null until it has been priced, and it cannot be sold until it has. */
    price?: number | null;
    available?: boolean | null;
    note?: string | null;
}

export function isAddOnSellable(addOn?: ItemAddOn | null): boolean {
    if (!addOn) return false;
    if (addOn.available === false) return false;
    return addOn.price !== undefined && addOn.price !== null;
}

export function sellableAddOns(
    item?: { addOns?: ItemAddOn[] | null } | null,
): ItemAddOn[] {
    return (item?.addOns ?? []).filter(isAddOnSellable);
}

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


export function isVariantSelectable(variant?: ItemVariant | null): boolean {
    if (!variant) return false;
    if (variant.available === false) return false;
    return !isSoldOut(variant);
}

export interface ItemPriceRange {
    min: number;
    max: number;
}


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
