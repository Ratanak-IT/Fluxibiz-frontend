import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

import Footer from "@/components/common/Footer";
import NavbarBeforeLoginComponent from "@/components/common/NavbarBeforeLoginComponent";

import "./globals.css";
import "./about/about.css";
import { cn } from "@/lib/utils";
import StoreProvider from "./StoreProvider";

export const metadata: Metadata = {
    title: "FluxiBiz - Run your whole business from one screen",
    description:
        "The all-in-one point-of-sale, inventory, commerce, and business management platform for growing teams.",
};

export default function RootLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <html
            lang="en"
            className={cn("h-full", "antialiased", "font-sans")}
            suppressHydrationWarning
            data-scroll-behavior="smooth"
        >
            <body className="min-h-full flex flex-col">
                <StoreProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                    >
                        <NavbarBeforeLoginComponent />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </ThemeProvider>
                </StoreProvider>
            </body>
        </html>
    );
}
