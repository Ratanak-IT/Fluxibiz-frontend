import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/cart",
        "/store/*/cart",
        "/store/*/checkout",
        "/profile",
        "/user-profile",
        "/payment-history",
        "/receipt/",
        "/offline",
      ],
    },

    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
