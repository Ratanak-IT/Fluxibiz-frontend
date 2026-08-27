"use client";

import { useEffect, useState, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

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

declare global {
  interface Window {
    extAsyncInit?: () => void;
    MessengerExtensions?: {
      getContext: (
        appId: string,
        success: (context: { psid: string; signed_request?: string; thread_type?: string; tid?: string }) => void,
        error: (errCode: number, errMsg: string) => void
      ) => void;
    };
  }
}

/**
 * Messenger's counterpart to TelegramWebAppProvider — the whole shopping
 * experience (browse, cart, checkout) happens inside this one webview now,
 * the same as the Telegram Mini App.
 *
 * Unlike what Facebook's own docs imply, a `web_url` button with
 * `messenger_extensions: true` does NOT reliably append `signed_request` to
 * the webview's URL on load — the only mechanism that actually works is
 * calling `MessengerExtensions.getContext()` from inside the loaded page
 * once the SDK has initialised, which returns the same signed_request the
 * backend needs to verify.
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
  const [sdkReady, setSdkReady] = useState(false);

  // The SDK calls this itself once its own script has finished loading —
  // must be assigned before the script tag runs, so it can't wait for a
  // useEffect after mount.
  useEffect(() => {
    if (!isMessenger) return;
    window.extAsyncInit = () => setSdkReady(true);
    // The script may have already finished loading (e.g. fast reload) before
    // this effect ran and called extAsyncInit itself — nothing left to wait for.
    if (window.MessengerExtensions) setSdkReady(true);
  }, [isMessenger]);

  // Always re-authenticate rather than trusting a cached session token —
  // same reasoning as Telegram: this call is what links the PSID to a
  // Customer row on the backend, and that link is what lets an order be
  // tagged MESSENGER instead of WEB at checkout.
  useEffect(() => {
    if (!isMessenger || !store || !sdkReady) return;

    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    if (!appId) {
      setAuthState({ status: "error", message: "Messenger sign-in is not configured (missing app id)." });
      return;
    }

    window.MessengerExtensions?.getContext(
      appId,
      (context) => {
        if (!context.signed_request) {
          setAuthState({
            status: "error",
            message: "Open this from the shop's Messenger bot to sign in.",
          });
          return;
        }

        authenticate({ businessId: store.id, signedRequest: context.signed_request })
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
      },
      (errCode, errMsg) => {
        setAuthState({
          status: "error",
          message: `Open this from the shop's Messenger bot to sign in.\n\n[debug] getContext failed: ${errCode} ${errMsg}`,
        });
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMessenger, store, sdkReady]);

  if (!isMessenger) {
    return <div>{children}</div>;
  }

  return (
    <>
      <Script
        src="https://connect.facebook.net/en_US/messenger.Extensions.js"
        strategy="afterInteractive"
      />

      {authState.status === "pending" && (
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
          Loading...
        </div>
      )}

      {authState.status === "error" && (
        <div className="flex min-h-screen items-center justify-center whitespace-pre-wrap wrap-break-word bg-background px-6 text-center text-sm text-muted-foreground">
          {authState.message}
        </div>
      )}

      {authState.status === "needs-profile" && (
        <CompleteProfileScreen
          businessId={authState.businessId}
          businessName={authState.businessName}
          fullName={authState.fullName}
          onComplete={(data) => {
            updateTmaSession(data);
            setAuthState({ status: "ready" });
          }}
        />
      )}

      {authState.status === "ready" && (
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
      )}
    </>
  );
}
