'use client'


import SearchFilterBar from "@/components/store/detailstore/button";
import ProductList from "@/components/store/detailstore/product-list";


import StoreCard from "@/components/store/detailstore/store-card";
import { getPopularMenuItems, getTeaMenuItems } from "@/lib/store/detailstore.ts/detailstore";
import { ChevronLeft } from "lucide-react";
// import { Product } from "@/lib/store/detailstore.ts/detailstore";

// const products: Product[] = [
//   { id: "1", name: "Milk Tea", price: 4.5, image: "https://i.pinimg.com/736x/96/80/ec/9680ecaf91173c532345f935f1bd5a01.jpg" },
//   { id: "2", name: "Taro Slush", price: 5.0, image: "https://i.pinimg.com/736x/96/80/ec/9680ecaf91173c532345f935f1bd5a01.jpg" },
// ];

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