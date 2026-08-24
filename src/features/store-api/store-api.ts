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
    baseUrl: "/api/v1",
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
    if (query.province) {
        params.province = query.province;
    } else if (query.cityOrProvince?.trim()) {
        params.cityOrProvince = query.cityOrProvince.trim();
    }
    if (query.district) params.district = query.district;
    if (query.keyword?.trim()) params.keyword = query.keyword.trim();
    if (query.lat !== undefined && query.lng !== undefined) {
        params.lat = query.lat;
        params.lng = query.lng;
    }

    return { url: "/public/stores", params };
}

async function enrichStoresWithDetails(
    stores: PublicStore[],
    fetchWithBQ: (
        arg: string | FetchArgs,
    ) => ReturnType<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>>,
): Promise<PublicStore[]> {
    if (!stores || stores.length === 0) return [];
    return Promise.all(
        stores.map(async (store) => {
            // `address` is what the card actually shows; `cityOrProvince` is
            // deprecated and null for every business created since location
            // moved to the map picker, so requiring both here meant this
            // fired for every store, every time — an extra full detail fetch
            // per card, on every listing render.
            if (store.address || !store.slug) {
                return store;
            }
            try {
                const res = await fetchWithBQ(`/public/stores/${store.slug}`);
                if (res.data) {
                    const detail = res.data as PublicStoreDetailResponse;
                    return {
                        ...store,
                        cityOrProvince: store.cityOrProvince ?? detail.cityOrProvince ?? null,
                        address: store.address ?? detail.address ?? null,
                    };
                }
            } catch {
                // Ignore detail fetch failure
            }
            return store;
        })
    );
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
        const page = result.data as PublicStorePage;
        const enrichedContent = await enrichStoresWithDetails(page.content ?? [], fetchWithBQ);
        return { data: { ...page, content: enrichedContent } };
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
    const enrichedContent = await enrichStoresWithDetails(content, fetchWithBQ);
    const size = query.size ?? 20;

    return {
        data: {
            content: enrichedContent,
            page: {
                size,
                number: query.page ?? 0,
                totalElements: enrichedContent.length,
                totalPages: Math.max(1, Math.ceil(enrichedContent.length / size)),
            },
        } satisfies PublicStorePage,
    };
}

export const storeCateApi = createApi({
    reducerPath: "storeCateApi",
    baseQuery,
    keepUnusedDataFor: 300,
    // A storefront is a live shop. The prices, the opening hours and what is
    // even listed are all changed from the back office while shoppers are on
    // the page, and a read cached for the session showed them yesterday's menu
    // until they reloaded. So the store is read again when a page is opened,
    // when the tab is looked at again, and when the connection comes back.
    // Nothing here seeds a form, so nobody loses typing to a refetch.
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    tagTypes: ["BusinessCategory", "PublicStore"],
    endpoints: (builder) => ({
        getBusinessCategory: builder.query<BusinessCategory[], void>({
            query: () => "/business-categories",
            providesTags: ["BusinessCategory"],
        }),

        /** Distinct province names actually used by listed stores — self-populating, nothing seeded. */
        getProvinces: builder.query<string[], void>({
            query: () => "/public/stores/provinces",
        }),

        getPublicStores: builder.query<PublicStorePage, PublicStoreQuery>({
            queryFn: async (query, _api, _extra, fetchWithBQ) =>
                fetchMergedStores(query, fetchWithBQ),
            providesTags: ["PublicStore"],
        }),

        getPublicStore: builder.query<
            PublicStoreDetailResponse,
            string | { slug: string; lat?: number; lng?: number }
        >({
            query: (arg) => {
                const { slug, lat, lng } = typeof arg === "string" ? { slug: arg } : arg;
                const params: Record<string, number> = {};
                if (lat !== undefined && lng !== undefined) {
                    params.lat = lat;
                    params.lng = lng;
                }
                return { url: `/public/stores/${slug}`, params };
            },
            providesTags: ["PublicStore"],
        }),

        getPublicStoreItems: builder.query<StorefrontItemResponse[], string>({
            query: (slug) => `/public/stores/${slug}/items`,
            providesTags: ["PublicStore"],
        }),

        getRecommendedStores: builder.query<
            PublicStorePage,
            {
                categoryId?: string;
                page?: number;
                size?: number;
                lat?: number;
                lng?: number;
            } | void
        >({
            query: (params) => {
                const searchParams: Record<string, string | number> = {};
                if (params?.categoryId) searchParams.categoryId = params.categoryId;
                if (params?.page !== undefined) searchParams.page = params.page;
                if (params?.size !== undefined) searchParams.size = params.size;
                if (params?.lat !== undefined && params?.lng !== undefined) {
                    searchParams.lat = params.lat;
                    searchParams.lng = params.lng;
                }
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
    useGetProvincesQuery,
    useGetPublicStoresQuery,
    useGetPublicStoreQuery,
    useGetPublicStoreItemsQuery,
    useGetRecommendedStoresQuery,
} = storeCateApi;
