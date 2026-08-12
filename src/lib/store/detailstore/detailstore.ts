import type { StorefrontItemResponse } from "@/lib/type/storeType";

export interface MenuItemData {
  id: string;
  name: string;
  price: string;
  compareAtPrice?: string;
  badge?: string | null;
  description: string;
  category: string;
  image: string;
  currency?: string;
  isOutOfStock?: boolean;
  quantity?: number;
  stock?: number;
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

export function isItemOutOfStock(
  item?: MenuItemData | StorefrontItemResponse | any | null
): boolean {
  if (!item) return false;

  const id = item.id || item.itemId || item.rawItem?.id;
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

  // 1. Explicit boolean checks
  if (typeof item.isOutOfStock === "boolean") return item.isOutOfStock;
  if (typeof item.outOfStock === "boolean") return item.outOfStock;
  if (typeof item.inStock === "boolean") return !item.inStock;
  if (typeof item.available === "boolean") return !item.available;
  if (typeof item.isAvailable === "boolean") return !item.isAvailable;

  // 2. Numeric quantity or stock checks
  const qty = item.quantity ?? item.stock ?? item.availableQuantity ?? item.stockQuantity;
  if (qty !== undefined && qty !== null) {
    if (Number(qty) <= 0) return true;
  }

  // 3. Status string check
  if (item.status && typeof item.status === "string") {
    const s = item.status.trim().toUpperCase();
    if (
      s === "OUT_OF_STOCK" ||
      s === "OUT_STOCK" ||
      s === "UNAVAILABLE" ||
      s === "SOLDOUT" ||
      s === "SOLD_OUT" ||
      s === "INACTIVE" ||
      s === "OFF_SHELF"
    ) {
      return true;
    }
  }

  // 4. Badge check
  if (item.badge && typeof item.badge === "string") {
    const b = item.badge.trim().toUpperCase();
    if (
      b.includes("OUT OF STOCK") ||
      b.includes("SOLD OUT") ||
      b.includes("OUT_OF_STOCK") ||
      b.includes("SOLDOUT") ||
      b.includes("SOLD_OUT") ||
      b.includes("NO STOCK") ||
      b.includes("NO_STOCK") ||
      b.includes("អស់ស្តុក") ||
      b.includes("អស់ពីស្តុក")
    ) {
      return true;
    }
  }

  // 5. Check nested rawItem object if present
  if (item.rawItem && item.rawItem !== item) {
    return isItemOutOfStock(item.rawItem);
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