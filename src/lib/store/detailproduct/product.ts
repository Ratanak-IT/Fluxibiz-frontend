
export interface ProductOption {
  label: string;
  value: string;
  priceModifier?: number;
}

export interface Product {
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
      "https://i.pinimg.com/736x/2b/15/8b/2b158b25f63a54b59604568236dedfcb.jpg",
      "https://i.pinimg.com/736x/e3/6a/72/e36a720526185c37b69d2bad73d1d95c.jpg",
      "https://i.pinimg.com/736x/80/fa/b8/80fab853a55b8411eaa3768b3d1b61a5.jpg",
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

// Same idea — stub for now, swap in a real POST /cart/items call later.
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