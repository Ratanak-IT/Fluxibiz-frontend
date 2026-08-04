import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, KC_ENDPOINTS, CLIENT_ID, setSessionCookies } from "@/lib/auth/keycloak";

const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET ?? "";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
    }

    const body = new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "password",
      username,
      password,
      scope: "openid profile email",
    });
    if (CLIENT_SECRET) {
      body.set("client_secret", CLIENT_SECRET);
    }

    const res = await fetch(KC_ENDPOINTS.token, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: "Authentication failed", details: errorText },
        { status: res.status }
      );
    }

    const tokens = await res.json();
    const response = NextResponse.json({ success: true, accessToken: tokens.access_token });
    setSessionCookies(response, tokens);

    return response;
  } catch (err: any) {
    console.error("[api/auth/direct-login] error:", err);
    return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 });
  }
}
