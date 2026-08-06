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
    itemType: string;
    attributes: Record<string, any> | null;
    variants: ItemVariant[];
    lowStockDefault: number | null;
    status: string;
}