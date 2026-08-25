import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { getTmaSession } from "@/lib/tma/tmaSession";

export interface TelegramWebAppAuthRequest {
  businessId: string;
  initData: string;
}

export interface TelegramWebAppAuthResponse {
  token: string;
  refreshToken: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  logoUrl?: string;
  customerId: string;
  globalCustomerId: string;
  telegramUserId: number;
  telegramUsername?: string;
  fullName: string;
  photoUrl?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  /** False until both phoneNumber and address are set — gates the "complete your profile" screen. */
  profileComplete: boolean;
}

export interface UpdateMyProfileRequest {
  businessId: string;
  phoneNumber: string;
  address: string;
}

export interface UpdateMyProfileResponse {
  fullName: string;
  phoneNumber: string;
  address: string;
  profileComplete: boolean;
}

export const telegramWebAppApi = createApi({
  reducerPath: "telegramWebAppApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    // The auth call itself is public and ignores this; every other call in
    // this slice (profile update) needs it, since it's a real Keycloak
    // bearer token once /telegram-webapp/auth has issued one.
    prepareHeaders: (headers) => {
      const session = getTmaSession();
      if (session?.token) {
        headers.set("Authorization", `Bearer ${session.token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    authenticateTelegramWebApp: builder.mutation<
      TelegramWebAppAuthResponse,
      TelegramWebAppAuthRequest
    >({
      query: (body) => ({
        url: "/telegram-webapp/auth",
        method: "POST",
        body,
      }),
    }),

    updateMyProfile: builder.mutation<UpdateMyProfileResponse, UpdateMyProfileRequest>({
      query: (body) => ({
        url: "/me/profile",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const { useAuthenticateTelegramWebAppMutation, useUpdateMyProfileMutation } =
  telegramWebAppApi;
