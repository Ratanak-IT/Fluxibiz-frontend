/** One option chosen on a line — "Sugar Level" = "50", shown as "50%". */
export interface CartSelection {
    attributeName: string;
    value: string;
    label: string;
}

/** One extra riding on a line, at the price it was ticked at. */
export interface CartLineAddOn {
    addOnId: string | null;
    name: string;
    unitPrice: number;
}

export interface CartLine {
    cartItemId: string;
    itemId: string;
    variantId: string | null;
    name: string;
    description: string | null;
    imageUrl: string | null;
    /** Display chips: the variant name, then each chosen option. */
    badges: string[];
    /** The same choices, structured, for anything that needs them apart. */
    selections?: CartSelection[];
    /** The extras ticked on this line. Already in the badges as "+ Name". */
    addOns?: CartLineAddOn[];
    quantity: number;
    /** The thing itself, without its extras. */
    unitPrice: number;
    /**
     * What one of this line is billed at — the price above plus every extra
     * on it. This is what `subtotal` is a multiple of, so a per-unit price
     * shown to a shopper should be this one.
     */
    unitPriceWithAddOns?: number;
    subtotal: number;
    isOutOfStock?: boolean | null;
    outOfStock?: boolean | null;
    inStock?: boolean | null;
    available?: boolean | null;
    status?: string | null;
    stock?: number | null;
}

/**
 * What one of a line is actually billed at.
 *
 * The extras ticked on it are part of what the checkout will charge, so every
 * total on screen has to be a multiple of this rather than of the bare item
 * price. Falls back for a line sent before the field existed.
 */
export function billedUnitPrice(
    line: { unitPrice: number; unitPriceWithAddOns?: number | null },
): number {
    return line.unitPriceWithAddOns ?? line.unitPrice;
}

import { isItemOutOfStock } from "@/lib/store/detailstore/detailstore";

export function isCartLineOutOfStock(line?: CartLine | any | null): boolean {
    if (!line) return false;
    const itemId = line.itemId || line.cartItemId;
    if (itemId && isItemOutOfStock({ id: itemId })) return true;
    if (typeof line.isOutOfStock === "boolean") return line.isOutOfStock;
    if (typeof line.outOfStock === "boolean") return line.outOfStock;
    if (typeof line.inStock === "boolean") return !line.inStock;
    if (typeof line.available === "boolean") return !line.available;
    if (line.stock !== undefined && line.stock !== null) {
        if (Number(line.stock) <= 0) return true;
    }
    if (line.status && typeof line.status === "string") {
        const s = line.status.trim().toUpperCase();
        if (
            s === "OUT_OF_STOCK" ||
            s === "OUT_STOCK" ||
            s === "UNAVAILABLE" ||
            s === "SOLDOUT" ||
            s === "SOLD_OUT" ||
            s === "INACTIVE"
        ) {
            return true;
        }
    }
    if (Array.isArray(line.badges)) {
        for (const badge of line.badges) {
            if (typeof badge === "string") {
                const b = badge.trim().toUpperCase();
                if (
                    b.includes("OUT OF STOCK") ||
                    b.includes("SOLD OUT") ||
                    b.includes("OUT_OF_STOCK") ||
                    b.includes("SOLDOUT") ||
                    b.includes("SOLD_OUT") ||
                    b.includes("NO STOCK") ||
                    b.includes("NO_STOCK") ||
                    b.includes("អស់ស្តុក") ||
                    b.includes("អស់ពីស្តុក")
                ) {
                    return true;
                }
            }
        }
    }
    return false;
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
    /**
     * The unit being bought — a six-pack, a case. Absent means one of the
     * item's base unit. A pack is priced in its own right, so the server
     * prices the line from this rather than multiplying.
     */
    unitId?: string;
    /**
     * Options picked on the product page. Sent by attribute name and stored
     * value — the value is the identity, the label is only how it was shown.
     */
    selections?: { attributeName: string; value: string }[];
    /**
     * The extras ticked on the product page. The server prices them from the
     * library and refuses any the item does not offer, so only ids travel.
     */
    addOnIds?: string[];
    quantity: number;
    itemDetails?: {
        name: string;
        /** All-in, extras included: it stands in for the billed price. */
        price: number;
        imageUrl?: string | null;
        storeName?: string;
        currency?: string;
        /** The extras ticked, named, so the placeholder line reads right. */
        addOns?: CartLineAddOn[];
    };
}

export function formatMoney(amount: number, currency = "USD", exchangeRate = 4000): string {
    const code = (currency || "").toUpperCase().trim();
    if (
        code === "KHR" ||
        code === "KH" ||
        code === "RIEL" ||
        code === "REIL" ||
        code === "៛" ||
        code.includes("KHR") ||
        code.includes("RIEL") ||
        code.includes("REIL") ||
        code.includes("KHMER") ||
        code.includes("៛")
    ) {
        const finalAmount = amount < 100 ? amount * exchangeRate : amount;
        return `${Math.round(finalAmount).toLocaleString("en-US")} ៛`;
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
        value.startsWith("data:") ||
        value.startsWith("blob:") ||
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

export function formatStockErrorMessage(error: unknown, itemName?: string): string {
    const raw = apiErrorMessage(error, "");
    const nameStr = itemName ? `"${itemName}"` : "Item";

    if (!raw) {
        return `${nameStr} does not have enough stock left`;
    }

    if (/^item\b/i.test(raw)) {
        return raw.replace(/^item\b/i, nameStr);
    }

    const lower = raw.toLowerCase();
    if (
        lower.includes("stock") ||
        lower.includes("enough") ||
        lower.includes("negative") ||
        lower.includes("unavailable")
    ) {
        if (!itemName || raw.includes(itemName)) {
            return raw;
        }
        return `${nameStr} does not have enough stock left`;
    }

    return raw;
}