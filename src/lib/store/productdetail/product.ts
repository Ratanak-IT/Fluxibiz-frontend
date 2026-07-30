export interface ProductOption {
  label: string;
  value: string;
  priceModifier?: number;
}

export  interface Product {
  id: string;
  badge?: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  sugarLevels: ProductOption[];
  sizes: ProductOption[];
  defaultSugarLevel: string;
  defaultSize: string;
  perks: {
    icon: "truck" | "shield" | "refresh";
    title: string;
    subtitle: string;
  }[];
   businessId: string;
    storeSlug: string;
    storeName: string;
    storeCategory: string;
    storeLogo: string;
    storeLocation: string;
    storeHours: string;
    currency?: string;
}

// --- Related products (card grid shape) ---
export interface Products {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export async function getProduct(id: string): Promise<Product> {
  return {
    id,
    badge: "NEW ARRIVAL",
    name: "Jasmine Green Tea",
    description:
      "Small-batch cold brew steeped for 20 hours using ethically sourced Ethiopian Yirgacheffe beans. Smooth, bold, naturally sweet.",
    price: 1.99,
    compareAtPrice: 2.5,
    images: [
      "https://i.pinimg.com/736x/da/e3/a8/dae3a884189cee56fde94fcefff0a036.jpg",
      "https://i.pinimg.com/736x/e3/6a/72/e36a720526185c37b69d2bad73d1d95c.jpg",
      "https://i.pinimg.com/736x/e7/e2/b6/e7e2b63e9066f63dd29825be9142e49a.jpg",
    ],
    sugarLevels: ["0", "25", "50", "75", "100"].map((v) => ({
      label: `${v}%`,
      value: v,
    })),
    sizes: [
      { label: "Small", value: "small", priceModifier: -0.39 },
      { label: "Medium", value: "medium", priceModifier: 0.81 },
      { label: "Large", value: "large", priceModifier: 1.61 },
    ],
    defaultSugarLevel: "50",
    defaultSize: "medium",
    perks: [
      { icon: "truck", title: "Free Delivery", subtitle: "On orders over $50" },
      { icon: "shield", title: "1 Year Warranty", subtitle: "Official warranty" },
      { icon: "refresh", title: "Easy Returns", subtitle: "30-day return policy" },
    ],
  };
}

export async function getRelatedProducts(): Promise<Products[]> {
  return [
    {
      id: "1",
      name: "Jasmine Green Tea",
      price: 1.6,
      description: "Fragrant jasmine green tea freshly brewed.",
      category: "Beverages",
      image:
        "https://i.pinimg.com/736x/0a/60/93/0a6093fa6b8ff3432f9f92031509c8c5.jpg",
    },
    {
      id: "2",
      name: "Jasmine Green Tea",
      price: 1.6,
      description: "Fragrant jasmine green tea freshly brewed.",
      category: "Beverages",
      image:
        "https://i.pinimg.com/736x/e5/b9/8f/e5b98f5016f5c9c755229edb09c51c87.jpg",
    },
    {
      id: "3",
      name: "Jasmine Green Tea",
      price: 1.6,
      description: "Fragrant jasmine green tea freshly brewed.",
      category: "Beverages",
      image:
        "https://i.pinimg.com/736x/e7/e2/b6/e7e2b63e9066f63dd29825be9142e49a.jpg",
    },
  ];
}

export async function addToCart(payload: {
  productId: string;
  sugarLevel: string;
  size: string;
  quantity: number;
}): Promise<{ success: boolean }> {
  console.log("addToCart (stub):", payload);
  return { success: true };
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function computeDiscountPct(
  price: number,
  compareAtPrice?: number
): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}