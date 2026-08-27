"use client";

import { useEffect, useState, ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import { useGetPublicStoreQuery } from "@/features/store-api/store-api";
import { useAuthenticateFacebookWebAppMutation } from "@/features/auth/facebookWebAppApi";
import { setTmaSession, updateTmaSession } from "@/lib/tma/tmaSession";
import { TmaNavbar } from "@/components/tma/TmaNavbar";
import { TmaBottomTabBar } from "@/components/tma/TmaBottomTabBar";
import { CompleteProfileScreen } from "@/components/tma/CompleteProfileScreen";

type AuthState =
  | { status: "pending" }
  | { status: "needs-profile"; businessId: string; businessName: string; fullName: string }
  | { status: "ready" }
  | { status: "error"; message: string };

/**
 * Messenger's counterpart to TelegramWebAppProvider — the whole shopping
 * experience (browse, cart, checkout) happens inside this one webview now,
 * the same as the Telegram Mini App. Facebook appends a `signed_request`
 * query param to the webview URL itself (because the persistent-menu button
 * and every "Open Shop" prompt set `messenger_extensions: true`), so unlike
 * Telegram there's no separate client-side SDK call needed to obtain it.
 */
export default function MessengerWebAppProvider({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const isMessenger =
    searchParams.get("messenger") === "true" ||
    (typeof window !== "undefined" && localStorage.getItem("messenger_mode") === "true");

  // Same store data the normal page already fetches — reused here just for
  // the id/name/logo the webview's own navbar and auth call need.
  const { data: store } = useGetPublicStoreQuery(slug, { skip: !isMessenger });
  const [authenticate] = useAuthenticateFacebookWebAppMutation();
  const [authState, setAuthState] = useState<AuthState>({ status: "pending" });

  // Always re-authenticate rather than trusting a cached session token —
  // same reasoning as Telegram: this call is what links the PSID to a
  // Customer row on the backend, and that link is what lets an order be
  // tagged MESSENGER instead of WEB at checkout.
  useEffect(() => {
    if (!isMessenger || !store) return;

    const signedRequest = searchParams.get("signed_request");
    if (!signedRequest) {
      setAuthState({
        status: "error",
        message: "Open this from the shop's Messenger bot to sign in.",
      });
      return;
    }

    authenticate({ businessId: store.id, signedRequest })
      .unwrap()
      .then((result) => {
        setTmaSession({
          token: result.token,
          refreshToken: result.refreshToken,
          businessId: result.businessId,
          businessSlug: result.businessSlug,
          customerId: result.customerId,
          fullName: result.fullName,
          phoneNumber: result.phoneNumber,
          email: result.email,
          gender: result.gender,
          address: result.address,
        });

        if (!result.profileComplete) {
          setAuthState({
            status: "needs-profile",
            businessId: result.businessId,
            businessName: result.businessName,
            fullName: result.fullName,
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

  if (authState.status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center whitespace-pre-wrap wrap-break-word bg-background px-6 text-center text-sm text-muted-foreground">
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
        onComplete={(data) => {
          updateTmaSession(data);
          setAuthState({ status: "ready" });
        }}
      />
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
