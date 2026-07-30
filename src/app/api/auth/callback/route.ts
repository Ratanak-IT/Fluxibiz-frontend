

// import { NextResponse, type NextRequest } from "next/server";

// import {
//     COOKIE,
//     appOrigin,
//     clearSessionCookies,
//     exchangeCodeForTokens,
//     redirectUri,
//     safeReturnTo,
//     setSessionCookies,
//     TRANSIENT_COOKIE,
// } from "@/lib/auth/keycloak";

// export const dynamic = "force-dynamic";

// export async function GET(request: NextRequest) {
//     const origin = appOrigin(request.nextUrl.origin);
//     const params = request.nextUrl.searchParams;

//     const returnTo = safeReturnTo(request.cookies.get(COOKIE.returnTo)?.value);
//     const verifier = request.cookies.get(COOKIE.verifier)?.value;
//     const expectedState = request.cookies.get(COOKIE.state)?.value;

//     const dropTransient = (res: NextResponse) => {
//         res.cookies.set(COOKIE.verifier, "", { ...TRANSIENT_COOKIE, maxAge: 0 });
//         res.cookies.set(COOKIE.state, "", { ...TRANSIENT_COOKIE, maxAge: 0 });
//         res.cookies.set(COOKIE.returnTo, "", { ...TRANSIENT_COOKIE, maxAge: 0 });
//         return res;
//     };

//     const fail = (reason: string) => {
//         const url = new URL(returnTo, origin);
//         url.searchParams.set("auth_error", reason);
//         return dropTransient(clearSessionCookies(NextResponse.redirect(url)));
//     };

//     // Keycloak reported an error (user cancelled, consent denied, ...)
//     if (params.get("error")) return fail(params.get("error")!);

//     const code = params.get("code");
//     if (!code || !verifier) return fail("missing_code");

//     // CSRF check
//     if (!expectedState || params.get("state") !== expectedState) {
//         return fail("state_mismatch");
//     }

//     try {
//         const tokens = await exchangeCodeForTokens(
//             code,
//             redirectUri(request.nextUrl.origin),
//             verifier,
//         );

//         const response = NextResponse.redirect(new URL(returnTo, origin));
//         setSessionCookies(response, tokens);
//         return dropTransient(response);
//     } catch (error) {
//         console.error("[auth/callback] token exchange failed", error);
//         return fail("token_exchange_failed");
//     }
// }

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  COOKIE,
  exchangeCodeForTokens,
  redirectUri,
  setSessionCookies,
} from "@/lib/auth/keycloak";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const savedState = cookieStore.get(COOKIE.state)?.value;
  const verifier = cookieStore.get(COOKIE.verifier)?.value;

  if (!code || !state || state !== savedState || !verifier) {
    return NextResponse.redirect(new URL("/?error=invalid_state", req.url));
  }

  try {
    const tokens = await exchangeCodeForTokens(
      code,
      redirectUri(url.origin),
      verifier
    );

    const res = NextResponse.redirect(new URL("/", req.url));
    setSessionCookies(res, tokens);

    res.cookies.set(COOKIE.verifier, "", { maxAge: 0 });
    res.cookies.set(COOKIE.state, "", { maxAge: 0 });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(new URL("/?error=auth_failed", req.url));
  }
}