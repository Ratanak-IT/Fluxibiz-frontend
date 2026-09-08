"use client";

import { KC_ENDPOINTS, CLIENT_ID } from "@/lib/auth/keycloak";

const CHECK_TIMEOUT_MS = 3000;

// Browser-native (no Node `Buffer`) base64url — this module runs client-side,
// where Buffer isn't polyfilled.
function base64UrlEncode(bytes: Uint8Array) {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function pkcePair() {
    const verifierBytes = crypto.getRandomValues(new Uint8Array(32));
    const verifier = base64UrlEncode(verifierBytes);
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
    return base64UrlEncode(new Uint8Array(digest));
}

/**
 * Silently asks Keycloak (hidden iframe + prompt=none) whether the browser
 * already holds an SSO session for this realm from ANY client — not just
 * this one. A "yes" means clicking Login here would otherwise land on
 * Keycloak's "re-authenticate" screen (confirming the already-known
 * identity from the business/admin dashboard's session) instead of a fresh
 * login form — and that screen never offers social providers by Keycloak's
 * own design (`social.providers` comes back empty), no matter how the
 * theme or Identity Provider config is set up. So the caller routes through
 * a logout first only in that case.
 *
 * This client enforces PKCE on every authorize request — omitting
 * code_challenge here makes Keycloak reject the request before it ever
 * checks the session cookie, which looks identical to "no session" from the
 * caller's side. A challenge is included even though the code it produces
 * is thrown away unused.
 *
 * Fails closed to "no session" on any error or timeout — the worst case is
 * the pre-existing bug reappearing, not a broken login for the ordinary
 * case of a genuinely fresh visitor.
 */
export async function hasActiveSsoSession(): Promise<boolean> {
    if (typeof window === "undefined") return false;

    const codeChallenge = await pkcePair();

    return new Promise((resolve) => {
        const authUrl = new URL(KC_ENDPOINTS.authorize);
        authUrl.searchParams.set("client_id", CLIENT_ID);
        authUrl.searchParams.set("response_type", "code");
        authUrl.searchParams.set("scope", "openid");
        authUrl.searchParams.set("prompt", "none");
        authUrl.searchParams.set("code_challenge", codeChallenge);
        authUrl.searchParams.set("code_challenge_method", "S256");
        authUrl.searchParams.set(
            "redirect_uri",
            `${window.location.origin}/silent-check-sso.html`,
        );

        const iframe = document.createElement("iframe");
        iframe.style.display = "none";

        let settled = false;
        const timer = setTimeout(() => finish(false), CHECK_TIMEOUT_MS);

        function cleanup() {
            window.removeEventListener("message", onMessage);
            clearTimeout(timer);
            iframe.remove();
        }

        function finish(result: boolean) {
            if (settled) return;
            settled = true;
            cleanup();
            resolve(result);
        }

        function onMessage(event: MessageEvent) {
            if (event.origin !== window.location.origin) return;
            if (typeof event.data !== "string") return;
            if (!event.data.includes("/silent-check-sso.html")) return;

            try {
                const redirected = new URL(event.data);
                finish(redirected.searchParams.has("code"));
            } catch {
                finish(false);
            }
        }

        window.addEventListener("message", onMessage);
        iframe.src = authUrl.toString();
        document.body.appendChild(iframe);
    });
}
