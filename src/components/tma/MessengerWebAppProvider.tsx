"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

import { useGetPublicStoreQuery } from "@/features/store-api/store-api";
import { useAuthenticateFacebookWebAppMutation } from "@/features/auth/facebookWebAppApi";
import { setTmaSession } from "@/lib/tma/tmaSession";
import { TmaNavbar } from "@/components/tma/TmaNavbar";
import { TmaBottomTabBar } from "@/components/tma/TmaBottomTabBar";
import { MessengerProfileGateProvider } from "@/lib/tma/MessengerProfileGate";

type AuthState =
  | { status: "pending" }
  | { status: "ready" }
  | { status: "error"; message: string };

type ContextResult =
  | { signedRequest: string }
  | { error: string };

declare global {
  interface Window {
    extAsyncInit?: () => void;
    MessengerExtensions?: {
      getContext: (
        appId: string,
        success: (context: { psid: string; signed_request?: string; thread_type?: string; tid?: string }) => void,
        error: (errCode: number, errMsg: string) => void
      ) => void;
      getSupportedFeatures: (
        success: (result: { supported_features: string[] }) => void,
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
 * Facebook's own docs example calls `MessengerExtensions.getContext()`
 * *directly and synchronously* inside `window.extAsyncInit` — not via a
 * React state update that a later render/effect picks up. Routing the call
 * through `setState` + a separate `useEffect` (this component's first
 * attempt) inserts a render-cycle delay between the SDK announcing itself
 * ready and the actual call, which is exactly the kind of thing that can
 * leave the SDK's own internal state half-initialised and surface as an
 * opaque `-32603 Internal error` rather than a clean result. So the
 * getContext/getSupportedFeatures chain runs directly inside extAsyncInit;
 * only the *result* (a signed_request or an error) is handed to React state,
 * and a separate effect waits for that result plus the store to actually
 * call the backend.
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
    (typeof window !== "undefined" && sessionStorage.getItem("messenger_mode") === "true");

  // Same store data the normal page already fetches — reused here just for
  // the id/name/logo the webview's own navbar and auth call need.
  const { data: store } = useGetPublicStoreQuery(slug, { skip: !isMessenger });
  const [authenticate] = useAuthenticateFacebookWebAppMutation();
  const [authState, setAuthState] = useState<AuthState>({ status: "pending" });
  const [contextResult, setContextResult] = useState<ContextResult | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isMessenger || startedRef.current) return;

    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    if (!appId) {
      setAuthState({ status: "error", message: "Messenger sign-in is not configured (missing app id)." });
      return;
    }

    const runGetContext = () => {
      window.MessengerExtensions?.getContext(
        appId,
        (context) => {
          if (!context.signed_request) {
            setContextResult({ error: "Open this from the shop's Messenger bot to sign in." });
            return;
          }
          setContextResult({ signedRequest: context.signed_request });
        },
        (errCode, errMsg) => {
          setContextResult({
            error: `Open this from the shop's Messenger bot to sign in.\n\n[debug] getContext failed: ${errCode} ${errMsg}\n[debug] appId=${appId} href=${window.location.href}`,
          });
        }
      );
    };

    const runChain = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      if (!window.MessengerExtensions?.getSupportedFeatures) {
        runGetContext();
        return;
      }

      window.MessengerExtensions.getSupportedFeatures(
        (result) => {
          if (!result.supported_features?.includes("context")) {
            setContextResult({
              error: `Open this from the shop's Messenger bot to sign in.\n\n[debug] client does not support "context": ${JSON.stringify(result.supported_features)}`,
            });
            return;
          }
          runGetContext();
        },
        (errCode, errMsg) => {
          setContextResult({
            error: `Open this from the shop's Messenger bot to sign in.\n\n[debug] getSupportedFeatures failed: ${errCode} ${errMsg}`,
          });
        }
      );
    };

    // The SDK calls this itself the instant its script finishes loading —
    // the chain above runs synchronously inside that same callback, exactly
    // as Facebook's own example does.
    window.extAsyncInit = runChain;

    // The script may have already finished loading (e.g. fast reload) before
    // this effect ran and called extAsyncInit itself — nothing left to wait for.
    if (window.MessengerExtensions) runChain();
  }, [isMessenger]);

  // Fires the backend call once both the SDK's result and the store are
  // ready — order between the two is never guaranteed, so this effect (not
  // either side individually) is what actually starts authentication.
  useEffect(() => {
    if (!contextResult || !store) return;

    if ("error" in contextResult) {
      setAuthState({ status: "error", message: contextResult.error });
      return;
    }

    authenticate({ businessId: store.id, signedRequest: contextResult.signedRequest })
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

        setAuthState({ status: "ready" });
      })
      .catch(() => {
        setAuthState({
          status: "error",
          message: "Couldn't sign you in. Try reopening this from the bot.",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextResult, store]);

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

      {authState.status === "ready" && (
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
      )}
    </>
  );
}
