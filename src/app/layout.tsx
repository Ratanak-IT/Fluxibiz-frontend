import LayoutShell from "@/components/tma/LayoutShell";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import ReactDOM from "react-dom";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/common/ThemeProvider";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import AuthProvider from "@/components/common/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import StoreProvider from "./StoreProvider";

import "./globals.css";
import "./about/about.css";
import { NetworkStatusBanner } from "@/components/common/NetworkStatusBanner";
import { OfflineGate } from "@/components/offline/OfflineGate";
import { ConnectionProvider } from "@/components/offline/ConnectionProvider";
import { SITE_URL, STORE_URL, absoluteUrl } from "@/lib/seo";

export const viewport: Viewport = {
  themeColor: "#00932A",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.json",
  title: {
    default: "FluxiBiz - Run your whole business from one screen",
    template: "%s | FluxiBiz",
  },
  description:
    "The all-in-one point-of-sale, inventory, commerce, and business management platform for growing teams.",
  keywords: [
    "FluxiBiz",
    "POS System",
    "Inventory Management",
    "E-commerce Marketplace",
    "Point of Sale",
    "Business Management",
    "Cambodia POS",
    "Online Storefront",
  ],
  authors: [{ name: "FluxiBiz Team", url: SITE_URL }],
  creator: "FluxiBiz",
  publisher: "FluxiBiz",
  alternates: {
    canonical: STORE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
  icon: [
    { url: absoluteUrl("/favicon.ico") },
    { url: absoluteUrl("/favicon.png?v=2"), type: "image/png" },
  ],
  shortcut: absoluteUrl("/favicon.ico"),
  apple: absoluteUrl("/favicon.png?v=2"),
},
  openGraph: {
    type: "website",
    locale: "en_US",
    url: STORE_URL,
    siteName: "FluxiBiz",
    title: "FluxiBiz - Run your whole business from one screen",
    description:
      "The all-in-one point-of-sale, inventory, commerce, and business management platform for growing teams.",
    images: [
      {
        url: absoluteUrl("/thumbnail/thumbnail1.png?v=2"),
        width: 1536,
        height: 1024,
        alt: "FluxiBiz Business Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FluxiBiz - Run your whole business from one screen",
    description:
      "The all-in-one point-of-sale, inventory, commerce, and business management platform for growing teams.",
    images: [absoluteUrl("/thumbnail/thumbnail1.png?v=2")],
    creator: "@FluxiBiz",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  const locale = await getLocale();
  ReactDOM.preconnect("https://fonts.googleapis.com");
  ReactDOM.preconnect("https://fonts.gstatic.com", { crossOrigin: "anonymous" });

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FluxiBiz",
    url: STORE_URL,
    logo: absoluteUrl("/favicon.png?v=2"),
  };

  return (
    <html
      lang={locale}
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
      )}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <NextIntlClientProvider>
          <NetworkStatusBanner />
          <StoreProvider>
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
              >
                

                <LayoutShell>
                  <ConnectionProvider>

                    <OfflineGate>
                      {children}
                    </OfflineGate>

                  </ConnectionProvider>

                </LayoutShell>

                

                <Toaster
                  position="top-right"
                  richColors
                  closeButton
                />
              </ThemeProvider>
            </AuthProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
