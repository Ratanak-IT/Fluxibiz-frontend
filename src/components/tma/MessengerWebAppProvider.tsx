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

/**
 * Messenger's counterpart to TelegramWebAppProvider — the whole shopping
 * experience (browse, cart, checkout) happens inside this one webview.
 *
 * This used to authenticate through Messenger Extensions'
 * `getContext()`/`signed_request` the instant the page loaded. That never
 * became reliable — Facebook's own client kept returning `-32603`/`2071011`
 * regardless of any fix on this side — and even when it worked, the Graph
 * API name lookup behind it commonly fell back to a placeholder ("Facebook
 * User") since Meta rarely grants profile-read permission for it. So this
 * no longer touches the Messenger Extensions SDK at all: a visitor browses
 * completely unauthenticated at first (see `MessengerProfileGateProvider`,
 * mounted below), and only registers — name, phone, a device id kept in
 * localStorage — the first time they try to add to cart or pay.
 */
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

  // Fetched unconditionally, not gated on the flag above — Messenger tears
  // down and recreates its embedded webview between separate opens on
  // mobile, and `sessionStorage` (what that flag lives in) doesn't reliably
  // survive that. Without the store's id, there's no way to check for a
  // durable device session below, so a visitor whose flag got lost would
  // otherwise be stuck looking like a brand-new, unauthenticated web guest
  // forever — losing their session, order history, everything.
  const { data: store } = useGetPublicStoreQuery(slug, { skip: !slug });
  const [authState, setAuthState] = useState<AuthState>({ status: "pending" });
  const [hasDeviceSession, setHasDeviceSession] = useState(false);

  useEffect(() => {
    if (!store) return;

    const existing = getDeviceSession(store.id);
    if (!existing) return;

    setHasDeviceSession(true);

    // Hydrates the same sessionStorage-backed `tmaSession` every other API
    // slice reads its bearer token from, so a returning visitor's
    // cart/checkout/history calls are already authenticated without
    // asking again — even after the flag above was lost.
    setTmaSession({
      token: existing.token,
      refreshToken: existing.refreshToken,
      businessId: existing.businessId,
      businessSlug: existing.businessSlug,
      customerId: existing.customerId,
      fullName: existing.fullName,
      phoneNumber: existing.phoneNumber,
    });

    // Restores the flag itself once a device session proves this really is
    // Messenger — so every other component on this page load that reads
    // `useIsMessenger()` independently (Navbar, the "Me" tab, payment
    // history) sees the correct answer too, not just this provider.
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
