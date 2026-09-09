"use client";

import { useEffect, useState, ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import { useGetPublicStoreQuery } from "@/features/store-api/store-api";
import { setTmaSession } from "@/lib/tma/tmaSession";
import { getDeviceSession } from "@/lib/tma/messengerDeviceStore";
import { TmaNavbar } from "@/components/tma/TmaNavbar";
import { TmaBottomTabBar } from "@/components/tma/TmaBottomTabBar";
import { MessengerProfileGateProvider } from "@/lib/tma/MessengerProfileGate";

type AuthState = { status: "pending" } | { status: "ready" };

export default function MessengerWebAppProvider({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const flaggedMessenger =
    searchParams.get("messenger") === "true" ||
    (typeof window !== "undefined" && sessionStorage.getItem("messenger_mode") === "true");

  const { data: store } = useGetPublicStoreQuery(slug, { skip: !slug });
  const [authState, setAuthState] = useState<AuthState>({ status: "pending" });
  const [hasDeviceSession, setHasDeviceSession] = useState(false);

  useEffect(() => {
    if (!store) return;

    const existing = getDeviceSession(store.id);
    if (!existing) return;

    setHasDeviceSession(true);

    setTmaSession({
      token: existing.token,
      refreshToken: existing.refreshToken,
      businessId: existing.businessId,
      businessSlug: existing.businessSlug,
      customerId: existing.customerId,
      fullName: existing.fullName,
      phoneNumber: existing.phoneNumber,
    });

    try {
      window.sessionStorage.setItem("messenger_mode", "true");
    } catch {
      // Storage disabled — the flag just won't stick, same as before.
    }
  }, [store]);

  const isMessenger = flaggedMessenger || hasDeviceSession;

  useEffect(() => {
    if (!isMessenger || !store) return;
    setAuthState({ status: "ready" });
  }, [isMessenger, store]);

  if (!isMessenger) {
    return <div>{children}</div>;
  }

  if (authState.status === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <MessengerProfileGateProvider>
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
    </MessengerProfileGateProvider>
  );
}
