import { remainingStock, type StorefrontItemResponse } from "@/lib/type/storeType";

export interface MenuItemData {
  id: string;
  name: string;
  /** Undefined until the seller sets one — the card says so rather than "0". */
  price?: string;
  compareAtPrice?: string;
  badge?: string | null;
  description: string;
  category: string;
  image: string;
  currency?: string;
  isOutOfStock?: boolean;
  /** What the online store has left, or null when the shop tracks no stock for it. */
  remaining?: number | null;
  status?: string;
  rawItem?: StorefrontItemResponse;
}

const clientOutOfStockSet = new Set<string>();

export function markItemOutOfStock(itemId?: string | null) {
  if (!itemId) return;
  clientOutOfStockSet.add(itemId);
  if (typeof window !== "undefined") {
    try {
      const stored: string[] = JSON.parse(sessionStorage.getItem("out_of_stock_items") || "[]");
      if (!stored.includes(itemId)) {
        stored.push(itemId);
        sessionStorage.setItem("out_of_stock_items", JSON.stringify(stored));
      }
    } catch {}
  }
}

/**
 * The little any caller needs to answer the stock question — an id to check
 * against the session marker, and the figure itself. Stated structurally
 * because callers hold an item, a menu entry or a cart line, and all three
 * carry these two things.
 */
type StockSource = {
  id?: string | null;
  availableQuantity?: number | null;
  rawItem?: { id?: string | null; availableQuantity?: number | null } | null;
};

/**
 * Whether this item can still be bought online.
 *
 * The API's `availableQuantity` is the answer whenever it gives one — it is
 * already capped to what the seller allocated the online store, so it is the
 * same figure the cart will enforce. This used to be guessed from a pile of
 * fields (`quantity`, `stock`, `inStock`, a badge reading "SOLD OUT") that the
 * public API never sent, which meant nothing was ever out of stock.
 *
 * The session marker is the fallback for items the shop tracks no stock for:
 * there is no figure to read, so a refused add-to-cart is the only signal
 * there will ever be.
 */
export function isItemOutOfStock(item?: StockSource | null): boolean {
  if (!item) return false;

  const source = item.rawItem ?? item;
  const remaining = remainingStock(source);

  if (remaining !== null) return remaining <= 0;

  const id = source.id;
  if (id && clientOutOfStockSet.has(id)) return true;
  if (id && typeof window !== "undefined") {
    try {
      const stored: string[] = JSON.parse(sessionStorage.getItem("out_of_stock_items") || "[]");
      if (stored.includes(id)) {
        clientOutOfStockSet.add(id);
        return true;
      }
    } catch {}
  }

  return false;
}

export interface ProductListProps {
  items?: MenuItemData[]; 
}

export const popularMenuItems: MenuItemData[] = [
  {
    id: "1",
    name: "Green Tea Macchiato",
    price: "1.90",
    description: "Fragrant jasmine green tea freshly brewed.",
    category: "Juice",
    image: "https://i.pinimg.com/736x/96/80/ec/9680ecaf91173c532345f935f1bd5a01.jpg",
  },
  {
    id: "2",
    name: "Jasmine Green Tea",
    price: "1.60",
    description: "Fragrant jasmine green tea freshly brewed.",
    category: "Juice",
    image: "https://i.pinimg.com/736x/96/80/ec/9680ecaf91173c532345f935f1bd5a01.jpg",
  },
  {
    id: "3",
    name: "Premium Hojicha Latte",
    price: "2.20",
    description: "Fragrant jasmine green tea freshly brewed.",
    category: "Hojicha",
    image: "https://i.pinimg.com/736x/96/80/ec/9680ecaf91173c532345f935f1bd5a01.jpg",
  },
  {
    id: "4",
    name: "Uji Matcha Latte",
    price: "2.30",
    description: "Fragrant jasmine green tea freshly brewed.",
    category: "Matcha Series",
    image: "https://i.pinimg.com/736x/96/80/ec/9680ecaf91173c532345f935f1bd5a01.jpg",
  },
  {
    id: "5",
    name: "Premium Hojicha Macchiato",
    price: "2.30",
    description: "Fragrant jasmine green tea freshly brewed.",
    category: "Hojicha",
    image: "https://i.pinimg.com/736x/96/80/ec/9680ecaf91173c532345f935f1bd5a01.jpg",
  },
  {
    id: "6",
    name: "Jumbo Milk Tea",
    price: "2.30",
    description: "Fragrant jasmine green tea freshly brewed.",
    category: "Chewy Tea",
    image: "https://i.pinimg.com/736x/96/80/ec/9680ecaf91173c532345f935f1bd5a01.jpg",
  },
]

 export const teaMenuItems: MenuItemData[] = [
  {
    id: "7",
    name: "Jasmine Green Tea",
    price: "1.90",
    description: "Fragrant jasmine green tea freshly brewed.",
    category: "Juice",
    image: "https://i.pinimg.com/736x/96/80/ec/9680ecaf91173c532345f935f1bd5a01.jpg",
  },
  {
    id: "8",
    name: "Jasmine Green Tea",
    price: "1.60",
    description: "Fragrant jasmine green tea freshly brewed.",
    category: "Juice",
    image: "https://i.pinimg.com/736x/96/80/ec/9680ecaf91173c532345f935f1bd5a01.jpg",
  },
  {
    id: "9",
    name: "Jasmine Green Tea",
    price: "2.30",
    description: "Fragrant jasmine green tea freshly brewed.",
    category: "Matcha Series",
    image: "https://i.pinimg.com/736x/96/80/ec/9680ecaf91173c532345f935f1bd5a01.jpg",
  },
  {
    id: "10",
    name: "Jumbo Milk Tea",
    price: "2.30",
    description: "Fragrant jasmine green tea freshly brewed.",
    category: "Chewy Tea",
    image: "https://i.pinimg.com/736x/96/80/ec/9680ecaf91173c532345f935f1bd5a01.jpg",
  },
]


export async function getPopularMenuItems(): Promise<MenuItemData[]> {
  return popularMenuItems
}

export async function getTeaMenuItems(): Promise<MenuItemData[]> {
  return teaMenuItems
}


import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";


export const menuApi = createApi({
  reducerPath: "menuApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["PopularMenu", "TeaMenu"],
  endpoints: (builder) => ({
    getPopularMenu: builder.query<MenuItemData[], void>({
      async queryFn() {
        const data = await getPopularMenuItems();
        return { data };
      },
      providesTags: ["PopularMenu"],
    }),

    getTeaMenu: builder.query<MenuItemData[], void>({
      async queryFn() {
        const data = await getTeaMenuItems();
        return { data };
      },
      providesTags: ["TeaMenu"],
    }),
  }),
});

export const { useGetPopularMenuQuery, useGetTeaMenuQuery } = menuApi;