import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { addToCart, getProduct, getRelatedProducts, Product, Products } from "./product";


interface AddToCartPayload {
  productId: string;
  sugarLevel: string;
  size: string;
  quantity: number;
}

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fakeBaseQuery<{ message: string }>(),
  tagTypes: ["Product", "Cart", "RelatedProducts"],
  endpoints: (builder) => ({
    getProduct: builder.query<Product, string>({
      async queryFn(productId) {
        try {
          const data = await getProduct(productId);
          return { data };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    getRelatedProducts: builder.query<Products[], void>({
      async queryFn() {
        try {
          const data = await getRelatedProducts();
          return { data };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      providesTags: ["RelatedProducts"],
    }),

    addToCart: builder.mutation<{ success: boolean }, AddToCartPayload>({
      async queryFn(payload) {
        try {
          const data = await addToCart(payload);
          return { data };
        } catch (err) {
          return { error: { message: (err as Error).message } };
        }
      },
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetProductQuery,
  useGetRelatedProductsQuery,
  useAddToCartMutation,
} = productApi;