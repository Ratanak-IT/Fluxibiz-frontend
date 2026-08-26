/**
 * Turns a rejected /me/profile call into text the shopper can act on.
 * The backend already returns a clear, field-specific message for the
 * conflicts that matter here (email/phone already in use) — this just
 * surfaces it instead of a generic "check your connection" that hides
 * which field to fix.
 */
export function profileErrorMessage(error: unknown, fallback: string): string {
  if (typeof error !== "object" || error === null) return fallback;

  const data = (error as { data?: unknown }).data;

  if (typeof data === "string" && data.trim()) return data;

  if (typeof data === "object" && data !== null) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
}
