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

export interface CreateCheckoutPayload {
    businessId: string;
    note?: string;
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