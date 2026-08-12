import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BannerItem } from "@/lib/banner/bannerStore";

export type { BannerItem };

export const bannerApi = createApi({
  reducerPath: "bannerApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["Banners"],
  endpoints: (builder) => ({
    getStorefrontBanners: builder.query<BannerItem[], void>({
      query: () => "/storefront/banners",
      transformResponse: (res: { data: BannerItem[] }) => res.data || [],
      providesTags: ["Banners"],
    }),

    getAdminBanners: builder.query<BannerItem[], void>({
      query: () => "/admin/banners",
      transformResponse: (res: { data: BannerItem[] }) => res.data || [],
      providesTags: ["Banners"],
    }),

    createAdminBanner: builder.mutation<BannerItem, Partial<BannerItem>>({
      query: (body) => ({
        url: "/admin/banners",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Banners"],
    }),

    updateAdminBanner: builder.mutation<BannerItem, { id: string; data: Partial<BannerItem> }>({
      query: ({ id, data }) => ({
        url: `/admin/banners/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Banners"],
    }),

    toggleAdminBannerStatus: builder.mutation<BannerItem, string>({
      query: (id) => ({
        url: `/admin/banners/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["Banners"],
    }),

    deleteAdminBanner: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banners"],
    }),
  }),
});

export const {
  useGetStorefrontBannersQuery,
  useGetAdminBannersQuery,
  useCreateAdminBannerMutation,
  useUpdateAdminBannerMutation,
  useToggleAdminBannerStatusMutation,
  useDeleteAdminBannerMutation,
} = bannerApi;
