import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

import Footer from "@/components/common/Footer";
import NavbarBeforeLoginComponent from "@/components/common/NavbarBeforeLoginComponent";

import "./globals.css";
import { cn } from "@/lib/utils";
import StoreProvider from "./StoreProvider";

// const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistSans = Google_Sans({
    variable: "--font-googlesans",
    subsets: ["latin"],
});

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
            className={cn(
                "h-full",
                "antialiased",
                geistSans.variable,
                "font-sans",
            )}
            suppressHydrationWarning
        >
            <body className="min-h-full flex flex-col">
                <StoreProvider>
                    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                        <NavbarBeforeLoginComponent />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </ThemeProvider>
                </StoreProvider>
            </body>
        </html>
    );
}
