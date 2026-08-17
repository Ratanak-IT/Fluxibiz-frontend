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
