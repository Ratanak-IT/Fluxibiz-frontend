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

    value:
      "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
];

// Split out from the shared set above: Messenger genuinely embeds
// /store/* pages in an iframe from facebook.com (confirmed by the
// `fb_iframe_origin` param Facebook appends to the URL once it does) to run
// its Extensions postMessage bridge. `X-Frame-Options: DENY` has no
// wildcard/allowlist form — it can only ever mean "never frame this page" —
// so leaving it on `/store/*` alongside a permissive CSP `frame-ancestors`
// risked the two fighting each other (some engines honor whichever is
// stricter rather than always preferring CSP as the spec says), which is
// exactly the kind of thing that would surface as the frame loading but its
// postMessage handshake failing with an opaque internal error. Every other
// path keeps DENY.
const frameOptionsDeny = { key: "X-Frame-Options", value: "DENY" };

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
        // Negative-lookahead matcher: every path except /store and its
        // subpaths. Keeps the hard DENY everywhere the Telegram/Messenger
        // Mini App doesn't need to be frameable.
        source: "/:path((?!store).*)",
        headers: [frameOptionsDeny],
      },
      {
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