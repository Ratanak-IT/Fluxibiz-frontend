import { MenuItemData } from "@/lib/store/detailstore/detailstore";
import { MenuProductCard } from "./product-card";


interface ProductListProps {
    title?: string;
    items: MenuItemData[];
}

export default function ProductList({ title, items = [] }: ProductListProps) {
    return (
        <section className=" px-6 py-8  sm:px-10 lg:px-20">
            {title && (
                <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                    {title}
                </h2>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {items.map((item) => (
                   
                     <MenuProductCard key={item.id} item={item} /> 
                  
                ))}
            </div>
        </section>
    );
}
