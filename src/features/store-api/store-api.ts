import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import {
    BusinessCategory,
    PublicStore,
    PublicStoreDetailResponse,
    PublicStorePage,
    PublicStoreQuery,
    StorefrontItemResponse,
} from "@/lib/type/storeType";

/**
 * The /public/* endpoints are unauthenticated, so unlike cartApi/checkoutApi
 * this slice sends no Authorization header.
 */
const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
});

function buildStoresRequest(
    query: PublicStoreQuery,
    categoryId?: string,
): FetchArgs {
    // Spring resolves `pageable` from flat page/size/sort query params.
    const params: Record<string, string | number> = {
        page: query.page ?? 0,
        size: query.size ?? 20,
    };

    if (categoryId) params.categoryId = categoryId;
    if (query.cityOrProvince?.trim()) {
        params.cityOrProvince = query.cityOrProvince.trim();
    }
    if (query.keyword?.trim()) params.keyword = query.keyword.trim();

    return { url: "/public/stores", params };
}

/**
 * The API takes a single `categoryId`. To honour a multi-select filter we fan
 * out one request per selected category and merge, de-duplicating by store id.
 * Page metadata is recomputed since per-category pages can't be summed.
 */
async function fetchMergedStores(
    query: PublicStoreQuery,
    fetchWithBQ: (
        arg: string | FetchArgs,
    ) => ReturnType<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>>,
) {
    const categoryIds = query.categoryIds ?? [];

    if (categoryIds.length <= 1) {
        const result = await fetchWithBQ(
            buildStoresRequest(query, categoryIds[0]),
        );
        if (result.error) return { error: result.error };
        return { data: result.data as PublicStorePage };
    }

    const results = await Promise.all(
        categoryIds.map((id) => fetchWithBQ(buildStoresRequest(query, id))),
    );

    const failed = results.find((r) => r.error);
    if (failed?.error) return { error: failed.error };

    const byId = new Map<string, PublicStore>();
    for (const result of results) {
        const page = result.data as PublicStorePage;
        for (const store of page.content ?? []) {
            if (!byId.has(store.id)) byId.set(store.id, store);
        }
    }

    const content = [...byId.values()];
    const size = query.size ?? 20;

    return {
        data: {
            content,
            page: {
                size,
                number: query.page ?? 0,
                totalElements: content.length,
                totalPages: Math.max(1, Math.ceil(content.length / size)),
            },
        } satisfies PublicStorePage,
    };
}

export const storeCateApi = createApi({
    reducerPath: "storeCateApi",
    baseQuery,
    tagTypes: ["BusinessCategory", "PublicStore"],
    endpoints: (builder) => ({
        getBusinessCategory: builder.query<BusinessCategory[], void>({
            query: () => "/public/business-categories",
            providesTags: ["BusinessCategory"],
        }),

        getPublicStores: builder.query<PublicStorePage, PublicStoreQuery>({
            queryFn: async (query, _api, _extra, fetchWithBQ) =>
                fetchMergedStores(query, fetchWithBQ),
            providesTags: ["PublicStore"],
        }),

        getPublicStore: builder.query<PublicStoreDetailResponse, string>({
            query: (slug) => `/public/stores/${slug}`,
            providesTags: ["PublicStore"],
        }),

        getPublicStoreItems: builder.query<StorefrontItemResponse[], string>({
            query: (slug) => `/public/stores/${slug}/items`,
            providesTags: ["PublicStore"],
        }),

        getRecommendedStores: builder.query<
            PublicStorePage,
            { categoryId?: string; page?: number; size?: number } | void
        >({
            query: (params) => {
                const searchParams: Record<string, string | number> = {};
                if (params?.categoryId) searchParams.categoryId = params.categoryId;
                if (params?.page !== undefined) searchParams.page = params.page;
                if (params?.size !== undefined) searchParams.size = params.size;
                return {
                    url: "/public/stores/recommended",
                    params: searchParams,
                };
            },
            providesTags: ["PublicStore"],
        }),
    }),
});

export const {
    useGetBusinessCategoryQuery,
    useGetPublicStoresQuery,
    useGetPublicStoreQuery,
    useGetPublicStoreItemsQuery,
    useGetRecommendedStoresQuery,
} = storeCateApi;
