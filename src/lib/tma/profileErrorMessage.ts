
export function profileErrorMessage(error: unknown, fallback: string): string {
  if (typeof error !== "object" || error === null) return fallback;

  const data = (error as { data?: unknown }).data;

  if (typeof data === "string" && data.trim()) return data;

  if (typeof data === "object" && data !== null) {

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

  const status = (error as { status?: unknown }).status;
  if (status === "FETCH_ERROR" || status === "TIMEOUT_ERROR") {
    return fallback;
  }

  const topLevelError = (error as { error?: unknown }).error;
  if (typeof topLevelError === "string" && topLevelError.trim()) return topLevelError;

  return fallback;
}
