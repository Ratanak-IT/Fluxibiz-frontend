

import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import {
  COOKIE,
  appOrigin,
  exchangeCodeForTokens,
  redirectUri,
  safeReturnTo,
  setSessionCookies,
  TRANSIENT_COOKIE,
} from "@/lib/auth/keycloak";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const origin = appOrigin(req.nextUrl.origin, req.headers);
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const savedState = cookieStore.get(COOKIE.state)?.value;
  const verifier = cookieStore.get(COOKIE.verifier)?.value;
  const returnTo = safeReturnTo(cookieStore.get(COOKIE.returnTo)?.value);

  const clearTransient = (res: NextResponse) => {
    res.cookies.set(COOKIE.verifier, "", { ...TRANSIENT_COOKIE, maxAge: 0 });
    res.cookies.set(COOKIE.state, "", { ...TRANSIENT_COOKIE, maxAge: 0 });
    res.cookies.set(COOKIE.returnTo, "", { ...TRANSIENT_COOKIE, maxAge: 0 });
    return res;
  };

  if (!code || !state || state !== savedState || !verifier) {
    const targetUrl = new URL(returnTo, origin);
    targetUrl.searchParams.set("error", "invalid_state");
    return clearTransient(NextResponse.redirect(targetUrl));
  }

  try {
    const tokens = await exchangeCodeForTokens(
      code,
      redirectUri(origin, req.headers),
      verifier
    );

    const targetUrl = new URL(returnTo, origin);
    const res = NextResponse.redirect(targetUrl);
    setSessionCookies(res, tokens);

    return clearTransient(res);
  } catch (err) {
    console.error("[auth/callback] token exchange failed:", err);
    const targetUrl = new URL(returnTo, origin);
    targetUrl.searchParams.set("error", "auth_failed");
    return clearTransient(NextResponse.redirect(targetUrl));
  }
}