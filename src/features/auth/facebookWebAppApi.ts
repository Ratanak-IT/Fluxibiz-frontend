import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { getTmaSession } from "@/lib/tma/tmaSession";

export interface FacebookWebAppAuthRequest {
  businessId: string;
  signedRequest: string;
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
  psid: string;
  fullName: string;
  phoneNumber?: string;
  email?: string;
  gender?: string;
  address?: string;
  /** False until email, gender, phoneNumber and address are all set — gates the "complete your profile" screen. */
  profileComplete: boolean;
}

export const facebookWebAppApi = createApi({
  reducerPath: "facebookWebAppApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    // The auth call itself is public and ignores this — only here for
    // consistency with the rest of this slice's shape.
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
  }),
});

export const { useAuthenticateFacebookWebAppMutation } = facebookWebAppApi;
