import {
  BarChart3,
  Boxes,
  Laptop,
  LayoutDashboard,
  Package,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface FeatureModule {
  index: string;
  title: string;
  image: string;
  alt: string;
  icon: LucideIcon;
  features: string[];
  imageSide: "left" | "right";
  imageClassName?: string;
}

export const FEATURE_MODULES: FeatureModule[] = [
  {
    index: "01",
    title: "Business Management",
    image: "/image/features/dashboard-showcase.png",
    alt: "FluxiBiz business management dashboard",
    icon: LayoutDashboard,
    features: ["Summary information", "Clear reports and analytics", "Shop-channel management", "Alert Notifications", "Centralized business settings", "Customer and staff management"],
    imageSide: "left",
  },
  {
    index: "02",
    title: "Inventory Management",
    image: "/image/features/inventory-management.png",
    alt: "FluxiBiz inventory management screen",
    icon: Boxes,
    features: [
      "Count stock",
      "Create stock",
      "Create service",
      "Stock alerts",
      "Expiration tracking",
      "Excel import / export",
    ],
    imageSide: "right",
  },
  {
    index: "03",
    title: "Sale Management",
    image: "/image/features/sale-management.png",
    alt: "FluxiBiz sale management screen",
    icon: Package,
    features: [ "Point of Sale", "Sale orders", "Payment Management", "Invoicing", "Discounts & Promotions", "Barcode Scanning"],
    imageSide: "left",
  },
  {
    index: "04",
    title: "Report Analytics",
    image: "/image/features/report-analytics.png",
    alt: "FluxiBiz report analytics dashboard",
    icon: Laptop,
    features: ["Graphic reports", "Custom Date Filters", "Sales Analytics", "Export Reports"],
    imageSide: "right",
  },
  {
    index: "05",
    title: "Online Shopping",
    image: "/image/features/online-shopping.png",
    alt: "FluxiBiz online shopping storefront",
    icon: BarChart3,
    features: [
      "Product Catalog",
      "Secure Checkout",
      "Shopping Cart",
      "Order History",
      "Smart Search",
      "Multiple Payment Methods",
    ],
    imageSide: "left",
  },
  {
    index: "06",
    title: "Social Commerce",
    image: "/image/features/social-commerce.png",
    alt: "FluxiBiz social commerce chat order",
    icon: Users,
    features: ["Messenger Orders", "Telegram Orders", "Customer Chat Management", "Payment Integration"],
    imageSide: "right",
    imageClassName: "object-contain p-3 sm:p-5",
  },
];

export const FEATURE_STATS = [
  { value: "12,000+", label: "Businesses running FluxiBiz" },
  { value: "30+", label: "Countries served" },
  { value: "99.9%", label: "Uptime, every month" },
] as const;
