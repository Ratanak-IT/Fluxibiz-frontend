import { resolveMediaUrl } from "@/lib/type/cartType";

/* ------------------------------------------------------------------ *
 * Categories — GET /api/v1/public/business-categories
 * ------------------------------------------------------------------ */

export interface BusinessSubCategory {
    id: string;
    name: string;
    slug: string;
}

export interface BusinessCategory {
    id: string;
    name: string;
    slug: string;
    subCategories: BusinessSubCategory[] | null;
}

/**
 * A business is tagged with a *sub*category (BusinessResponse.category is a
 * BusinessSubCategoryResponse), so only leaf ids are useful as `categoryId`
 * filter values. Parents with no children are leaves themselves.
 */
export function leafCategories(
    category: BusinessCategory,
): BusinessSubCategory[] {
    const subs = category.subCategories ?? [];
    if (subs.length > 0) return subs;
    return [{ id: category.id, name: category.name, slug: category.slug }];
}

/* ------------------------------------------------------------------ *
 * Stores — GET /api/v1/public/stores
 * ------------------------------------------------------------------ */

export interface PublicStore {
    id: string;
    slug: string;
    name: string;
    logo: string | null;
    thumbnail: string | null;
    about: string | null;
    cityOrProvince: string | null;
    storefrontUrl: string | null;
    category: BusinessSubCategory | null;
}

export interface PageMetadata {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}

export interface PublicStorePage {
    content: PublicStore[];
    page: PageMetadata;
}

export interface PublicStoreQuery {
    /** Leaf category ids. More than one triggers a client-side merge. */
    categoryIds?: string[];
    cityOrProvince?: string;
    keyword?: string;
    page?: number;
    size?: number;
}

/* ------------------------------------------------------------------ *
 * Card view model
 * ------------------------------------------------------------------ */

/**
 * Shape the store cards render.
 *
 * `hours` and `isOpen` are optional because PublicStoreResponse does not
 * expose opening hours or an open/closed flag — the cards omit those rows
 * rather than inventing values.
 */
export interface Store {
    id: string;
    slug: string;
    name: string;
    category: string;
    description: string;
    location: string;
    image: string | null;
    hours?: string;
    isOpen?: boolean;
    discountLabel?: string;
}

export function toStoreCard(store: PublicStore): Store {
    const resolvedImage =
        resolveMediaUrl(store.logo) ?? resolveMediaUrl(store.thumbnail);

    return {
        id: store.id,
        slug: store.slug,
        name: store.name,
        category: store.category?.name ?? "",
        description: store.about ?? "",
        location: store.cityOrProvince ?? "",
        image: resolvedImage ?? "",
    };
}
