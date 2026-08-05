import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { AuthState } from "@/features/auth/authSlice";
import type { UserProfileResponse } from "@/lib/type/authType";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: "/api/v1",
});

const baseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
    const state = api.getState() as { auth: AuthState };
    const hasToken = state.auth.status === "authenticated";

    const urlStr = typeof args === "string" ? args : args.url;
    const method = (typeof args === "object" ? args.method : "GET") || "GET";

    if (!hasToken && method === "GET" && urlStr.startsWith("/user-profiles/me")) {
        return { data: null as any };
    }

    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && (result.error.status === 400 || result.error.status === 401 || result.error.status === 403)) {
        if (method === "GET" && urlStr.startsWith("/user-profiles/me")) {
            return { data: null as any };
        }
    }

    return result;
};

export type UpdateUserProfileArgs = {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    gender?: string;
    address?: string;
    file?: File | null;
};

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery,
    keepUnusedDataFor: 300,
    tagTypes: ["Profile"],
    endpoints: (builder) => ({
        getMyProfile: builder.query<UserProfileResponse, void>({
            query: () => "/user-profiles/me",
            providesTags: ["Profile"],
        }),

        updateMyProfile: builder.mutation<
            UserProfileResponse,
            UpdateUserProfileArgs
        >({
            query: (args) => {
                const formData = new FormData();
                if (args.firstName !== undefined && args.firstName !== null && args.firstName.trim() !== "") {
                    formData.append("firstName", args.firstName.trim());
                }
                if (args.lastName !== undefined && args.lastName !== null && args.lastName.trim() !== "") {
                    formData.append("lastName", args.lastName.trim());
                }
                if (args.phoneNumber !== undefined && args.phoneNumber !== null && args.phoneNumber.trim() !== "") {
                    formData.append("phoneNumber", args.phoneNumber.trim());
                }
                if (
                    args.gender &&
                    ["MALE", "FEMALE", "OTHER", "UNSPECIFIED"].includes(
                        args.gender.toUpperCase()
                    )
                ) {
                    formData.append("gender", args.gender.toUpperCase());
                }
                if (args.address !== undefined && args.address !== null && args.address.trim() !== "") {
                    formData.append("address", args.address.trim());
                }
                if (args.file) {
                    formData.append("file", args.file);
                }

                return {
                    url: "/user-profiles/me",
                    method: "PATCH",
                    body: formData,
                };
            },
            invalidatesTags: ["Profile"],
        }),

        removeProfilePicture: builder.mutation<void, void>({
            query: () => ({
                url: "/user-profiles/me/picture",
                method: "DELETE",
            }),
            invalidatesTags: ["Profile"],
        }),
    }),
});

export const {
    useGetMyProfileQuery,
    useUpdateMyProfileMutation,
    useRemoveProfilePictureMutation,
} = userApi;