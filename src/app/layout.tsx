import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

import Footer from "@/components/common/Footer";
import NavbarBeforeLoginComponent from "@/components/common/NavbarBeforeLoginComponent";

import "./globals.css";

export const metadata: Metadata = {
  title: "FluxiBiz - Run your whole business from one screen",
  description:
    "The all-in-one point-of-sale, inventory, commerce, and business management platform for growing teams.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NavbarBeforeLoginComponent />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
