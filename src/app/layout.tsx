import type { Metadata } from "next";
import type { ReactNode } from "react";
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


const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fluxibiz.store";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
  authors: [{ name: "FluxiBiz Team", url: siteUrl }],
  creator: "FluxiBiz",
  publisher: "FluxiBiz",
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
    icon: "/image/footer/fluxibiz-lightmode.png",
    shortcut: "/image/footer/fluxibiz-lightmode.png",
    apple: "/image/footer/fluxibiz-lightmode.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "FluxiBiz",
    title: "FluxiBiz - Run your whole business from one screen",
    description:
      "The all-in-one point-of-sale, inventory, commerce, and business management platform for growing teams.",
    images: [
      {
        url: "/desktop-view.png",
        width: 1200,
        height: 630,
        alt: "FluxiBiz Business Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FluxiBiz - Run your whole business from one screen",
    description:
      "The all-in-one point-of-sale, inventory, commerce, and business management platform for growing teams.",
    images: ["/desktop-view.png"],
    creator: "@FluxiBiz",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  // Reads "en" or "km" from src/i18n/request.ts
  const locale = await getLocale();

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
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <NetworkStatusBanner />
          <StoreProvider>
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
              >
                <Navbar />

                <main className="flex-1">
                  <ConnectionProvider>
                   
                    <OfflineGate>
                      {children}
                    </OfflineGate>
                   
                  </ConnectionProvider>
                 
                </main>

                <Footer />

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