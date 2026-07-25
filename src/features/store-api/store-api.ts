import { createApi, fakeBaseQuery, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import build from "next/dist/build";

export interface BussinessCategoryType{
    id : number;
    parent_id : number | null;
    level : number;
    name : string;
    slug : string;
    icon : string | null
}
const mockCategories: BussinessCategoryType[] = [
  { id: 1, parent_id: null, level: 1, name: "Alcoholic Drinks", slug: "alcoholic-drinks", icon: null },
  { id: 2, parent_id: null, level: 1, name: "Bakery", slug: "bakery", icon: null },
  { id: 3, parent_id: null, level: 1, name: "Bakery & Dessert", slug: "bakery-dessert", icon: null },
  { id: 4, parent_id: null, level: 1, name: "Beauty", slug: "beauty", icon: null },
  { id: 5, parent_id: null, level: 1, name: "Beverages & Alcohol", slug: "beverages-alcohol", icon: null },
  { id: 6, parent_id: null, level: 1, name: "Butchery", slug: "butchery", icon: null },
  { id: 7, parent_id: null, level: 1, name: "Convenience", slug: "convenience", icon: null },
  { id: 8, parent_id: null, level: 1, name: "Drinks", slug: "drinks", icon: null },
  { id: 9, parent_id: null, level: 1, name: "Electronics", slug: "electronics", icon: null },
  { id: 10, parent_id: null, level: 1, name: "Fishery", slug: "fishery", icon: null },
  { id: 11, parent_id: null, level: 1, name: "Grocery", slug: "grocery", icon: null },
  { id: 12, parent_id: null, level: 1, name: "Health & Wellness", slug: "health-wellness", icon: null },
  { id: 13, parent_id: null, level: 1, name: "Home & Living", slug: "home-living", icon: null },
  { id: 14, parent_id: null, level: 1, name: "Pet Supplies", slug: "pet-supplies", icon: null },
  { id: 15, parent_id: 2, level: 2, name: "Bread", slug: "bread", icon: null },
];

export const storeCateApi = createApi({
    reducerPath: "storeCateApi",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["BussinessCategoryType"],
    endpoints: (builder) =>({
        getBusinessCategory : builder.query<BussinessCategoryType[], void>({
            // query: (name) => 
            queryFn: async()=>{
                return {data : mockCategories}
            },
            providesTags: ["BussinessCategoryType"],
        })
    })
})

export const { useGetBusinessCategoryQuery } = storeCateApi;