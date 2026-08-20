import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface TelegramWebAppAuthRequest {
  businessId: string;
  initData: string;
}

export interface TelegramWebAppAuthResponse {
  token: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  logoUrl?: string;
  customerId: string;
  globalCustomerId: string;
  telegramUserId: number;
  telegramUsername?: string;
  fullName: string;
  phoneNumber?: string;
  email?: string;
}

export const telegramWebAppApi = createApi({
  reducerPath: "telegramWebAppApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
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
  }),
});

export const { useAuthenticateTelegramWebAppMutation } = telegramWebAppApi;
