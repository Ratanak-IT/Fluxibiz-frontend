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

  // Build Keycloak end-session URL to invalidate Keycloak SSO session as well
  const keycloakLogoutUrl = new URL(KC_ENDPOINTS.logout);
  if (idToken) {
    keycloakLogoutUrl.searchParams.set("id_token_hint", idToken);
  }
  keycloakLogoutUrl.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);
  keycloakLogoutUrl.searchParams.set("client_id", CLIENT_ID);

  // Clear local session cookies (kc_at, kc_rt, kc_it) and redirect to Keycloak end-session
  const response = NextResponse.redirect(keycloakLogoutUrl.toString());
  return clearSessionCookies(response);
}

export async function GET(request: NextRequest) {
  return buildLogout(request);
}

export async function POST(request: NextRequest) {
  return buildLogout(request);
}