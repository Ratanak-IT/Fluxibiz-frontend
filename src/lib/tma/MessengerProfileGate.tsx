"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

import { useGetMyCustomerProfileQuery } from "@/features/checkout/checkoutApi";
import { MessengerProfilePrompt } from "@/components/tma/MessengerProfilePrompt";

type PendingAction = { businessId: string; run: () => void };

const MessengerProfileGateContext = createContext<{
  requireProfile: (businessId: string, run: () => void) => void;
} | null>(null);

/**
 * Gates "Add to cart" and "Pay" inside the Messenger Mini App on having a
 * real name and phone number on file — mounted once around the whole Mini
 * App (in MessengerWebAppProvider's "ready" branch) so every page that adds
 * to cart or checks out shares the same prompt instead of each duplicating
 * this check. Outside Messenger, `useRequireMessengerProfile` degrades to a
 * plain passthrough (see below), so call sites don't need to branch on
 * channel themselves.
 */
export function MessengerProfileGateProvider({ children }: { children: ReactNode }) {
  const { data: myProfile } = useGetMyCustomerProfileQuery();
  const [pending, setPending] = useState<PendingAction | null>(null);

  const hasProfile = Boolean(
    myProfile?.phoneNumber &&
      myProfile?.fullName &&
      myProfile.fullName !== "Facebook User"
  );

  const requireProfile = useCallback(
    (businessId: string, run: () => void) => {
      if (hasProfile) {
        run();
        return;
      }
      setPending({ businessId, run });
    },
    [hasProfile]
  );

  return (
    <MessengerProfileGateContext.Provider value={{ requireProfile }}>
      {children}
      {pending && (
        <MessengerProfilePrompt
          open
          businessId={pending.businessId}
          defaultName={myProfile?.fullName ?? undefined}
          onOpenChange={(open) => {
            if (!open) setPending(null);
          }}
          onSaved={() => {
            const run = pending.run;
            setPending(null);
            run();
          }}
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
