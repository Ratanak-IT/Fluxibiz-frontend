"use client";

import { MenuItemData, useGetPopularMenuQuery, useGetTeaMenuQuery } from "@/lib/store/detailstore/detailstore";
import { MenuProductCard } from "./product-card";


type MenuSectionType = "popular" | "tea";

interface ProductListProps {
    title?: string;
    type: MenuSectionType;
}

function useMenuSection(type: MenuSectionType) {
    const popular = useGetPopularMenuQuery(undefined, { skip: type !== "popular" });
    const tea = useGetTeaMenuQuery(undefined, { skip: type !== "tea" });

    return type === "popular" ? popular : tea;
}

export default function ProductList({ title, type }: ProductListProps) {
    const { data: items = [], isLoading, isError } = useMenuSection(type);

    return (
        <section className=" px-6 py-8  sm:px-10 lg:px-20">
            {title && (
                <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                    {title}
                </h2>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {Array.isArray(items) && items.map((item) => (
                     <MenuProductCard key={item.id} item={item} /> 
                ))}
            </div>
        </section>
    );
}
