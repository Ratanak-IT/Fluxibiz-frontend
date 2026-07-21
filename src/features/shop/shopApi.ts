
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}`,
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

export const { useLoginUserMutation, useRegisterUserMutation } = storeApi;
