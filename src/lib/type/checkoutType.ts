export type OrderStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export type QrStatus = "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";

export interface CheckoutSession {
    orderId: string;
    invoiceNumber: string;
    businessId: string;
    storeName: string;
    storeSlug: string;
    itemCount: number;
    total: number;
    currency: string;
    displayCurrency?: string | null;
    displayExchangeRate?: number | null;
    qr: string | null;
    md5: string | null;
    qrImage: string | null;
    expiresAt: string | null;
}

export interface ActiveCheckout {
    hasPendingCheckout: boolean;
    checkout: CheckoutSession | null;
}

export interface PaymentStatus {
    orderId: string;
    invoiceNumber: string;
    orderStatus: OrderStatus;
    qrStatus: QrStatus;
    paid: boolean;
    message: string;
    expiresAt: string | null;
    paidAt: string | null;
}

export type PaymentMethodType = "KHQR" | "PAY_LATER" | "CASH";

export interface CreateCheckoutPayload {
    businessId: string;
    paymentMethod?: PaymentMethodType | string;
    note?: string;
}

export interface StorefrontOrderItem {
    itemId: string | null;
    itemName: string;
    quantity: number;
    unitPrice: number;
    /** Total knocked off this whole line by an active promotion — a line total, not a per-unit amount. */
    discountAmount?: number;
    /** Name of the discount that produced discountAmount for this line, e.g. "Summer Sale 15%". */
    discountLabel?: string | null;
    /** Units within this line's quantity given free by a Buy X Get Y promotion, when the backend reports it. */
    freeQuantity?: number;
    lineTotal: number;
    /** Options this line was ordered with, already rendered — "Sugar Level: 50%". */
    selections?: string[];
}

export interface StorefrontOrder {
    orderId: string;
    invoiceNumber: string;
    businessId: string;
    storeName: string;
    storeSlug: string;
    storeLogo: string | null;
    storeAddress: string | null;
    storePhone: string | null;
    customerName: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
    status: OrderStatus;
    channel: string;
    paymentMethod: string;
    subtotal: number;
    discountAmount: number;
    discountLabel?: string | null;
    taxRate?: number;
    taxAmount?: number;
    taxInclusionType?: "INCLUSIVE" | "EXCLUSIVE" | string | null;
    /** What to call it on the receipt — "VAT", "GST" — set by the business, defaults to "Tax". */
    taxLabel?: string | null;
    total: number;
    currency: string;
    /** The second currency this order was shown in, frozen at checkout — null when the shop shows only one currency. */
    displayCurrency?: string | null;
    /** Units of displayCurrency per one unit of currency. */
    displayExchangeRate?: number | null;
    itemCount: number;
    createdDate: string;
    paidAt: string | null;
    items: StorefrontOrderItem[];
}

/** What one receipt line should show for its price, after an order-wide discount is accounted for. */
export interface DisplayOrderItemPrice {
    lineTotal: number;
    compareAtLineTotal: number;
    discountAmount: number;
    discountLabel: string | null;
}

/**
 * Per-item prices for a receipt, spreading an order-wide discount across
 * items pro rata when the order was placed before the discount was
 * attributed to each item — an older order only ever carries the discount
 * on its own total, which leaves every item looking like full price even
 * though less was actually charged. Display-only: `order.total` is always
 * what was actually charged, regardless of how it's split across items here.
 */
export function displayOrderItemPrices(order: StorefrontOrder): DisplayOrderItemPrice[] {
    const itemAttributed = order.items.reduce((acc, item) => acc + (item.discountAmount ?? 0), 0);
    const orderDiscount = order.discountAmount ?? 0;

    if (itemAttributed > 0 || orderDiscount <= 0) {
        // Either every item already carries its own share, or there is
        // nothing to spread — read straight off each item.
        return order.items.map((item) => ({
            lineTotal: item.lineTotal,
            compareAtLineTotal:
                item.discountAmount && item.discountAmount > 0
                    ? item.lineTotal + item.discountAmount
                    : item.lineTotal,
            discountAmount: item.discountAmount ?? 0,
            discountLabel: item.discountLabel ?? null,
        }));
    }

    const rawSubtotal = order.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    let remaining = orderDiscount;

    return order.items.map((item, index) => {
        const rawLineTotal = item.unitPrice * item.quantity;
        const isLast = index === order.items.length - 1;
        const share = isLast
            ? remaining
            : rawSubtotal > 0
                ? Math.round(((orderDiscount * rawLineTotal) / rawSubtotal) * 100) / 100
                : 0;
        if (!isLast) {
            remaining -= share;
        }

        return {
            lineTotal: Math.max(0, rawLineTotal - share),
            compareAtLineTotal: rawLineTotal,
            discountAmount: share,
            discountLabel: order.discountLabel ?? null,
        };
    });
}

export function checkoutErrorMessage(error: unknown, fallback: string): string {
    if (typeof error !== "object" || error === null) return fallback;

    const data = (error as { data?: unknown }).data;

    if (typeof data === "string" && data.trim()) return data;

    if (typeof data === "object" && data !== null) {
        const body = data as { detail?: unknown; message?: unknown; error?: unknown };

        for (const candidate of [body.detail, body.message, body.error]) {
            if (typeof candidate === "string" && candidate.trim()) return candidate;
        }
    }

    return fallback;
}