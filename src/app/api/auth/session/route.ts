
import { NextResponse, type NextRequest } from "next/server";

import type { SessionResponse } from "@/lib/type/authType";
import {
    COOKIE,
    clearSessionCookies,
    refreshTokens,
    setSessionCookies,
    tokenExpiresAt,
    userFromAccessToken,
} from "@/lib/auth/keycloak";

export const dynamic = "force-dynamic";

const ANONYMOUS: SessionResponse = {
    authenticated: false,
    user: null,
    accessToken: null,
    expiresAt: null,
};

const SKEW_MS = 30_000;

export async function GET(request: NextRequest) {
    const accessToken = request.cookies.get(COOKIE.access)?.value;
    const refreshToken = request.cookies.get(COOKIE.refresh)?.value;

    const expiresAt = accessToken ? tokenExpiresAt(accessToken) : null;
    const stillValid = !!expiresAt && expiresAt - SKEW_MS > Date.now();

    if (accessToken && stillValid) {
        return NextResponse.json<SessionResponse>({
            authenticated: true,
            user: userFromAccessToken(accessToken),
            accessToken,
            expiresAt,
        });
    }

    if (!refreshToken) {
        return NextResponse.json<SessionResponse>(ANONYMOUS);
    }

    try {
        const tokens = await refreshTokens(refreshToken);

        const response = NextResponse.json<SessionResponse>({
            authenticated: true,
            user: userFromAccessToken(tokens.access_token),
            accessToken: tokens.access_token,
            expiresAt: tokenExpiresAt(tokens.access_token),
        });

        return setSessionCookies(response, tokens);
    } catch (error) {
        console.error("[auth/session] refresh failed", error);
        return clearSessionCookies(NextResponse.json<SessionResponse>(ANONYMOUS));
    }
}