import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { cartApi } from "@/features/cart/cartApi";
import type { AuthState } from "@/features/auth/authSlice";
import {
    ActiveCheckout,
    CheckoutSession,
    CreateCheckoutPayload,
    PaymentStatus,
    StorefrontOrder,
} from "@/lib/type/checkoutType";


const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as { auth: AuthState }).auth.accessToken;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

export const checkoutApi = createApi({
    reducerPath: "checkoutApi",
    baseQuery,
    tagTypes: ["Checkout", "OrderHistory"],
    endpoints: (builder) => ({
   
        createCheckout: builder.mutation<CheckoutSession, CreateCheckoutPayload>({
            query: (body) => ({
                url: "/storefront/checkout",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Checkout", "OrderHistory"],
        }),

        getActiveCheckout: builder.query<ActiveCheckout, void>({
            query: () => "/storefront/checkout/active",
            providesTags: ["Checkout"],
        }),

    
        getPaymentStatus: builder.mutation<PaymentStatus, string>({
            query: (orderId) => `/storefront/checkout/${orderId}/status`,

            async onQueryStarted(_orderId, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.paid) {
                        dispatch(cartApi.util.invalidateTags(["Cart"]));
                        dispatch(checkoutApi.util.invalidateTags(["OrderHistory"]));
                    }
                } catch {
                }
            },
        }),

        cancelCheckout: builder.mutation<PaymentStatus, string>({
            query: (orderId) => ({
                url: `/storefront/checkout/${orderId}/cancel`,
                method: "PATCH",
            }),
            invalidatesTags: ["Checkout", "OrderHistory"],
        }),

        getOrderHistory: builder.query<StorefrontOrder[], void>({
            query: () => "/storefront/checkout/history",
            providesTags: ["OrderHistory"],
        }),

        getOrderReceipt: builder.query<StorefrontOrder, string>({
            query: (orderId) => `/storefront/checkout/${orderId}/receipt`,
            providesTags: (_result, _error, orderId) => [{ type: "OrderHistory", id: orderId }],
        }),
    }),
});

export const {
    useCreateCheckoutMutation,
    useGetActiveCheckoutQuery,
    useGetPaymentStatusMutation,
    useCancelCheckoutMutation,
    useGetOrderHistoryQuery,
    useGetOrderReceiptQuery,
} = checkoutApi;