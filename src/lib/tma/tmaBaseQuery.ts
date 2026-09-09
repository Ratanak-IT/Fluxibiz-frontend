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
