import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { cartApi } from "@/features/cart/cartApi";
import { applyTmaAuthHeader } from "@/lib/tma/tmaAuthHeader";
import {
    ActiveCheckout,
    CheckoutSession,
    CreateCheckoutPayload,
    PaymentStatus,
    StorefrontOrder,
} from "@/lib/type/checkoutType";


const baseQuery = fetchBaseQuery({
    baseUrl: "/api/v1",
    prepareHeaders: applyTmaAuthHeader,
});

export type CustomerSelfProfile = {
    fullName: string | null;
    email: string | null;
    gender: string | null;
    phoneNumber: string | null;
    address: string | null;
    profileComplete: boolean;
};

export const checkoutApi = createApi({
    reducerPath: "checkoutApi",
    baseQuery,
    tagTypes: ["Checkout", "OrderHistory", "CustomerSelfProfile"],
    endpoints: (builder) => ({

        // Checked right before "Pay"/"Confirm order" on every channel (web,
        // Telegram, Messenger) — a phone number is the one thing every
        // channel's checkout requires the shop to be able to reach the
        // customer, and it lives on GlobalCustomer rather than being
        // guaranteed by any one channel's own sign-in flow.
        getMyCustomerProfile: builder.query<CustomerSelfProfile, void>({
            query: () => "/me/profile",
            providesTags: ["CustomerSelfProfile"],
        }),

        updateMyPhoneNumber: builder.mutation<CustomerSelfProfile, { businessId: string; phoneNumber: string }>({
            query: (body) => ({
                url: "/me/profile",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["CustomerSelfProfile"],
        }),

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
            query: (orderId) => ({
                url: `/storefront/checkout/${orderId}/status`,
                method: "GET",
            }),

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
            async onQueryStarted(_orderId, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    checkoutApi.util.updateQueryData("getActiveCheckout", undefined, (draft) => {
                        if (draft) {
                            draft.hasPendingCheckout = false;
                            draft.checkout = null;
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
                }
            },
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
    useGetMyCustomerProfileQuery,
    useUpdateMyPhoneNumberMutation,
} = checkoutApi;