// NEW FILE — src/components/common/AuthProvider.tsx
"use client";

import { useEffect, type ReactNode } from "react";

import { useGetSessionQuery } from "@/features/auth/sessionApi";
import { profileLoaded, sessionLoaded } from "@/features/auth/authSlice";
import { useGetMyProfileQuery } from "@/features/user/userApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function AuthProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();

    const { data: session, refetch } = useGetSessionQuery();

    const accessToken = useAppSelector((s) => s.auth.accessToken);
    const expiresAt = useAppSelector((s) => s.auth.expiresAt);

    useEffect(() => {
        if (session) dispatch(sessionLoaded(session));
    }, [session, dispatch]);

    useEffect(() => {
        if (!expiresAt) return;

        const delay = Math.max(expiresAt - Date.now() - 60_000, 5_000);
        const timer = setTimeout(() => refetch(), delay);

        return () => clearTimeout(timer);
    }, [expiresAt, refetch]);

    useEffect(() => {
        const onFocus = () => refetch();
        window.addEventListener("focus", onFocus);
        return () => window.removeEventListener("focus", onFocus);
    }, [refetch]);

    const { data: profile } = useGetMyProfileQuery(undefined, {
        skip: !accessToken,
    });

    useEffect(() => {
        if (!profile) return;

        const name = [profile.firstName, profile.lastName]
            .filter(Boolean)
            .join(" ")
            .trim();

        dispatch(
            profileLoaded({
                ...(name ? { name } : {}),
                ...(profile.email ? { email: profile.email } : {}),
                ...(profile.username ? { username: profile.username } : {}),
                ...(profile.firstName ? { firstName: profile.firstName } : {}),
                ...(profile.lastName ? { lastName: profile.lastName } : {}),
                ...(profile.profilePicture ? { image: profile.profilePicture } : {}),
            }),
        );
    }, [profile, dispatch]);

    return <>{children}</>;
}