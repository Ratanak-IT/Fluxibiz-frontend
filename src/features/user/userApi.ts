

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { AuthState } from "@/features/auth/authSlice";
import type { UserProfileResponse } from "@/lib/type/authType";

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as { auth: AuthState }).auth.accessToken;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery,
    tagTypes: ["Profile"],
    endpoints: (builder) => ({
        getMyProfile: builder.query<UserProfileResponse, void>({
            query: () => "/user-profiles/me",
            providesTags: ["Profile"],
        }),

        updateMyProfile: builder.mutation<
            UserProfileResponse,
            Partial<UserProfileResponse>
        >({
            query: (body) => ({
                url: "/user-profiles/me",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Profile"],
        }),
    }),
});

export const { useGetMyProfileQuery, useUpdateMyProfileMutation } = userApi;