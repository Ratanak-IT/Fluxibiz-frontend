

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
  userFromAccessToken,
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

    const user = userFromAccessToken(tokens.access_token);
    const roles = user?.roles || [];

    const superAdminRedirect = process.env.SUPER_ADMIN_REDIRECT_URL;
    const businessRedirect = process.env.BUSINESS_REDIRECT_URL;
    const globleUserRedirect = process.env.GLOBLE_USER_REDIRECT_URL;

    // Business and Super Admin accounts are routed straight to their own
    // dashboard app, which manages its own session — this storefront must
    // never also hand them a customer session cookie here. Without this,
    // the storefront's own domain still ends up "logged in" as that
    // business/admin account (its cookies were set right before the
    // external redirect fired), even though the shopper-facing storefront
    // was never the account's actual destination.
    let targetUrl: URL;
    let shouldSetStorefrontSession = true;
    if ((roles.includes("SUPER_ADMIN") || roles.includes("GLOBLE_ADMIN")) && superAdminRedirect) {
      targetUrl = new URL(superAdminRedirect);
      shouldSetStorefrontSession = false;
    } else if (roles.includes("BUSINESS") && businessRedirect) {
      targetUrl = new URL(businessRedirect);
      shouldSetStorefrontSession = false;
    } else if (roles.includes("GLOBLE_USER") && globleUserRedirect) {
      targetUrl = new URL(globleUserRedirect);
    } else {
      targetUrl = new URL(returnTo, origin);
    }

    const res = NextResponse.redirect(targetUrl);
    if (shouldSetStorefrontSession) {
      setSessionCookies(res, tokens);
    }

    return clearTransient(res);
  } catch (err) {
    console.error("[auth/callback] token exchange failed:", err);
    const targetUrl = new URL(returnTo, origin);
    targetUrl.searchParams.set("error", "auth_failed");
    return clearTransient(NextResponse.redirect(targetUrl));
  }
}