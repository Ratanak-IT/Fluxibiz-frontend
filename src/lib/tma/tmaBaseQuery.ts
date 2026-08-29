"use client";

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { applyTmaAuthHeader } from "./tmaAuthHeader";
import { getTmaSession, setTmaSession } from "./tmaSession";
import { getDeviceSession, reissueMessengerDeviceToken } from "./messengerDeviceStore";

const plainBaseQuery = fetchBaseQuery({
  baseUrl: "/api/v1",
  prepareHeaders: applyTmaAuthHeader,
});

/**
 * Drop-in replacement for `fetchBaseQuery({ baseUrl: "/api/v1", prepareHeaders:
 * applyTmaAuthHeader })` used by every RTK Query slice a Messenger Mini App
 * visitor's bearer token flows through (cart, checkout, user profile).
 *
 * A device session's access token has no refresh flow — see
 * `reissueMessengerDeviceToken` — so without this, a Messenger visitor whose
 * token quietly expired (Mini App left open, or backgrounded, for a while)
 * would see the request 401 and — depending on the call site — either look
 * silently broken or get bounced to a Keycloak login page they have no
 * credentials to get past. This retries once, transparently, after silently
 * re-registering the same device.
 */
export const tmaBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await plainBaseQuery(args, api, extraOptions);

  const status = result.error?.status;
  if (status === 401 || status === 403) {
    const session = getTmaSession();
    if (session?.businessId && getDeviceSession(session.businessId)) {
      const reissued = await reissueMessengerDeviceToken(
        session.businessId,
        session.businessSlug,
      );
      if (reissued) {
        setTmaSession({
          token: reissued.token,
          refreshToken: reissued.refreshToken,
          businessId: reissued.businessId,
          businessSlug: reissued.businessSlug,
          customerId: reissued.customerId,
          fullName: reissued.fullName,
          phoneNumber: reissued.phoneNumber,
        });
        return plainBaseQuery(args, api, extraOptions);
      }
    }
  }

  return result;
};
