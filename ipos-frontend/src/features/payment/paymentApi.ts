//

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
  }),
  endpoints: (builder) => ({
    loginUser :builder.mutation<unknown, unknown>({
        query: (credential) =>({
            url: "/auth/login",
            method: "POST",
            body: credential
        })
    }),

  registerUser: builder.mutation<unknown, unknown>({
        query: (credential)=>({
            url: "/users/user-signup",
            method: "POST",
            body: credential
        })
    })
  }),
});

export const { useLoginUserMutation, useRegisterUserMutation } = paymentApi;
