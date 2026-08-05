import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { AuthState } from "@/features/auth/authSlice";
import type {
    AddToCartPayload,
    CartCount,
    CartSummary,
} from "@/lib/type/cartType";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: "/api/v1",
});

const baseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
    const state = api.getState() as { auth: AuthState };
    const hasToken = state.auth.status === "authenticated";

    const urlStr = typeof args === "string" ? args : args.url;
    const method = (typeof args === "object" ? args.method : "GET") || "GET";

    if (!hasToken && method === "GET" && urlStr === "/storefront/cart") {
        return {
            data: {
                storeCount: 0,
                totalItems: 0,
                stores: [],
            } as any,
        };
    }

    if (!hasToken && method === "GET" && urlStr === "/storefront/cart/count") {
        return {
            data: {
                count: 0,
            } as any,
        };
    }

    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && (result.error.status === 400 || result.error.status === 401 || result.error.status === 403)) {
        if (method === "GET" && urlStr === "/storefront/cart") {
            return {
                data: {
                    storeCount: 0,
                    totalItems: 0,
                    stores: [],
                } as any,
            };
        }
        if (method === "GET" && urlStr === "/storefront/cart/count") {
            return {
                data: {
                    count: 0,
                } as any,
            };
        }
    }

    return result;
};

let pendingMutationsCount = 0;

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
            query: ({ businessId, itemId, variantId, quantity }) => ({
                url: "/storefront/cart/items",
                method: "POST",
                body: { businessId, itemId, variantId, quantity },
            }),
            async onQueryStarted({ businessId, itemId, quantity, itemDetails }, { dispatch, queryFulfilled }) {
                pendingMutationsCount++;
                const patch = dispatch(
                    cartApi.util.updateQueryData("getCart", undefined, (draft) => {
                        if (!draft) return;
                        draft.totalItems += quantity;

                        let store = draft.stores.find((s) => s.businessId === businessId);
                        if (!store) {
                            store = {
                                cartId: `temp-cart-${Date.now()}`,
                                businessId,
                                slug: "store",
                                name: itemDetails?.storeName || "Store",
                                category: null,
                                logo: null,
                                hours: null,
                                location: null,
                                currency: "USD",
                                open: true,
                                itemCount: 0,
                                subtotal: 0,
                                items: [],
                            };
                            draft.stores.push(store);
                            draft.storeCount = draft.stores.length;
                        }

                        store.itemCount += quantity;
                        const existingLine = store.items.find((l) => l.itemId === itemId);
                        if (existingLine) {
                            existingLine.quantity += quantity;
                            existingLine.subtotal += existingLine.unitPrice * quantity;
                            store.subtotal += existingLine.unitPrice * quantity;
                        } else if (itemDetails) {
                            const newSubtotal = itemDetails.price * quantity;
                            store.subtotal += newSubtotal;
                            store.items.push({
                                cartItemId: `temp-${Date.now()}`,
                                itemId,
                                variantId: null,
                                name: itemDetails.name,
                                description: null,
                                imageUrl: itemDetails.imageUrl ?? null,
                                badges: [],
                                quantity,
                                unitPrice: itemDetails.price,
                                subtotal: newSubtotal,
                            });
                        }
                    })
                );

                try {
                    const { data: updatedCart } = await queryFulfilled;
                    pendingMutationsCount--;
                    if (pendingMutationsCount === 0) {
                        dispatch(
                            cartApi.util.updateQueryData("getCart", undefined, () => updatedCart)
                        );
                    }
                } catch {
                    pendingMutationsCount--;
                    patch.undo();
                }
            },
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
            async onQueryStarted({ cartItemId, quantity }, { dispatch, queryFulfilled }) {
                pendingMutationsCount++;
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
                    const { data: updatedCart } = await queryFulfilled;
                    pendingMutationsCount--;
                    if (pendingMutationsCount === 0) {
                        dispatch(
                            cartApi.util.updateQueryData("getCart", undefined, () => updatedCart)
                        );
                    }
                } catch {
                    pendingMutationsCount--;
                    patch.undo();
                }
            },
        }),

        removeCartItem: builder.mutation<CartSummary, string>({
            query: (cartItemId) => ({
                url: `/storefront/cart/items/${cartItemId}`,
                method: "DELETE",
            }),
            async onQueryStarted(cartItemId, { dispatch, queryFulfilled }) {
                pendingMutationsCount++;
                const patch = dispatch(
                    cartApi.util.updateQueryData("getCart", undefined, (draft) => {
                        if (!draft) return;
                        draft.stores.forEach((store) => {
                            const index = store.items.findIndex((l) => l.cartItemId === cartItemId);
                            if (index !== -1) {
                                const line = store.items[index];
                                store.itemCount -= line.quantity;
                                store.subtotal -= line.subtotal;
                                draft.totalItems -= line.quantity;
                                store.items.splice(index, 1);
                            }
                        });
                        draft.stores = draft.stores.filter((s) => s.items.length > 0);
                        draft.storeCount = draft.stores.length;
                    })
                );

                try {
                    const { data: updatedCart } = await queryFulfilled;
                    pendingMutationsCount--;
                    if (pendingMutationsCount === 0) {
                        dispatch(
                            cartApi.util.updateQueryData("getCart", undefined, () => updatedCart)
                        );
                    }
                } catch {
                    pendingMutationsCount--;
                    patch.undo();
                }
            },
        }),

        removeCartStore: builder.mutation<CartSummary, string>({
            query: (businessId) => ({
                url: `/storefront/cart/stores/${businessId}`,
                method: "DELETE",
            }),
            async onQueryStarted(businessId, { dispatch, queryFulfilled }) {
                pendingMutationsCount++;
                const patch = dispatch(
                    cartApi.util.updateQueryData("getCart", undefined, (draft) => {
                        if (!draft) return;
                        const storeIndex = draft.stores.findIndex((s) => s.businessId === businessId);
                        if (storeIndex !== -1) {
                            const store = draft.stores[storeIndex];
                            draft.totalItems -= store.itemCount;
                            draft.stores.splice(storeIndex, 1);
                            draft.storeCount = draft.stores.length;
                        }
                    })
                );

                try {
                    const { data: updatedCart } = await queryFulfilled;
                    pendingMutationsCount--;
                    if (pendingMutationsCount === 0) {
                        dispatch(
                            cartApi.util.updateQueryData("getCart", undefined, () => updatedCart)
                        );
                    }
                } catch {
                    pendingMutationsCount--;
                    patch.undo();
                }
            },
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