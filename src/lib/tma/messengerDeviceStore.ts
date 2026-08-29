"use client";

/**
 * Messenger's `getContext()`/`signed_request` identity turned out to be
 * unreliable in practice (Facebook-side `-32603`/`2071011` errors that never
 * resolved, on top of only rarely handing back a real name) — so the
 * Messenger Mini App now asks the customer for their own name and phone once
 * per device instead, and remembers them here rather than relying on
 * anything Facebook gives us.
 *
 * Deliberately `localStorage`, not the `sessionStorage` `tmaSession` uses:
 * the whole point is to recognize the same device again days later without
 * asking a second time, which sessionStorage (cleared when the tab closes)
 * can't do. The device id is shared across every shop on this device; the
 * session (token, name, phone) is kept per business, since registering with
 * one shop's Mini App doesn't imply consent to be identified at another.
 */

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
    // Private browsing / storage disabled — a fresh id every call means
    // re-registering every time, but the Mini App still works.
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
