"use client";

import { useEffect, useState } from "react";

import { useIsMessenger } from "@/lib/tma/useIsMessenger";
import { getDeviceSession } from "@/lib/tma/messengerDeviceStore";
import { setTmaSession } from "@/lib/tma/tmaSession";

/**
 * `useIsMessenger()`'s `?messenger=true`/sessionStorage flag — and the
 * `tmaSession` bearer token, also sessionStorage — don't reliably survive
 * Messenger tearing down and recreating its embedded webview between
 * separate opens (common on mobile; unlike localStorage, sessionStorage
 * isn't guaranteed to persist across that). Without this, a device that
 * registered once would look like a brand-new, unauthenticated web visitor
 * on its second open — falling through to the regular Keycloak OAuth check
 * and getting redirected to a login page it has no way to use.
 *
 * A saved `messengerDeviceStore` session for this exact business is durable
 * proof this device already registered here before, regardless of what the
 * ephemeral flag says on this particular page load — so this also
 * re-hydrates `tmaSession` from it, fixing the token along with the flag.
 */
export function useIsMessengerContext(businessId?: string | null): boolean {
  const isMessenger = useIsMessenger();
  const [hasDeviceSession, setHasDeviceSession] = useState(false);

  useEffect(() => {
    if (!businessId) return;

    const existing = getDeviceSession(businessId);
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
  }, [businessId]);

  return isMessenger || hasDeviceSession;
}
