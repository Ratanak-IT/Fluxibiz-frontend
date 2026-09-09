import { getTmaSession } from "./tmaSession";


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
