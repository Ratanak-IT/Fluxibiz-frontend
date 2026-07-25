'use client'


import SearchFilterBar from "@/components/store/detailstore/button";
import ProductList from "@/components/store/detailstore/product-list";


import StoreCard from "@/components/store/detailstore/store-card";
import { getPopularMenuItems, getTeaMenuItems } from "@/lib/store/detailstore/detailstore";
import { ChevronLeft } from "lucide-react";

export default async function testPage(){

     const popularMenuItems = await getPopularMenuItems()
  const teaMenuItems = await getTeaMenuItems()
    return(
     <div className="min-h-screen bg-neutral-100 px-25 py-6 sm:px-10 ">

        <button
        type="button"
        className="mb-4 flex items-center gap-1 text-sm px-25 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
      >
        <ChevronLeft className="h-4 w-4" />
        Store
      </button>
        <StoreCard/>
        <SearchFilterBar/>

        <ProductList title="Popular Menu" items={popularMenuItems} />
      <ProductList title="Tea Menu" items={teaMenuItems} />
       
         

  
      
      
      
      
     </div>
    )
}