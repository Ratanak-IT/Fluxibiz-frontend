"use client";

import { useEffect, useState, ReactNode } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { useGetPublicStoreQuery } from "@/features/store-api/store-api";
import { useAuthenticateTelegramWebAppMutation } from "@/features/auth/telegramWebAppApi";
import { getTmaSession, setTmaSession, updateTmaSession } from "@/lib/tma/tmaSession";
import { TmaNavbar } from "@/components/tma/TmaNavbar";
import { TmaBottomTabBar } from "@/components/tma/TmaBottomTabBar";
import { CompleteProfileScreen } from "@/components/tma/CompleteProfileScreen";

type AuthState =
  | { status: "pending" }
  | { status: "needs-profile"; businessId: string; businessName: string; fullName: string; photoUrl?: string }
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
    (typeof window !== "undefined" && localStorage.getItem("tma_mode") === "true");

  // Same store data the normal page already fetches — reused here just for
  // the id/name/logo the Mini App's own navbar and auth call need.
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

  // Verifies this visitor with the backend once the store (and so its
  // businessId) is known — a real Keycloak session comes back, usable by
  // every other authenticated storefront call (cart, checkout, orders)
  // exactly like a normal logged-in shopper.
  useEffect(() => {
    if (!isTma || !store) return;

    const existing = getTmaSession();
    if (existing && existing.businessId === store.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthState({ status: "ready" });
      return;
    }

    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      setAuthState({
        status: "error",
        message: "Open this from the shop's Telegram bot to sign in.",
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
          customerId: result.customerId,
          fullName: result.fullName,
          photoUrl: result.photoUrl,
          phoneNumber: result.phoneNumber,
          address: result.address,
        });

        if (!result.profileComplete) {
          setAuthState({
            status: "needs-profile",
            businessId: result.businessId,
            businessName: result.businessName,
            fullName: result.fullName,
            photoUrl: result.photoUrl,
          });
        } else {
          setAuthState({ status: "ready" });
        }
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
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-sm text-muted-foreground">
        {authState.message}
      </div>
    );
  }

  if (authState.status === "needs-profile") {
    return (
      <CompleteProfileScreen
        businessId={authState.businessId}
        businessName={authState.businessName}
        fullName={authState.fullName}
        photoUrl={authState.photoUrl}
        onComplete={(data) => {
          updateTmaSession(data);
          setAuthState({ status: "ready" });
        }}
      />
    );
  }

  return (
    <div className="tma-standalone-mode min-h-screen bg-background pb-16">
      {store && (
        <TmaNavbar
          businessName={store.name || store.displayName || ""}
          businessLogo={store.logo}
        />
      )}
      {children}
      <TmaBottomTabBar slug={slug} />
    </div>
  );
}
