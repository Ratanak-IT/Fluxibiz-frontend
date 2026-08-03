
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import AuthProvider from "@/components/common/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import "./about/about.css";
import { cn } from "@/lib/utils";
import StoreProvider from "./StoreProvider";
import NavbarAfterLoginComponent from "@/components/common/NavbarAfterLoginComponent";


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
            <body className="min-h-full flex flex-col" >
                <StoreProvider>
                    <AuthProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="light"
                            enableSystem
                        >
                            <Navbar />
                            

                            <main className="flex-1">{children}</main>
                            <Footer />
                            <Toaster position="top-right" richColors closeButton />
                        </ThemeProvider>
                    </AuthProvider>
                </StoreProvider>
            </body>
        </html>
    );
}