import {
  BarChart3,
  Boxes,
  Laptop,
  LayoutDashboard,
  Package,
  Users,
  type LucideIcon,
} from "lucide-react";

export type FeatureModuleKey =
  | "business"
  | "inventory"
  | "sales"
  | "reports"
  | "onlineShopping"
  | "socialCommerce";

export type FeatureStatKey =
  | "businesses"
  | "countries"
  | "uptime";

export interface FeatureModule {
  index: string;
  translationKey: FeatureModuleKey;
  featureKeys: readonly string[];
  image: string;
  icon: LucideIcon;
  imageSide: "left" | "right";
  imageClassName?: string;
}

export const FEATURE_MODULES: FeatureModule[] = [
  {
    index: "01",
    translationKey: "business",
    featureKeys: [
      "summary",
      "reports",
      "channels",
      "notifications",
      "settings",
      "people",
    ],
    image: "/image/features/business.png",
    icon: LayoutDashboard,
    imageSide: "left",
  },
  {
    index: "02",
    translationKey: "inventory",
    featureKeys: [
      "countStock",
      "createStock",
      "createService",
      "stockAlerts",
      "createCategory",
      "createProduct",
    ],
    image: "/image/features/inventory-management.png",
    icon: Boxes,
    imageSide: "right",
  },
  {
    index: "03",
    translationKey: "sales",
    featureKeys: [
      "pos",
      "orders",
      "payments",
      "customers",
      "discounts",
      "barcode",
    ],
    image: "/image/features/sale-management.png",
    icon: Package,
    imageSide: "left",
  },
  {
    index: "04",
    translationKey: "reports",
    featureKeys: [
      "graphicReports",
      "dateFilters",
      "salesAnalytics",
      "exportReports",
    ],
    image: "/image/features/dashboard-showcase.png",
    icon: Laptop,
    imageSide: "right",
  },
  {
    index: "05",
    translationKey: "onlineShopping",
    featureKeys: [
      "catalog",
      "checkout",
      "cart",
      "history",
      "search",
      "payments",
    ],
    image: "/image/features/online-shopping.png",
    icon: BarChart3,
    imageSide: "left",
  },
  {
    index: "06",
    translationKey: "socialCommerce",
    featureKeys: [
      "messenger",
      "telegram",
      "chat",
      "payments",
    ],
    image: "/image/features/social.png",
    icon: Users,
    imageSide: "right",
    imageClassName: "object-contain p-3 sm:p-5",
  },
];

export const FEATURE_STATS = [
  { value: "12,000+", translationKey: "businesses" },
  { value: "30+", translationKey: "countries" },
  { value: "99.9%", translationKey: "uptime" },
] as const satisfies readonly {
  value: string;
  translationKey: FeatureStatKey;
}[];