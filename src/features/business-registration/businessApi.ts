import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AuthState } from "@/features/auth/authSlice";

export interface RegisterUserPayload {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  role: string;
}

export interface CreateBusinessPayload {
  name: string;
  categoryId?: string;
  email: string;
  address: string;
}

export interface BusinessCategoryResponse {
  id: string;
  name: string;
}

export const businessRegisterApi = createApi({
  reducerPath: "businessRegisterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth: AuthState }).auth?.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<unknown, RegisterUserPayload>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    createBusiness: builder.mutation<unknown, CreateBusinessPayload>({
      query: (body) => ({
        url: "/businesses",
        method: "POST",
        body,
      }),
    }),

    getBusinessCategories: builder.query<BusinessCategoryResponse[], void>({
      query: () => "/admin/business-categories",
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useCreateBusinessMutation,
  useGetBusinessCategoriesQuery,
} = businessRegisterApi;
