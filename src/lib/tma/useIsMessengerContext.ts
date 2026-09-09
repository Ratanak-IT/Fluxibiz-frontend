"use client";

import { useEffect, useState } from "react";

import { useIsMessenger } from "@/lib/tma/useIsMessenger";
import { getDeviceSession } from "@/lib/tma/messengerDeviceStore";
import { setTmaSession } from "@/lib/tma/tmaSession";


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
