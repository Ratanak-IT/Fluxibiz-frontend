"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

import { MessengerProfilePrompt } from "@/components/tma/MessengerProfilePrompt";
import { setTmaSession } from "@/lib/tma/tmaSession";
import { getDeviceSession, setDeviceSession } from "@/lib/tma/messengerDeviceStore";
import type { FacebookWebAppAuthResponse } from "@/features/auth/facebookWebAppApi";

type PendingAction = { businessId: string; run: () => void };

const MessengerProfileGateContext = createContext<{
  requireProfile: (businessId: string, run: () => void) => void;
} | null>(null);

/**
 * Gates "Add to cart" and "Pay" inside the Messenger Mini App on having a
 * registered device session (name + phone) for this business — mounted once
 * around the whole Mini App (in MessengerWebAppProvider's "ready" branch) so
 * every page that adds to cart or checks out shares the same prompt instead
 * of each duplicating this check.
 *
 * The check reads `messengerDeviceStore` (localStorage), not a live backend
 * call — the whole point of dropping `getContext()` is that a fresh device
 * has no bearer token to call anything authenticated with yet, so this has
 * to be answerable purely from what's already on the device.
 *
 * Outside Messenger, `useRequireMessengerProfile` degrades to a plain
 * passthrough (see below), so call sites don't need to branch on channel
 * themselves.
 */
export function MessengerProfileGateProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingAction | null>(null);

  const requireProfile = useCallback((businessId: string, run: () => void) => {
    if (getDeviceSession(businessId)) {
      run();
      return;
    }
    setPending({ businessId, run });
  }, []);

  function handleSaved(result: FacebookWebAppAuthResponse) {
    if (!pending) return;

    setDeviceSession(pending.businessId, {
      token: result.token,
      refreshToken: result.refreshToken,
      businessId: result.businessId,
      businessSlug: result.businessSlug,
      customerId: result.customerId,
      fullName: result.fullName,
      phoneNumber: result.phoneNumber ?? "",
    });

    // Hydrates the same sessionStorage-backed session every other RTK Query
    // slice (`applyTmaAuthHeader`) already reads its bearer token from, so
    // the pending action can call an authenticated endpoint immediately.
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

    const run = pending.run;
    setPending(null);
    run();
  }

  return (
    <MessengerProfileGateContext.Provider value={{ requireProfile }}>
      {children}
      {pending && (
        <MessengerProfilePrompt
          open
          businessId={pending.businessId}
          onOpenChange={(open) => {
            if (!open) setPending(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </MessengerProfileGateContext.Provider>
  );
}

/**
 * Outside `MessengerProfileGateProvider` (every non-Messenger page — the
 * regular storefront, Telegram) this has no provider to read from, so it
 * falls back to running the action immediately: those channels have their
 * own gating (or none) and were never meant to hit this prompt.
 */
export function useRequireMessengerProfile() {
  const ctx = useContext(MessengerProfileGateContext);
  return ctx ? ctx.requireProfile : (_businessId: string, run: () => void) => run();
}
