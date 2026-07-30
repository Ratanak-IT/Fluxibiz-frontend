import {
  Activity,
  LayoutDashboard,
  MonitorSmartphone,
  QrCode,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type ModuleId =
  | "dynamic"
  | "responsive"
  | "platform"
  | "mini-commerce"
  | "modern-pos";

export interface Module {
  id: ModuleId;
  index: string;
  eyebrow: string;
  title: string;
  promise: string;
  icon: LucideIcon;
  features: string[];
  mock: "dashboard" | "pos" | "reports" | "storefront" | "chat";
}

export const MODULES: Module[] = [
  {
    id: "dynamic",
    index: "01",
    eyebrow: "Built to move",
    title: "Dynamic by design",
    promise: "Live data, instant updates, and workflows that keep pace with every order.",
    icon: Activity,
    features: ["Real-time updates", "Smart workflows", "Instant status changes", "Fast interactions"],
    mock: "reports",
  },
  {
    id: "responsive",
    index: "02",
    eyebrow: "Every screen",
    title: "Tablet, iPad & phone",
    promise: "A responsive workspace that feels native on every device your team already uses.",
    icon: MonitorSmartphone,
    features: ["Touch optimized", "Responsive layout", "No special hardware", "Work from anywhere"],
    mock: "storefront",
  },
  {
    id: "platform",
    index: "03",
    eyebrow: "One connected system",
    title: "All-in-one platform",
    promise: "Sales, products, customers, stock, and reports connected in one place.",
    icon: Workflow,
    features: ["One secure login", "Shared live data", "Unified operations", "Less manual work"],
    mock: "dashboard",
  },
  {
    id: "mini-commerce",
    index: "04",
    eyebrow: "Scan. Browse. Order.",
    title: "Mini commerce",
    promise: "Customers scan a QR code to see your menu and start ordering immediately.",
    icon: QrCode,
    features: ["QR digital menu", "No app download", "Mobile ordering", "Always up to date"],
    mock: "chat",
  },
  {
    id: "modern-pos",
    index: "05",
    eyebrow: "Simple at the counter",
    title: "Clean, modern POS",
    promise: "A focused dashboard that makes checkout faster and daily operations clearer.",
    icon: LayoutDashboard,
    features: ["Fast checkout", "Clear product grid", "Live order summary", "Actionable dashboard"],
    mock: "pos",
  },
];

;

export interface Tech {
  name: string;
  src: string;
  scale?: number;
}

export const MARQUEE: Tech[] = [
  { name: "Next.js", src: "/image/features/nextjs.png" },
  { name: "Spring Boot", src: "/image/features/springboot.png" },
  { name: "PostgreSQL", src: "/image/features/postgresql.png" },
  { name: "Keycloak", src: "/image/features/keycloak.png" },
  { name: "MinIO", src: "/image/features/minio.png" },
  { name: "Docker", src: "/image/features/docker.png" },
  { name: "Traefik", src: "/image/features/traefik.png", scale: 1.6 },
  { name: "Redis", src: "/image/features/redis.png", scale: 1.35 },
  { name: "GitHub Action", src: "/image/features/github-action.png", scale: 1.35 },
];