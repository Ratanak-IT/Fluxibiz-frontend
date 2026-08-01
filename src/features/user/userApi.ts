

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { AuthState } from "@/features/auth/authSlice";
import type { UserProfileResponse } from "@/lib/type/authType";

const baseQuery = fetchBaseQuery({
    baseUrl: "/api/v1",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as { auth: AuthState }).auth.accessToken;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

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
                if (args.firstName && args.firstName.trim() !== "") {
                    formData.append("firstName", args.firstName.trim());
                }
                if (args.lastName && args.lastName.trim() !== "") {
                    formData.append("lastName", args.lastName.trim());
                }
                if (args.phoneNumber && args.phoneNumber.trim().length >= 8) {
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
                if (args.address && args.address.trim() !== "") {
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