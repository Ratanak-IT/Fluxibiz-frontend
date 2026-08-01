import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { AuthState } from "@/features/auth/authSlice";
import type {
    AddToCartPayload,
    CartCount,
    CartSummary,
} from "@/lib/type/cartType";

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as { auth: AuthState }).auth.accessToken;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery,
    tagTypes: ["Cart"],
    endpoints: (builder) => ({
        getCart: builder.query<CartSummary, void>({
            query: () => "/storefront/cart",
            providesTags: ["Cart"],
        }),

        getCartCount: builder.query<CartCount, void>({
            query: () => "/storefront/cart/count",
            providesTags: ["Cart"],
        }),

        addToCart: builder.mutation<CartSummary, AddToCartPayload>({
            query: (body) => ({
                url: "/storefront/cart/items",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Cart"],
        }),

        updateCartItem: builder.mutation<
            CartSummary,
            { cartItemId: string; quantity: number }
        >({
            query: ({ cartItemId, quantity }) => ({
                url: `/storefront/cart/items/${cartItemId}`,
                method: "PATCH",
                body: { quantity },
            }),
            invalidatesTags: ["Cart"],

            async onQueryStarted({ cartItemId, quantity }, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    cartApi.util.updateQueryData("getCart", undefined, (draft) => {
                        draft.stores.forEach((store) => {
                            const line = store.items.find((l) => l.cartItemId === cartItemId);
                            if (!line) return;

                            const delta = quantity - line.quantity;
                            line.quantity = quantity;
                            line.subtotal = line.unitPrice * quantity;
                            store.itemCount += delta;
                            store.subtotal += line.unitPrice * delta;
                            draft.totalItems += delta;
                        });
                    }),
                );

                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
                }
            },
        }),

        removeCartItem: builder.mutation<CartSummary, string>({
            query: (cartItemId) => ({
                url: `/storefront/cart/items/${cartItemId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),

        removeCartStore: builder.mutation<CartSummary, string>({
            query: (businessId) => ({
                url: `/storefront/cart/stores/${businessId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),
    }),
});

export const {
    useGetCartQuery,
    useGetCartCountQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveCartItemMutation,
    useRemoveCartStoreMutation,
} = cartApi;