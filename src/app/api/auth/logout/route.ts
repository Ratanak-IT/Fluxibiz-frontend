
import { NextResponse, type NextRequest } from "next/server";

import {
    CLIENT_ID,
    COOKIE,
    KC_ENDPOINTS,
    appOrigin,
    clearSessionCookies,
    safeReturnTo,
} from "@/lib/auth/keycloak";

export const dynamic = "force-dynamic";

function buildLogout(request: NextRequest) {
    const origin = appOrigin(request.nextUrl.origin);
    const returnTo = safeReturnTo(request.nextUrl.searchParams.get("returnTo"));
    const idToken = request.cookies.get(COOKIE.idToken)?.value;

    const logout = new URL(KC_ENDPOINTS.logout);
    logout.searchParams.set("client_id", CLIENT_ID);
    logout.searchParams.set("post_logout_redirect_uri", new URL(returnTo, origin).toString());
    if (idToken) logout.searchParams.set("id_token_hint", idToken);

    return clearSessionCookies(NextResponse.redirect(logout));
}

export async function GET(request: NextRequest) {
    return buildLogout(request);
}

export async function POST(request: NextRequest) {
    return buildLogout(request);
}