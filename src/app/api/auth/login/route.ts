import { NextResponse, type NextRequest } from "next/server";
import {
  KC_ENDPOINTS,
  CLIENT_ID,
  COOKIE,
  TRANSIENT_COOKIE,
  pkceChallenge,
  randomUrlSafe,
  redirectUri,
  safeReturnTo,
  appOrigin,
} from "@/lib/auth/keycloak";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const origin = appOrigin(req.nextUrl.origin, req.headers);
  const returnTo = safeReturnTo(req.nextUrl.searchParams.get("returnTo"));
  const prompt = req.nextUrl.searchParams.get("prompt") || "login";

  const verifier = randomUrlSafe();
  const state = randomUrlSafe();
  const challenge = await pkceChallenge(verifier);

  const idpParam = req.nextUrl.searchParams.get("idp");
  const idp = idpParam === "google" || idpParam === "facebook" ? idpParam : null;

  const queryObj: Record<string, string> = {
    client_id: CLIENT_ID,
    response_type: "code",
    scope: "openid profile email",
    redirect_uri: redirectUri(origin, req.headers),
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  };

  if (idp) {
    queryObj.kc_idp_hint = idp;
  } else if (prompt) {
    queryObj.prompt = prompt;
  }

  const params = new URLSearchParams(queryObj);

  const res = NextResponse.redirect(`${KC_ENDPOINTS.authorize}?${params}`);

  res.cookies.set(COOKIE.verifier, verifier, TRANSIENT_COOKIE);
  res.cookies.set(COOKIE.state, state, TRANSIENT_COOKIE);
  res.cookies.set(COOKIE.returnTo, returnTo, TRANSIENT_COOKIE);

  return res;
}