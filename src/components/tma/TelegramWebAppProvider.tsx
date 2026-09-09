"use client";

import { useEffect, useState, ReactNode } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { useGetPublicStoreQuery } from "@/features/store-api/store-api";
import { useAuthenticateTelegramWebAppMutation } from "@/features/auth/telegramWebAppApi";
import { setTmaSession } from "@/lib/tma/tmaSession";
import { TmaNavbar } from "@/components/tma/TmaNavbar";
import { TmaBottomTabBar } from "@/components/tma/TmaBottomTabBar";

type AuthState =
  | { status: "pending" }
  | { status: "ready" }
  | { status: "error"; message: string };

export default function TelegramWebAppProvider({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isTma =
    searchParams.get("tma") === "true" ||
    (typeof window !== "undefined" && sessionStorage.getItem("tma_mode") === "true");

  const { data: store } = useGetPublicStoreQuery(slug, { skip: !isTma });
  const [authenticate] = useAuthenticateTelegramWebAppMutation();
  const [authState, setAuthState] = useState<AuthState>({ status: "pending" });

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

  useEffect(() => {
    if (!isTma || !store) return;

    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      const diag = [
        `telegram=${typeof window.Telegram}`,
        `webApp=${typeof window.Telegram?.WebApp}`,
        `platform=${window.Telegram?.WebApp?.platform ?? "n/a"}`,
        `version=${window.Telegram?.WebApp?.version ?? "n/a"}`,
        `hash=${window.location.hash ? "present" : "empty"}`,
      ].join(" | ");
      setAuthState({
        status: "error",
        message: `Open this from the shop's Telegram bot to sign in.\n\n[debug] ${diag}`,
      });
      return;
    }

    authenticate({ businessId: store.id, initData })
      .unwrap()
      .then((result) => {
        setTmaSession({
          token: result.token,
          refreshToken: result.refreshToken,
          businessId: result.businessId,
          businessSlug: result.businessSlug,
          customerId: result.customerId,
          fullName: result.fullName,
          photoUrl: result.photoUrl,
          phoneNumber: result.phoneNumber,
          email: result.email,
          gender: result.gender,
          address: result.address,
        });

        setAuthState({ status: "ready" });
      })
      .catch(() => {
        setAuthState({
          status: "error",
          message: "Couldn't sign you in. Try reopening this from the bot.",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTma, store]);

  if (!isTma) {
    return <div>{children}</div>;
  }

  if (authState.status === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (authState.status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center whitespace-pre-wrap wrap-break-word bg-background px-6 text-center text-sm text-muted-foreground">
        {authState.message}
      </div>
    );
  }

  return (
    <div className="tma-standalone-mode min-h-screen bg-background pb-24">
      {store && (
        <TmaNavbar
          slug={slug}
          businessName={store.name || store.displayName || ""}
          businessLogo={store.logo}
        />
      )}
      {children}
      <TmaBottomTabBar slug={slug} />
    </div>
  );
}
