import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { AuthState } from "@/features/auth/authSlice";
import type {
    AddToCartPayload,
    CartCount,
    CartSummary,
} from "@/lib/type/cartType";

/**
 * A line's chosen options reduced to one comparable string, sorted by
 * attribute name so the same choices made in a different order still match.
 * Mirrors `CartItem.selectionKey()` on the server.
 */
function selectionKeyOf(
    selections?: { attributeName: string; value: string }[] | null,
): string {
    if (!selections || selections.length === 0) return "";
    return selections
        .map((selection) => `${selection.attributeName}=${selection.value}`)
        .sort()
        .join("|");
}

/**
 * Normalises a cart the server sent, without changing what it charges.
 *
 * Line and store subtotals are recomputed from the server's own unit prices so
 * an optimistic patch cannot leave a stale total on screen. The unit price
 * itself is never touched: it is the channel price the checkout will bill, and
 * a client that lowered it showed the shopper one number while the shop
 * charged another.
 */
function sanitizeCartData(cartData: CartSummary | null | undefined): CartSummary {
    if (!cartData || !Array.isArray(cartData.stores)) {
        return cartData || { storeCount: 0, totalItems: 0, stores: [] };
    }

    const stores = cartData.stores.map((store) => {
        let storeSubtotal = 0;
        const items = store.items.map((line) => {
            const lineSubtotal = line.unitPrice * line.quantity;
            storeSubtotal += lineSubtotal;

            return { ...line, subtotal: lineSubtotal };
        });

        return {
            ...store,
            subtotal: storeSubtotal,
            items,
        };
    });

    return {
        ...cartData,
        stores,
    };
}

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
            transformResponse: (response: CartSummary) => sanitizeCartData(response),
            providesTags: ["Cart"],
        }),

        getCartCount: builder.query<CartCount, void>({
            query: () => "/storefront/cart/count",
            providesTags: ["Cart"],
        }),

        addToCart: builder.mutation<CartSummary, AddToCartPayload>({
            query: ({ businessId, itemId, variantId, unitId, selections, quantity }) => ({
                url: "/storefront/cart/items",
                method: "POST",
                body: { businessId, itemId, variantId, unitId, selections, quantity },
            }),
            async onQueryStarted({ businessId, itemId, variantId, selections, quantity, itemDetails }, { dispatch, queryFulfilled }) {
                // itemDetails only fills the optimistic line until the server
                // answers; the response then replaces it wholesale.
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
                                currency: itemDetails?.currency || "USD",
                                open: true,
                                itemCount: 0,
                                subtotal: 0,
                                items: [],
                            };
                            draft.stores.push(store);
                            draft.storeCount = draft.stores.length;
                        } else if (itemDetails?.currency) {
                            store.currency = itemDetails.currency;
                        }

                        store.itemCount += quantity;
                        // Same identity rule the server uses: item, option and
                        // choices together. Matching on itemId alone merged a
                        // 50%-sugar line into a 0% one until the response
                        // arrived and pulled them apart again.
                        const existingLine = store.items.find(
                            (l) =>
                                l.itemId === itemId &&
                                (l.variantId ?? null) === (variantId ?? null) &&
                                selectionKeyOf(l.selections) === selectionKeyOf(selections),
                        );
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
                                variantId: variantId ?? null,
                                name: itemDetails.name,
                                description: null,
                                imageUrl: itemDetails.imageUrl ?? null,
                                badges: [],
                                selections: (selections ?? []).map((selection) => ({
                                    ...selection,
                                    label: selection.value,
                                })),
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
                    const sanitized = sanitizeCartData(updatedCart);
                    if (pendingMutationsCount === 0) {
                        dispatch(
                            cartApi.util.updateQueryData("getCart", undefined, () => sanitized)
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
                    const sanitized = sanitizeCartData(updatedCart);
                    if (pendingMutationsCount === 0) {
                        dispatch(
                            cartApi.util.updateQueryData("getCart", undefined, () => sanitized)
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
                    const sanitized = sanitizeCartData(updatedCart);
                    if (pendingMutationsCount === 0) {
                        dispatch(
                            cartApi.util.updateQueryData("getCart", undefined, () => sanitized)
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
                        const index = draft.stores.findIndex((s) => s.businessId === businessId);
                        if (index !== -1) {
                            const store = draft.stores[index];
                            draft.totalItems -= store.itemCount;
                            draft.stores.splice(index, 1);
                            draft.storeCount = draft.stores.length;
                        }
                    })
                );

                try {
                    const { data: updatedCart } = await queryFulfilled;
                    pendingMutationsCount--;
                    const sanitized = sanitizeCartData(updatedCart);
                    if (pendingMutationsCount === 0) {
                        dispatch(
                            cartApi.util.updateQueryData("getCart", undefined, () => sanitized)
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