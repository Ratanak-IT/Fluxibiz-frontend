import { MenuItemData } from "@/lib/store/detailstore/detailstore";
import { MenuProductCard } from "./product-card";
import Link from "next/link";

interface ProductListProps {
    title?: string;
    items: MenuItemData[];
}

export default function ProductList({ title, items = [] }: ProductListProps) {
    return (
        <section className=" px-6 py-8  sm:px-10 lg:px-25">
            {title && (
                <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                    {title}
                </h2>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {items.map((item) => (
                    <Link href={"storeSlug/product/productSlug"} key={item.id}>
                          <MenuProductCard key={item.id} item={item} />
                    </Link>
                      
                  
                ))}
            </div>
        </section>
    );
}
