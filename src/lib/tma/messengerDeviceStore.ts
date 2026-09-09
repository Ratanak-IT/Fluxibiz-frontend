"use client";



const DEVICE_ID_KEY = "messenger_device_id";
const SESSION_KEY_PREFIX = "messenger_device_session:";

export interface MessengerDeviceSession {
  token: string;
  refreshToken: string;
  businessId: string;
  businessSlug: string;
  customerId: string;
  fullName: string;
  phoneNumber: string;
}

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return randomId();

  try {
    const existing = window.localStorage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;

    const created = randomId();
    window.localStorage.setItem(DEVICE_ID_KEY, created);
    return created;
  } catch {

    return randomId();
  }
}

export function getDeviceSession(businessId: string): MessengerDeviceSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SESSION_KEY_PREFIX + businessId);
    if (!raw) return null;
    return JSON.parse(raw) as MessengerDeviceSession;
  } catch {
    return null;
  }
}

export function setDeviceSession(businessId: string, session: MessengerDeviceSession): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(SESSION_KEY_PREFIX + businessId, JSON.stringify(session));
  } catch {
    // Session just won't survive a reload.
  }
}


export async function reissueMessengerDeviceToken(
  businessId: string,
  businessSlug?: string,
): Promise<MessengerDeviceSession | null> {
  const existing = getDeviceSession(businessId);
  if (!existing) return null;

  try {
    const res = await fetch("/api/v1/facebook-webapp/device-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessId,
        deviceId: getOrCreateDeviceId(),
        fullName: existing.fullName,
        phoneNumber: existing.phoneNumber,
      }),
    });
    if (!res.ok) return null;

    const data = await res.json();
    const refreshed: MessengerDeviceSession = {
      token: data.token,
      refreshToken: data.refreshToken,
      businessId: data.businessId ?? businessId,
      businessSlug: data.businessSlug ?? businessSlug ?? existing.businessSlug,
      customerId: data.customerId ?? existing.customerId,
      fullName: data.fullName ?? existing.fullName,
      phoneNumber: data.phoneNumber ?? existing.phoneNumber,
    };
    setDeviceSession(businessId, refreshed);
    return refreshed;
  } catch {
    return null;
  }
}
