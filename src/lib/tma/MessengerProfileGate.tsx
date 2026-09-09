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


export function useRequireMessengerProfile() {
  const ctx = useContext(MessengerProfileGateContext);
  return ctx ? ctx.requireProfile : (_businessId: string, run: () => void) => run();
}
