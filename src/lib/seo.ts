function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const fallback = "https://fluxibiz.store";

  if (!raw) return fallback;

  try {
    const parsed = new URL(raw);
    const isLocal =
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname.endsWith(".local");

    if (isLocal || parsed.protocol !== "https:") return fallback;

    return raw.replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

export const SITE_URL = resolveSiteUrl();

export const STORE_URL = `${SITE_URL}/store`;

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Server-only backend origin used by generateMetadata/sitemap fetches. Falls
 * back to localhost for local dev; that's fine here since this value is
 * never rendered into a page, only used to `fetch()` from the Next.js
 * server itself.
 */
export const backendBaseUrl = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080"
).replace(/\/$/, "");

export const NOINDEX: import("next").Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
  },
};
