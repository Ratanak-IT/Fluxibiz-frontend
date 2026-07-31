'use client'

import DescriptionCard from "@/components/store/productdetail/description-card";
import ProductDetail from "@/components/store/productdetail/product-detail";
import RelatedProducts from "@/components/store/productdetail/related-product";

import { useGetRelatedProductsQuery } from "@/lib/store/productdetail/productApi";


export default function DetailProductPage() {
    const { data: relatedItems, isLoading } = useGetRelatedProductsQuery();
  return (
    <div className=" dark:bg-background">
      <ProductDetail/>
      <DescriptionCard/>
            {!isLoading && relatedItems && (
        <RelatedProducts items={relatedItems} viewAllHref="/menu/beverages" />
      )}
    </div>
  );
}