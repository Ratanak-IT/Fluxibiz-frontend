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
    itemDetails?: {
        name: string;
        price: number;
        imageUrl?: string | null;
        storeName?: string;
    };
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

    const base = (process.env.NEXT_PUBLIC_MINIO_URL || "https://s3.careerpatch.site").replace(/\/$/, "");

    if (value.includes("storage.careerpatch.site")) {
        value = value.replace("storage.careerpatch.site", "s3.careerpatch.site");
    }

    if (value.startsWith("http://minio:9000") || value.startsWith("https://minio:9000")) {
        value = value.replace(/^https?:\/\/minio:9000/, base);
    } else if (value.startsWith("http://localhost:9000") || value.startsWith("https://localhost:9000")) {
        value = value.replace(/^https?:\/\/localhost:9000/, base);
    }

    if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("/")
    ) {
        return value;
    }

    const bucket = process.env.NEXT_PUBLIC_MINIO_BUCKET || "fluxibix";

    if (value.startsWith(`${bucket}/`)) {
        return `${base}/${value}`;
    }

    return `${base}/${bucket}/${value}`;
}


export function apiErrorMessage(
    error: unknown,
    fallback = "Something went wrong. Please try again.",
): string {
    if (!error || typeof error !== "object") return fallback;

    const err = error as { status?: number | string; data?: unknown; error?: string };

    if (err.status === 401 || err.status === 403) {
        return "Please sign in to add items to your cart.";
    }

    if (err.data && typeof err.data === "object") {
        const data = err.data as { message?: string; detail?: string };
        if (typeof data.message === "string" && data.message.trim()) return data.message;
        if (typeof data.detail === "string" && data.detail.trim()) return data.detail;
    }

    if (typeof err.data === "string" && err.data.trim()) return err.data;

    return fallback;
}

export function isUnauthorized(error: unknown): boolean {
    if (!error || typeof error !== "object") return false;
    const status = (error as { status?: number | string }).status;
    return status === 401 || status === 403;
}