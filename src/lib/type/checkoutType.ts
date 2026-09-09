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
    discountAmount?: number;
    discountLabel?: string | null;
    freeQuantity?: number;
    lineTotal: number;
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
    taxLabel?: string | null;
    total: number;
    currency: string;
    displayCurrency?: string | null;
    displayExchangeRate?: number | null;
    itemCount: number;
    createdDate: string;
    paidAt: string | null;
    items: StorefrontOrderItem[];
}

export interface DisplayOrderItemPrice {
    lineTotal: number;
    compareAtLineTotal: number;
    discountAmount: number;
    discountLabel: string | null;
}


export function displayOrderItemPrices(order: StorefrontOrder): DisplayOrderItemPrice[] {
    const itemAttributed = order.items.reduce((acc, item) => acc + (item.discountAmount ?? 0), 0);
    const orderDiscount = order.discountAmount ?? 0;

    if (itemAttributed > 0 || orderDiscount <= 0) {
  
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