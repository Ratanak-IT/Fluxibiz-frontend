import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { getTmaSession } from "@/lib/tma/tmaSession";

export interface FacebookWebAppAuthRequest {
  businessId: string;
  signedRequest: string;
}


export interface FacebookDeviceAuthRequest {
  businessId: string;
  deviceId: string;
  fullName: string;
  phoneNumber: string;
}

export interface FacebookWebAppAuthResponse {
  token: string;
  refreshToken: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  logoUrl?: string;
  customerId: string;
  globalCustomerId: string;
  externalId: string;
  fullName: string;
  phoneNumber?: string;
  email?: string;
  gender?: string;
  address?: string;
  profileComplete: boolean;
}

export const facebookWebAppApi = createApi({
  reducerPath: "facebookWebAppApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    prepareHeaders: (headers) => {
      const session = getTmaSession();
      if (session?.token) {
        headers.set("Authorization", `Bearer ${session.token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    authenticateFacebookWebApp: builder.mutation<
      FacebookWebAppAuthResponse,
      FacebookWebAppAuthRequest
    >({
      query: (body) => ({
        url: "/facebook-webapp/auth",
        method: "POST",
        body,
      }),
    }),

    authenticateFacebookDevice: builder.mutation<
      FacebookWebAppAuthResponse,
      FacebookDeviceAuthRequest
    >({
      query: (body) => ({
        url: "/facebook-webapp/device-auth",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useAuthenticateFacebookWebAppMutation,
  useAuthenticateFacebookDeviceMutation,
} = facebookWebAppApi;
