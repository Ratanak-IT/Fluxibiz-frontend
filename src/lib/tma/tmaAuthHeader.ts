import { getTmaSession } from "./tmaSession";

/**
 * A Mini App shopper is authenticated via a bearer token issued by
 * `/telegram-webapp/auth`, kept in sessionStorage — not the httpOnly
 * `kc_at` cookie the regular site's OAuth login sets. RTK Query base
 * queries that talk to the same `/api/v1/*` proxy need to attach it
 * themselves; the proxy (`src/app/api/v1/[...path]/route.ts`) already
 * forwards a client-set `authorization` header as-is, falling back to the
 * cookie only when one isn't present.
 */
export function applyTmaAuthHeader(headers: Headers): Headers {
  const session = getTmaSession();
  if (session?.token) {
    headers.set("authorization", `Bearer ${session.token}`);
  }
  return headers;
}

export function hasTmaSessionToken(): boolean {
  return Boolean(getTmaSession()?.token);
}
