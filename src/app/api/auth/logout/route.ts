import { NextResponse, type NextRequest } from "next/server";

import {
  appOrigin,
  clearSessionCookies,
  safeReturnTo,
  KC_ENDPOINTS,
  CLIENT_ID,
  COOKIE,
} from "@/lib/auth/keycloak";

export const dynamic = "force-dynamic";

function buildLogout(request: NextRequest) {
  const origin = appOrigin(request.nextUrl.origin, request.headers);
  const returnTo = safeReturnTo(request.nextUrl.searchParams.get("returnTo"));
  const postLogoutRedirectUri = `${origin}${returnTo}`;

  const idToken = request.cookies.get(COOKIE.idToken)?.value;

  let redirectTarget = postLogoutRedirectUri;

  if (idToken && idToken.trim()) {
    try {
      const keycloakLogoutUrl = new URL(KC_ENDPOINTS.logout);
      keycloakLogoutUrl.searchParams.set("id_token_hint", idToken.trim());
      keycloakLogoutUrl.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);
      keycloakLogoutUrl.searchParams.set("client_id", CLIENT_ID);
      redirectTarget = keycloakLogoutUrl.toString();
    } catch {
      redirectTarget = postLogoutRedirectUri;
    }
  }

  const response = NextResponse.redirect(redirectTarget);
  return clearSessionCookies(response);
}

export async function GET(request: NextRequest) {
  return buildLogout(request);
}

export async function POST(request: NextRequest) {
  return buildLogout(request);
}