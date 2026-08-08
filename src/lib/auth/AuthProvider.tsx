"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SessionUser } from "@/lib/type/authType";
import { clearClientCookies } from "@/lib/auth/keycloak";

type AuthContextValue = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: SessionUser | null;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSession();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchSession]);

  const login = useCallback(() => {
    window.location.href = "/api/auth/login";
  }, []);

  const logout = useCallback(() => {
    clearClientCookies();
    window.location.href = "/api/auth/logout";
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      isAuthenticated: Boolean(user),
      user,
      login,
      logout,
    }),
    [isLoading, login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}