import fs from "fs";
import path from "path";

export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  badge?: string;
  status: "OPEN" | "CLOSED";
  position: number;
  createdAt: string;
  updatedAt: string;
}

const INITIAL_BANNERS: BannerItem[] = [
  {
    id: "banner-1",
    title: "",
    subtitle: "",
    imageUrl: "/carousel/banner2.png",
    linkUrl: "/store",
    badge: "",
    status: "OPEN",
    position: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "banner-2",
    title: "",
    subtitle: "",
    imageUrl: "/carousel/banner7.png",
    linkUrl: "/store",
    badge: "",
    status: "OPEN",
    position: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "banner-3",
    title: "",
    subtitle: "",
    imageUrl: "/carousel/banner3.png",
    linkUrl: "/store",
    badge: "",
    status: "OPEN",
    position: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "banner-4",
    title: "",
    subtitle: "",
    imageUrl: "/carousel/banner8.png",
    linkUrl: "/store",
    badge: "",
    status: "OPEN",
    position: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "banner-5",
    title: "",
    subtitle: "",
    imageUrl: "/carousel/banner6.png",
    linkUrl: "/store",
    badge: "",
    status: "OPEN",
    position: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "banner-6",
    title: "",
    subtitle: "",
    imageUrl: "/carousel/banner1.jpg",
    linkUrl: "/store",
    badge: "",
    status: "OPEN",
    position: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let inMemoryBanners: BannerItem[] = [...INITIAL_BANNERS];

const dataFilePath = path.join(process.cwd(), ".data", "banners.json");

function ensureDirectoryExists(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) return true;
  fs.mkdirSync(dirname, { recursive: true });
}

function loadBanners(): BannerItem[] {
  try {
    if (fs.existsSync(dataFilePath)) {
      const raw = fs.readFileSync(dataFilePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryBanners = parsed;
        return inMemoryBanners;
      }
    }
  } catch (err) {
    console.warn("Failed to read banners.json, fallback to memory:", err);
  }
  return inMemoryBanners;
}

function saveBanners(banners: BannerItem[]) {
  inMemoryBanners = banners;
  try {
    ensureDirectoryExists(dataFilePath);
    fs.writeFileSync(dataFilePath, JSON.stringify(banners, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write banners.json:", err);
  }
}

export function getAllBanners(): BannerItem[] {
  return loadBanners().sort((a, b) => a.position - b.position);
}

export function getOpenBanners(): BannerItem[] {
  return getAllBanners().filter((b) => b.status === "OPEN");
}

export function createBanner(payload: Omit<BannerItem, "id" | "createdAt" | "updatedAt">): BannerItem {
  const banners = getAllBanners();
  const newBanner: BannerItem = {
    ...payload,
    id: `banner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  banners.push(newBanner);
  saveBanners(banners);
  return newBanner;
}

export function updateBanner(id: string, updates: Partial<Omit<BannerItem, "id" | "createdAt">>): BannerItem | null {
  const banners = getAllBanners();
  const index = banners.findIndex((b) => b.id === id);
  if (index === -1) return null;

  banners[index] = {
    ...banners[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveBanners(banners);
  return banners[index];
}

export function toggleBannerStatus(id: string): BannerItem | null {
  const banners = getAllBanners();
  const banner = banners.find((b) => b.id === id);
  if (!banner) return null;

  const nextStatus = banner.status === "OPEN" ? "CLOSED" : "OPEN";
  return updateBanner(id, { status: nextStatus });
}

export function deleteBanner(id: string): boolean {
  let banners = getAllBanners();
  const initialLength = banners.length;
  banners = banners.filter((b) => b.id !== id);
  if (banners.length !== initialLength) {
    saveBanners(banners);
    return true;
  }
  return false;
}
