

export interface CartLine {
    cartItemId: string;
    itemId: string;
    variantId: string | null;
    name: string;
    description: string | null;
    imageUrl: string | null;
    badges: string[];
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface StoreCart {
    cartId: string;
    businessId: string;
    slug: string;
    name: string;
    category: string | null;
    logo: string | null;
    hours: string | null;
    location: string | null;
    currency: string;
    open: boolean;
    itemCount: number;
    subtotal: number;
    items: CartLine[];
}

export interface CartSummary {
    storeCount: number;
    totalItems: number;
    stores: StoreCart[];
}

export interface CartCount {
    totalItems: number;
    storeCount: number;
}

export interface AddToCartPayload {
    businessId: string;
    itemId: string;
    variantId?: string;
    quantity: number;
}

export function formatMoney(amount: number, currency = "USD"): string {
    if (currency === "KHR") {
        return `៛${Math.round(amount).toLocaleString("en-US")}`;
    }
    return `$${amount.toFixed(2)}`;
}

export function resolveMediaUrl(keyOrUrl: string | null | undefined): string | null {
    if (!keyOrUrl || !keyOrUrl.trim()) return null;

    let value = keyOrUrl.trim();

    // If legacy domain was saved in database, replace with s3.careerpatch.site
    if (value.includes("storage.careerpatch.site")) {
        value = value.replace("storage.careerpatch.site", "s3.careerpatch.site");
    }

    if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("/")
    ) {
        return value;
    }

    const base = (process.env.NEXT_PUBLIC_MINIO_URL || "https://s3.careerpatch.site").replace(/\/$/, "");
    const bucket = process.env.NEXT_PUBLIC_MINIO_BUCKET || "fluxibix";

    // Avoid duplicating bucket if value already starts with bucket name
    if (value.startsWith(`${bucket}/`)) {
        return `${base}/${value}`;
    }

    return `${base}/${bucket}/${value}`;
}