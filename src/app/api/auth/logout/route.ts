import { NextResponse, type NextRequest } from "next/server";

import {
  appOrigin,
  clearSessionCookies,
  safeReturnTo,
} from "@/lib/auth/keycloak";

export const dynamic = "force-dynamic";

function buildLogout(request: NextRequest) {
  const origin = appOrigin(request.nextUrl.origin, request.headers);
  const returnTo = safeReturnTo(request.nextUrl.searchParams.get("returnTo"));
  const postLogoutRedirectUri = `${origin}${returnTo}`;

  const response = NextResponse.redirect(postLogoutRedirectUri);
  return clearSessionCookies(response);
}

export async function GET(request: NextRequest) {
  return buildLogout(request);
}

export async function POST(request: NextRequest) {
  return buildLogout(request);
}