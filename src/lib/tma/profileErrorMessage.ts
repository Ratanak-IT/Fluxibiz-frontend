/**
 * Turns a rejected /me/profile call into text the shopper can act on.
 * The backend already returns a clear, field-specific message for the
 * conflicts that matter here (email/phone already in use, an invalid phone
 * format) — this just surfaces it instead of a generic "check your
 * connection" that hides which field to fix and, worse, blames the
 * network for what's actually a validation rejection.
 */
export function profileErrorMessage(error: unknown, fallback: string): string {
  if (typeof error !== "object" || error === null) return fallback;

  const data = (error as { data?: unknown }).data;

  if (typeof data === "string" && data.trim()) return data;

  if (typeof data === "object" && data !== null) {
    // Field-level validation errors (AppGlobalException's
    // MethodArgumentNotValidException handler): {message, errorDetail: [{field, message}]}.
    // The field message is the actionable part — "phoneNumber: must be at
    // least 8 digits" beats the generic "Request data is invalid..!" wrapper.
    const errorDetail = (data as { errorDetail?: unknown }).errorDetail;
    if (Array.isArray(errorDetail) && errorDetail.length > 0) {
      const first = errorDetail[0] as { field?: unknown; message?: unknown };
      const detailMessage = typeof first?.message === "string" ? first.message : null;
      if (detailMessage) {
        const field = typeof first?.field === "string" ? first.field : null;
        return field ? `${field}: ${detailMessage}` : detailMessage;
      }
    }

    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  // RTK Query's shape for a genuine network failure (no response at all) —
  // this is the one case "check your connection" actually describes.
  const status = (error as { status?: unknown }).status;
  if (status === "FETCH_ERROR" || status === "TIMEOUT_ERROR") {
    return fallback;
  }

  const topLevelError = (error as { error?: unknown }).error;
  if (typeof topLevelError === "string" && topLevelError.trim()) return topLevelError;

  return fallback;
}
