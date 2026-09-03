"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    selectAuthStatus,
    selectIsAuthenticated,
    selectUser,
    signedOut,
} from "@/features/auth/authSlice";
import { cartApi } from "@/features/cart/cartApi";
import { userApi } from "@/features/user/userApi";
import { clearClientCookies } from "@/lib/auth/keycloak";
import { hasTmaSessionToken } from "@/lib/tma/tmaAuthHeader";

export function useAuth() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const reduxStatus = useAppSelector(selectAuthStatus);
    const reduxIsAuthenticated = useAppSelector(selectIsAuthenticated);

    // A Telegram Mini App shopper is authenticated via a bearer token in
    // sessionStorage, never the httpOnly cookie the normal OAuth login sets
    // — so the regular session check always comes back unauthenticated for
    // them. Read on mount only (client-only value, same pattern as
    // useIsTma) to avoid a hydration mismatch.
    const [tmaAuthenticated, setTmaAuthenticated] = useState(false);
    useEffect(() => {
        setTmaAuthenticated(hasTmaSessionToken());
    }, []);

    const isAuthenticated = reduxIsAuthenticated || tmaAuthenticated;
    const status = tmaAuthenticated ? "authenticated" : reduxStatus;

    const pathname = usePathname() || "/";

    const isAuthPath = pathname.startsWith("/register") || pathname.startsWith("/login");
    const defaultReturnTo = isAuthPath ? "/store" : pathname;

    const loginHref = `/api/auth/login?prompt=login&returnTo=${encodeURIComponent(defaultReturnTo)}`;
    const logoutHref = "/api/auth/logout?returnTo=%2Fstore";

    const login = useCallback((targetPath?: string | unknown, idp?: "google" | "facebook") => {
        let returnTo = typeof targetPath === "string" ? targetPath : undefined;
        if (!returnTo) {
            const currentPath = typeof window === "undefined" ? pathname : window.location.pathname;
            returnTo = (currentPath.startsWith("/register") || currentPath.startsWith("/login"))
                ? "/store"
                : currentPath + (typeof window === "undefined" ? "" : window.location.search);
        }

        const params = new URLSearchParams({ returnTo, prompt: "login" });
        if (idp) {
            params.set("idp", idp);
        }

        window.location.href = `/api/auth/login?${params.toString()}`;
    }, [pathname]);

    const logout = useCallback(() => {
        dispatch(signedOut());
        dispatch(cartApi.util.resetApiState());
        dispatch(userApi.util.resetApiState());

        clearClientCookies();

        window.location.href = logoutHref;
    }, [logoutHref, dispatch]);

    return { user, status, isAuthenticated, loginHref, logoutHref, login, logout };
}