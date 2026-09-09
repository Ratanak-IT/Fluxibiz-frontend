"use client";


const STORAGE_KEY = "tma:session";

export interface TmaSession {
  token: string;
  refreshToken: string;
  businessId: string;
  businessSlug: string;
  customerId: string;
  fullName: string;
  photoUrl?: string;
  phoneNumber?: string;
  email?: string;
  gender?: string;
  address?: string;
}

let cached: TmaSession | null = null;

export function getTmaSession(): TmaSession | null {
  if (cached) return cached;
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    cached = JSON.parse(raw) as TmaSession;
    return cached;
  } catch {
    return null;
  }
}

export function setTmaSession(session: TmaSession): void {
  cached = session;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Private browsing / storage disabled — session just won't survive a reload.
  }
}

export function updateTmaSession(partial: Partial<TmaSession>): void {
  const current = getTmaSession();
  if (!current) return;
  setTmaSession({ ...current, ...partial });
}

export function clearTmaSession(): void {
  cached = null;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}
