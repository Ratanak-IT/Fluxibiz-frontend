import DescriptionCard from "@/components/store/productdetail/description-card";
import ProductDetail from "@/components/store/productdetail/product-detail";
import { RelatedProducts } from "@/components/store/productdetail/related-product";
import { Products } from "@/lib/store/detailproduct/product";

const relatedItems: Products[] = [
  {
    id: "1",
    name: "Jasmine Green Tea",
    price: 1.6,
    description: "Fragrant jasmine green tea freshly brewed.",
    category: "Beverages",
    image: "https://i.pinimg.com/736x/e7/e2/b6/e7e2b63e9066f63dd29825be9142e49a.jpg",
  },
  {
    id: "2",
    name: "Jasmine Green Tea",
    price: 1.6,
    description: "Fragrant jasmine green tea freshly brewed.",
    category: "Beverages",
    image: "https://i.pinimg.com/736x/e7/e2/b6/e7e2b63e9066f63dd29825be9142e49a.jpg",
  },
  {
    id: "3",
    name: "Jasmine Green Tea",
    price: 1.6,
    description: "Fragrant jasmine green tea freshly brewed.",
    category: "Beverages",
    image: "https://i.pinimg.com/736x/e7/e2/b6/e7e2b63e9066f63dd29825be9142e49a.jpg",
  },
];

export default function Page() {
  return (
    <div className="px-6 py-10  sm:px-10">
      <ProductDetail/>
      <DescriptionCard/>
      <RelatedProducts items={relatedItems} viewAllHref="/menu/beverages" />
    </div>
  );
}