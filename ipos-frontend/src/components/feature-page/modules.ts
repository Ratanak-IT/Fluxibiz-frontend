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

export type ModuleTranslationKey =
  | "dynamic"
  | "responsive"
  | "platform"
  | "miniCommerce"
  | "modernPos";

export interface Module {
  id: ModuleId;
  translationKey: ModuleTranslationKey;
  index: string;
  icon: LucideIcon;
  featureKeys: readonly string[];
  mock: "dashboard" | "pos" | "reports" | "storefront" | "chat";
}

export const MODULES: Module[] = [
  {
    id: "dynamic",
    translationKey: "dynamic",
    index: "01",
    icon: Activity,
    featureKeys: ["realtime", "workflows", "status", "interactions"],
    mock: "reports",
  },
  {
    id: "responsive",
    translationKey: "responsive",
    index: "02",
    icon: MonitorSmartphone,
    featureKeys: ["touch", "layout", "hardware", "anywhere"],
    mock: "storefront",
  },
  {
    id: "platform",
    translationKey: "platform",
    index: "03",
    icon: Workflow,
    featureKeys: ["login", "data", "operations", "manualWork"],
    mock: "dashboard",
  },
  {
    id: "mini-commerce",
    translationKey: "miniCommerce",
    index: "04",
    icon: QrCode,
    featureKeys: ["menu", "download", "ordering", "updated"],
    mock: "chat",
  },
  {
    id: "modern-pos",
    translationKey: "modernPos",
    index: "05",
    icon: LayoutDashboard,
    featureKeys: ["checkout", "grid", "summary", "dashboard"],
    mock: "pos",
  },
];

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
  {
    name: "GitHub Actions",
    src: "/image/features/github-action.png",
    scale: 1.35,
  },
];