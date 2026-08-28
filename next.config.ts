import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
  fallbacks: {
    document: "/offline",
  },
});

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Permissions-Policy",
    // geolocation=(self) — not (): an empty allowlist blocks the API even
    // for the site's own pages, which is what silently broke the /store
    // distance feature. (self) keeps the actual intent of this header —
    // deny it to any embedded third-party content — without taking out
    // first-party use.
    value:
      "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // The Telegram Mini App and Messenger webview both load these pages
        // as a business's own storefront — Messenger's Extensions bridge
        // (MessengerExtensions.getContext(), used to sign a Messenger
        // shopper in) needs the page framable by Messenger, but the blanket
        // `X-Frame-Options: DENY` above blocks that silently: the page still
        // *loads* fine (DENY only stops framing, not top-level navigation),
        // so this only ever surfaced as getContext() failing with "Messenger
        // Extensions are not enabled" — nothing about frames. Modern browsers
        // prefer a CSP `frame-ancestors` over `X-Frame-Options` when both are
        // present, so this narrows the exception to just these routes
        // without loosening it site-wide.
        source: "/store/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://*.facebook.com https://*.messenger.com;",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/store",
        permanent: false,
      },
    ];
  },

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "framer-motion",
      "motion",
      "embla-carousel-react",
    ],
  },

  reactCompiler: true,
};

export default withPWA(withNextIntl(nextConfig));