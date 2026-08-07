import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
  }),
  tagTypes: ["Business", "BusinessCategory"],
  endpoints: (builder) => ({
    registerUser: builder.mutation<unknown, RegisterUserPayload>({
      query: ({ role, ...body }) => ({
        url: role === "BUSINESS" ? "/auth/register/business" : "/auth/register/customer",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Business"],
    }),

    createBusiness: builder.mutation<unknown, CreateBusinessPayload>({
      query: (body) => ({
        url: "/businesses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Business"],
    }),

    getBusinessCategories: builder.query<BusinessCategoryResponse[], void>({
      query: () => "/business-categories",
      providesTags: ["BusinessCategory"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useCreateBusinessMutation,
  useGetBusinessCategoriesQuery,
} = businessRegisterApi;