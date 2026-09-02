/**
 * A fresh key identifying one attempt at a write the server must not perform
 * twice. Sent as `Idempotency-Key`; the server replays the first attempt's
 * response for any repeat carrying the same value.
 *
 * Hold one key for as long as the attempt lasts — across a double-tapped
 * button, a retried request, a resend after a dropped reply — and take a new
 * one only once the attempt has succeeded and the next is a genuinely
 * different action.
 */
export function newIdempotencyKey(): string {
    // Present in every browser the storefront supports over HTTPS; the fallback
    // covers insecure origins, where randomUUID is not exposed at all.
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
