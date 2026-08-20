"use client";

import { useEffect, ReactNode } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function TelegramWebAppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isTma =
    searchParams.get("tma") === "true" ||
    (typeof window !== "undefined" && localStorage.getItem("tma_mode") === "true");

  useEffect(() => {
    if (typeof window === "undefined" || !window.Telegram?.WebApp) return;
    const tg = window.Telegram.WebApp;

    if (isTma) {
      tg.ready();
      tg.expand();

      const isStoreHome = pathname.startsWith("/store/") && pathname.split("/").length === 3;
      if (!isStoreHome) {
        tg.BackButton.show();
        const handleBack = () => router.back();
        tg.BackButton.onClick(handleBack);
        return () => {
          tg.BackButton.offClick(handleBack);
          tg.BackButton.hide();
        };
      } else {
        tg.BackButton.hide();
      }
    }
  }, [isTma, pathname, router]);

  return (
    <div className={isTma ? "tma-standalone-mode min-h-screen bg-background" : ""}>
      {children}
    </div>
  );
}
