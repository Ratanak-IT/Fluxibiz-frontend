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
  role: "BUSINESS" | "CUSTOMER";
  businessName?: string;
  businessAddress?: string;
  businessCategoryId?: string;
}

export interface CreateBusinessPayload {
  name: string;
  categoryId?: string;
  email: string;
  address: string;
}

export interface BusinessSubCategoryResponse {
  id: string;
  name: string;
  slug: string;
}

export interface BusinessCategoryResponse {
  id: string;
  name: string;
  slug: string;
  subCategories: BusinessSubCategoryResponse[];
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
      query: ({ role, ...body }) => ({
        url: role === "BUSINESS" ? "/auth/register/business" : "/auth/register/customer",
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
      query: () => "/business-categories",
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useCreateBusinessMutation,
  useGetBusinessCategoriesQuery,
} = businessRegisterApi;