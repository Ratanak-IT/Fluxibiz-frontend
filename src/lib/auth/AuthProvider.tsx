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

import {
  cleanOidcParams,
  clearStoredSession,
  exchangeCodeForSession,
  fetchUserProfile,
  getStoredTokens,
  getStoredUser,
  hasUsableAccessToken,
  redirectToKeycloakLogin,
  redirectToKeycloakLogout,
  storeSession,
  type AuthTokens,
  type AuthUser,
} from "@/lib/auth/keycloak";

type AuthContextValue = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const currentUrl = new URL(window.location.href);
        const code = currentUrl.searchParams.get("code");
        const state = currentUrl.searchParams.get("state");

        if (code && state) {
          const session = await exchangeCodeForSession(code, state);

          if (!isMounted) {
            return;
          }

          setTokens(session.tokens);
          setUser(session.user);
          window.history.replaceState(
            null,
            "",
            cleanOidcParams(currentUrl).toString(),
          );
          return;
        }

        const storedTokens = getStoredTokens();

        if (!hasUsableAccessToken(storedTokens)) {
          clearStoredSession();
          return;
        }

        const storedUser = getStoredUser();
        const profile = storedUser || (await fetchUserProfile(storedTokens));

        if (!isMounted) {
          return;
        }

        setTokens(storedTokens);
        setUser(profile);
        storeSession(storedTokens, profile);
      } catch (error) {
        console.error(error);
        clearStoredSession();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async () => {
    await redirectToKeycloakLogin();
  }, []);

  const logout = useCallback(() => {
    redirectToKeycloakLogout(tokens);
  }, [tokens]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      isAuthenticated: Boolean(user && tokens),
      user,
      login,
      logout,
    }),
    [isLoading, login, logout, tokens, user],
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
