import type { NextResponse } from "next/server";
import type { SessionUser } from "@/lib/type/authType";

const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL!;
const REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM!;

export const CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!;
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET ?? "";

const OIDC = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect`;

export const KC_ENDPOINTS = {
    authorize: `${OIDC}/auth`,
    token: `${OIDC}/token`,
    logout: `${OIDC}/logout`,
    userinfo: `${OIDC}/userinfo`,
    account: `${KEYCLOAK_URL}/realms/${REALM}/account`,
} as const;

export const COOKIE = {
    access: "kc_at",
    refresh: "kc_rt",
    idToken: "kc_it",
    verifier: "kc_pkce_verifier",
    state: "kc_state",
    returnTo: "kc_return_to",
} as const;

const SECURE = process.env.NODE_ENV === "production";

const BASE_COOKIE = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: SECURE,
    path: "/",
};

export const TRANSIENT_COOKIE = { ...BASE_COOKIE, maxAge: 60 * 10 };

export function appOrigin(requestOrigin?: string, reqHeaders?: Headers) {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
    }
    if (reqHeaders) {
        const host = reqHeaders.get("x-forwarded-host") || reqHeaders.get("host");
        const proto = reqHeaders.get("x-forwarded-proto") || "http";
        if (host) {
            return `${proto}://${host}`.replace(/\/$/, "");
        }
    }
    return requestOrigin ? requestOrigin.replace(/\/$/, "") : "";
}

export function redirectUri(requestOrigin?: string, reqHeaders?: Headers) {
    return `${appOrigin(requestOrigin, reqHeaders)}/api/auth/callback`;
}

export function safeReturnTo(value: string | null | undefined) {
    if (!value) return "/store";
    if (!value.startsWith("/") || value.startsWith("//")) return "/store";
    if (value.startsWith("/register") || value.startsWith("/login")) return "/store";
    return value;
}

function base64url(input: ArrayBuffer | Uint8Array) {
    const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
    return Buffer.from(bytes).toString("base64url");
}

export function randomUrlSafe(bytes = 48) {
    return base64url(crypto.getRandomValues(new Uint8Array(bytes)));
}

export async function pkceChallenge(verifier: string) {
    const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(verifier),
    );
    return base64url(digest);
}

export type KeycloakTokens = {
    access_token: string;
    refresh_token?: string;
    id_token?: string;
    expires_in: number;
    refresh_expires_in?: number;
    token_type: string;
};

async function postToken(fields: Record<string, string>) {
    const body = new URLSearchParams({ client_id: CLIENT_ID, ...fields });
    if (CLIENT_SECRET) body.set("client_secret", CLIENT_SECRET);

    const res = await fetch(KC_ENDPOINTS.token, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Keycloak token request failed (${res.status}): ${await res.text()}`);
    }

    return (await res.json()) as KeycloakTokens;
}

export function exchangeCodeForTokens(
    code: string,
    redirect: string,
    codeVerifier: string,
) {
    return postToken({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirect,
        code_verifier: codeVerifier,
    });
}

export function refreshTokens(refreshToken: string) {
    return postToken({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    });
}

type AccessTokenClaims = {
    sub: string;
    exp: number;
    email?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    preferred_username?: string;
    picture?: string;
    realm_access?: { roles?: string[] };
};

export function decodeJwt<T = AccessTokenClaims>(token: string): T | null {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as T;
    } catch {
        return null;
    }
}

export function tokenExpiresAt(accessToken: string) {
    const claims = decodeJwt(accessToken);
    return claims?.exp ? claims.exp * 1000 : null;
}

export function userFromAccessToken(accessToken: string): SessionUser | null {
    const c = decodeJwt(accessToken);
    if (!c?.sub) return null;

    const fullName =
        c.name ?? [c.given_name, c.family_name].filter(Boolean).join(" ").trim();

    return {
        id: c.sub,
        username: c.preferred_username ?? "",
        email: c.email ?? "",
        name: fullName || c.preferred_username || c.email || "FluxiBiz user",
        firstName: c.given_name,
        lastName: c.family_name,
        image: c.picture,
        roles: c.realm_access?.roles ?? [],
    };
}

export function setSessionCookies(res: NextResponse, tokens: KeycloakTokens) {
    res.cookies.set(COOKIE.access, tokens.access_token, {
        ...BASE_COOKIE,
        maxAge: tokens.expires_in,
    });

    if (tokens.refresh_token) {
        res.cookies.set(COOKIE.refresh, tokens.refresh_token, {
            ...BASE_COOKIE,
            maxAge: tokens.refresh_expires_in ?? 60 * 60 * 24 * 30,
        });
    }

    if (tokens.id_token) {
        res.cookies.set(COOKIE.idToken, tokens.id_token, {
            ...BASE_COOKIE,
            maxAge: tokens.refresh_expires_in ?? 60 * 60 * 24 * 30,
        });
    }

    return res;
}

export function clearClientCookies() {
    if (typeof document === "undefined") return;

    const cookieNames = Array.from(
        new Set([
            "kc_at",
            "kc_rt",
            "kc_it",
            "kc_pkce_verifier",
            "kc_state",
            "kc_return_to",
            ...Object.values(COOKIE),
        ])
    );

    const host = typeof window !== "undefined" ? window.location.hostname : "";

    for (const name of cookieNames) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
        if (host) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${host};`;
        }
    }

    if (document.cookie) {
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
            if (name) {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
                if (host) {
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${host};`;
                }
            }
        }
    }
}

export function clearSessionCookies(res: NextResponse) {
    const cookieNames = Array.from(
        new Set([
            "kc_at",
            "kc_rt",
            "kc_it",
            "kc_pkce_verifier",
            "kc_state",
            "kc_return_to",
            ...Object.values(COOKIE),
        ])
    );

    for (const name of cookieNames) {
        try {
            res.cookies.delete(name);
        } catch {
            // Ignore native delete error
        }

        try {
            res.cookies.set(name, "", {
                httpOnly: true,
                sameSite: "lax",
                secure: SECURE,
                path: "/",
                maxAge: 0,
                expires: new Date(0),
            });
        } catch {
            // Ignore cookie set error
        }
    }
    return res;
}


export function buildAuthorizeUrl(params: {
  redirectUri: string;
  state: string;
  codeChallenge: string;
  idpHint?: "google" | "facebook";
}) {
  const url = new URL(KC_ENDPOINTS.authorize);
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid profile email");
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("state", params.state);
  url.searchParams.set("code_challenge", params.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  if (params.idpHint) {
    url.searchParams.set("kc_idp_hint", params.idpHint);
  }

  return url.toString();
}