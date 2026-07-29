
import { NextResponse, type NextRequest } from "next/server";

import {
    CLIENT_ID,
    COOKIE,
    KC_ENDPOINTS,
    TRANSIENT_COOKIE,
    pkceChallenge,
    randomUrlSafe,
    redirectUri,
    safeReturnTo,
} from "@/lib/auth/keycloak";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const returnTo = safeReturnTo(request.nextUrl.searchParams.get("returnTo"));

    const verifier = randomUrlSafe(48);
    const challenge = await pkceChallenge(verifier);
    const state = randomUrlSafe(24);

    const authorize = new URL(KC_ENDPOINTS.authorize);
    authorize.searchParams.set("client_id", CLIENT_ID);
    authorize.searchParams.set("redirect_uri", redirectUri(request.nextUrl.origin));
    authorize.searchParams.set("response_type", "code");
    authorize.searchParams.set("scope", "openid profile email");
    authorize.searchParams.set("state", state);
    authorize.searchParams.set("code_challenge", challenge);
    authorize.searchParams.set("code_challenge_method", "S256");
    const response = NextResponse.redirect(authorize);
    response.cookies.set(COOKIE.verifier, verifier, TRANSIENT_COOKIE);
    response.cookies.set(COOKIE.state, state, TRANSIENT_COOKIE);
    response.cookies.set(COOKIE.returnTo, returnTo, TRANSIENT_COOKIE);

    return response;
}