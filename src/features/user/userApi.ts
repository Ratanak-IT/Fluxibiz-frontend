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
            queryFn: async (args, api, extraOptions) => {
                // Step 1: Upload profile picture if a file was provided
                if (args.file) {
                    const formData = new FormData();
                    formData.append("file", args.file);

                    const uploadResult = await baseQuery(
                        {
                            url: "/user-profiles/me/picture",
                            method: "POST",
                            body: formData,
                        },
                        api,
                        extraOptions
                    );

                    if (uploadResult.error) {
                        return { error: uploadResult.error };
                    }
                }

                // Step 2: Update profile text fields via JSON
                const jsonBody: Record<string, string | undefined> = {};
                if (args.firstName !== undefined && args.firstName !== null && args.firstName.trim() !== "") {
                    jsonBody.firstName = args.firstName.trim();
                }
                if (args.lastName !== undefined && args.lastName !== null && args.lastName.trim() !== "") {
                    jsonBody.lastName = args.lastName.trim();
                }
                if (args.phoneNumber !== undefined && args.phoneNumber !== null && args.phoneNumber.trim() !== "") {
                    jsonBody.phoneNumber = args.phoneNumber.trim();
                }
                if (
                    args.gender &&
                    ["MALE", "FEMALE", "OTHER", "UNSPECIFIED"].includes(
                        args.gender.toUpperCase()
                    )
                ) {
                    jsonBody.gender = args.gender.toUpperCase();
                }
                if (args.address !== undefined && args.address !== null && args.address.trim() !== "") {
                    jsonBody.address = args.address.trim();
                }

                const updateResult = await baseQuery(
                    {
                        url: "/user-profiles/me",
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: jsonBody,
                    },
                    api,
                    extraOptions
                );

                if (updateResult.error) {
                    return { error: updateResult.error };
                }

                return { data: updateResult.data as UserProfileResponse };
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