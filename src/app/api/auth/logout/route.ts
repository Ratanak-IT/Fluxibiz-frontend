import { NextResponse, type NextRequest } from "next/server";

import {
  appOrigin,
  clearSessionCookies,
  safeReturnTo,
} from "@/lib/auth/keycloak";

export const dynamic = "force-dynamic";

function buildLogout(request: NextRequest) {
  const origin = appOrigin(request.nextUrl.origin);
  const returnTo = safeReturnTo(request.nextUrl.searchParams.get("returnTo"));
  const targetUrl = new URL(returnTo, origin);

  // Clear local session cookies and redirect directly to application home/store without sending user to Keycloak page
  const response = NextResponse.redirect(targetUrl);
  return clearSessionCookies(response);
}

export async function GET(request: NextRequest) {
  return buildLogout(request);
}

export async function POST(request: NextRequest) {
  return buildLogout(request);
}