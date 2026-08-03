"use client";

import { useCallback } from "react";
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

export function useAuth() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const status = useAppSelector(selectAuthStatus);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const pathname = usePathname() || "/";

    const isAuthPath = pathname.startsWith("/register") || pathname.startsWith("/login");
    const defaultReturnTo = isAuthPath ? "/store" : pathname;

    const loginHref = `/api/auth/login?prompt=login&returnTo=${encodeURIComponent(defaultReturnTo)}`;
    const logoutHref = "/api/auth/logout?returnTo=%2Fstore";

    const login = useCallback((targetPath?: string | unknown) => {
        let returnTo = typeof targetPath === "string" ? targetPath : undefined;
        if (!returnTo) {
            const currentPath = typeof window === "undefined" ? pathname : window.location.pathname;
            returnTo = (currentPath.startsWith("/register") || currentPath.startsWith("/login"))
                ? "/store"
                : currentPath + (typeof window === "undefined" ? "" : window.location.search);
        }

        window.location.href = `/api/auth/login?prompt=login&returnTo=${encodeURIComponent(returnTo)}`;
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