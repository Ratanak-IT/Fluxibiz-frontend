"use client";

import { useRef } from "react";
import { useScroll, useSpring } from "framer-motion";
import {
  BarChart3,
  Box,
  Check,
  ChevronRight,
  ReceiptText,
  ShoppingCart,
  Store,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { StickyStackCard } from "./sticky-stack-card";

interface DashboardRow {
  title: string;
  detail: string;
  icon: LucideIcon;
  iconClassName: string;
}

interface ShowcaseCard {
  label: string;
  title: string;
  accent: string;
  description: string;
  points: string[];
  liveBadge: string;
  statusBadge: string;
  orderTitle: string;
  orderDetail: string;
  orderState: string;
  orderIcon: LucideIcon;
  rows: DashboardRow[];
}

const MANAGE_DASHBOARD_CARD: ShowcaseCard = {
  label: "04 · MANAGE — one live dashboard",
  title: "Everything you sell.",
  accent: "Finally in sync",
  description:
    "Orders, stock, and payments land in one place automatically — always current, always offline-ready, always counting toward what’s next.",
  points: [
    "Every sale, synced everywhere instantly",
    "Works with no signal, no panic",
    "Always one tap from what’s next",
  ],
  liveBadge: "LIVE NOW · 47 ORDERS TODAY",
  statusBadge: "STOCK · OFFLINE READY",
  orderTitle: "Order #A408 · Table 6",
  orderDetail: "2 × Wagyu Burger · $54.00",
  orderState: "Now",
  orderIcon: ReceiptText,
  rows: [
    { title: "Wagyu Burger", detail: "24 in stock · reorder at 10", icon: Box, iconClassName: "bg-amber text-white" },
    { title: "Daily sales", detail: "$3,240 · +12% vs yesterday", icon: BarChart3, iconClassName: "bg-[#1046c9] text-white" },
    { title: "Supplier order", detail: "Due Nov 14 · Chan Meats", icon: Truck, iconClassName: "bg-[#d74442] text-white" },
  ],
};

const SHOWCASE_CARDS: ShowcaseCard[] = [
  {
    label: "01 · SELL — faster checkout",
    title: "Every order.",
    accent: "One smooth flow",
    description:
      "Serve dine-in, takeaway, and online customers from the same fast, easy-to-learn checkout.",
    points: ["Start a sale in seconds", "Accept cash, QR, and digital payments", "Keep queues moving at busy times"],
    liveBadge: "LIVE · 47 ORDERS TODAY",
    statusBadge: "POS · READY TO SELL",
    orderTitle: "Order #A408 · Table 6",
    orderDetail: "2 × Wagyu Burger · $54.00",
    orderState: "New",
    orderIcon: ReceiptText,
    rows: [
      { title: "Dine-in", detail: "18 tables open · 6 active", icon: ReceiptText, iconClassName: "bg-brand text-white" },
      { title: "Takeaway", detail: "12 orders · 4 ready", icon: ShoppingCart, iconClassName: "bg-amber text-white" },
      { title: "Online orders", detail: "Synced from your storefront", icon: Store, iconClassName: "bg-[#1046c9] text-white" },
    ],
  },
  {
    label: "02 · TRACK — smarter inventory",
    title: "Know your stock.",
    accent: "Before it runs out",
    description:
      "Each completed sale updates inventory automatically, giving your team one reliable stock count.",
    points: ["Live stock after every sale", "Low-stock and expiry alerts", "Simpler supplier reordering"],
    liveBadge: "LIVE STOCK · 1,248 ITEMS",
    statusBadge: "3 LOCATIONS · SYNCED",
    orderTitle: "Fresh Salad · SKU-3301",
    orderDetail: "3 remaining · reorder at 10",
    orderState: "Low",
    orderIcon: Box,
    rows: [
      { title: "Wagyu Burger", detail: "24 in stock · healthy level", icon: Box, iconClassName: "bg-brand text-white" },
      { title: "Iced Latte", detail: "8 in stock · selling fast", icon: BarChart3, iconClassName: "bg-[#1046c9] text-white" },
      { title: "Supplier order", detail: "Due Nov 14 · Chan Meats", icon: Truck, iconClassName: "bg-[#d74442] text-white" },
    ],
  },
  {
    label: "03 · GROW — commerce everywhere",
    title: "Your shop.",
    accent: "Beyond the counter",
    description:
      "Turn your products into a mobile storefront and QR menu that customers can browse from anywhere.",
    points: ["One catalog across every channel", "QR menu with no app download", "Online orders arrive instantly"],
    liveBadge: "ONLINE · STORE OPEN",
    statusBadge: "CATALOG · AUTO-SYNCED",
    orderTitle: "Online order #W219",
    orderDetail: "Paid · ready for fulfilment",
    orderState: "New",
    orderIcon: Store,
    rows: [
      { title: "Online storefront", detail: "36 products live", icon: Store, iconClassName: "bg-brand text-white" },
      { title: "QR digital menu", detail: "Scan, browse, and order", icon: ShoppingCart, iconClassName: "bg-amber text-white" },
      { title: "Shared inventory", detail: "Updated across every channel", icon: Box, iconClassName: "bg-[#1046c9] text-white" },
    ],
  },
  MANAGE_DASHBOARD_CARD,
];

function DashboardCard({ card }: { card: ShowcaseCard }) {
  const OrderIcon = card.orderIcon;

  return (
  <div className="h-full overflow-y-auto px-6 py-7 sm:px-9 md:py-9 lg:overflow-hidden lg:px-14 lg:py-10 dark:bg-background">
  <p className="font-mono text-xs font-semibold tracking-[0.16em] text-brand dark:text-brand sm:text-sm">
    {card.label}
  </p>

  <div className="mt-7 grid items-center gap-9 lg:mt-2 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
    <div className="lg:py-8">
      <h2 className="text-4xl font-extrabold leading-[1.03] tracking-[-0.045em] text-brand dark:text-brand sm:text-5xl lg:text-[3.35rem]">
        {card.title}
        <br />
        <span className="text-secondary dark:text-secondary">{card.accent}</span>
      </h2>

      <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground dark:text-muted-foreground sm:text-lg sm:leading-8">
        {card.description}
      </p>

      <ul className="mt-8 space-y-4">
        {card.points.map((point) => (
          <li
            key={point}
            className="flex items-center gap-3 text-base font-medium text-foreground dark:text-foreground sm:text-lg"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-soft dark:bg-brand-soft">
              <Check className="size-4 text-brand dark:text-brand" strokeWidth={2.5} />
            </span>
            {point}
          </li>
        ))}
      </ul>
    </div>

    <div>
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft dark:bg-brand-soft px-4 py-2 text-xs font-bold text-brand-ink dark:text-brand-ink sm:text-sm">
          <span className="size-2.5 rounded-full bg-secondary dark:bg-secondary" />
          {card.liveBadge}
        </span>

        <span className="inline-flex items-center gap-2 rounded-full bg-muted dark:bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground dark:text-muted-foreground sm:text-sm">
          <span className="size-2.5 rounded-full bg-brand dark:bg-brand" />
          {card.statusBadge}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-4 rounded-[20px] border border-secondary dark:border-secondary bg-accent-amber-soft dark:bg-accent-amber-soft p-4 sm:px-5 sm:py-5">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand dark:bg-brand text-primary-foreground dark:text-primary-foreground sm:size-14">
          <OrderIcon className="size-6" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-foreground dark:text-foreground sm:text-lg">
            {card.orderTitle}
          </p>
          <p className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground sm:text-base">
            {card.orderDetail}
          </p>
        </div>

        <span className="rounded-full bg-secondary dark:bg-secondary px-4 py-1.5 text-sm font-bold text-secondary-foreground dark:text-secondary-foreground">
          {card.orderState}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {card.rows.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                flex items-center gap-4 
                rounded-[20px] 
                border border-border dark:border-border
                bg-card dark:bg-card
                p-4 
                sm:px-5 sm:py-5
              "
            >
              <span
                className={`
                  grid size-12 shrink-0 
                  place-items-center 
                  rounded-2xl 
                  sm:size-14
                  ${item.iconClassName}
                `}
              >
                <Icon className="size-6" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-foreground dark:text-foreground sm:text-lg">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground sm:text-base">
                  {item.detail}
                </p>
              </div>

              <ChevronRight className="size-5 shrink-0 text-muted-foreground dark:text-muted-foreground" />
            </div>
          );
        })}
      </div>
    </div>
  </div>
</div>
  );
}

export function DashboardSyncShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <section
  aria-label="Dashboard and inventory sync showcase"
  className="bg-[linear-gradient(180deg,#ffffff_0%,#edf8f0_100%)] dark:bg-[linear-gradient(180deg,#1C1C1C_0%,#101915_100%)] px-5 md:px-8"
>
  <div ref={containerRef} className="relative mx-auto w-full max-w-6xl">
    {SHOWCASE_CARDS.map((card, index) => (
      <StickyStackCard
        key={`${card.label}-${index}`}
        index={index}
        total={SHOWCASE_CARDS.length}
        progress={progress}
      >
        <DashboardCard card={card} />
      </StickyStackCard>
    ))}
  </div>
</section>
  );
}
