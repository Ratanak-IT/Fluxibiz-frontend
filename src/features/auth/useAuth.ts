"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";

import { useAppSelector } from "@/store/hooks";
import {
    selectAuthStatus,
    selectIsAuthenticated,
    selectUser,
} from "@/features/auth/authSlice";


export function useAuth() {
    const user = useAppSelector(selectUser);
    const status = useAppSelector(selectAuthStatus);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const pathname = usePathname() || "/";

    const loginHref = `/api/auth/login?returnTo=${encodeURIComponent(pathname)}`;
    const logoutHref = "/api/auth/logout?returnTo=%2F";

    const login = useCallback(() => {
        const returnTo =
            typeof window === "undefined"
                ? pathname
                : window.location.pathname + window.location.search;

        window.location.href = `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
    }, [pathname]);

    const logout = useCallback(() => {
        window.location.href = logoutHref;
    }, [logoutHref]);

    return { user, status, isAuthenticated, loginHref, logoutHref, login, logout };
}