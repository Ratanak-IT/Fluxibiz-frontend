"use client";

import {
  BarChart3,
  BellRing,
  Box,
  Boxes,
  Check,
  ChevronRight,
  Globe,
  MessageCircle,
  ReceiptText,
  RefreshCw,
  Send,
  Smartphone,
  Store,
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

const SHOWCASE_CARDS: ShowcaseCard[] = [
  {
    label: "01 · Support All Business Types",
    title: "One platform",
    accent: "Every business",
    description:
      "Built to support businesses of all sizes and industries—from retail stores and restaurants to pharmacies, supermarkets, wholesalers, and service providers.",
    points: [
      "Supports retail, restaurants, cafés, pharmacies, and more",
      "Products and services in one system",
    ],
    liveBadge: "LIVE · 12 BUSINESS TYPES",
    statusBadge: "READY TO GROW",
    orderTitle: "Retail Store",
    orderDetail: "Inventory • POS",
    orderState: "Popular",
    orderIcon: Store,
    rows: [
      {
        title: "Restaurant",
        detail: "Dine-in • Kitchen",
        icon: Store,
        iconClassName: "bg-brand text-white",
      },
      {
        title: "Pharmacy",
        detail: "Medicine • Expiry",
        icon: Store,
        iconClassName: "bg-amber text-white",
      },
      {
        title: "Wholesale",
        detail: "Bulk Orders • Customer Pricing",
        icon: Store,
        iconClassName: "bg-[#1046c9] text-white",
      },
    ],
  },
  {
    label: "02 · Connect Sell Everywhere",
    title: "One business",
    accent: "Every sales channel",
    description:
      "Sell in-store, online, and through social media while keeping inventory and orders synchronized.",
    points: [
      "Unified sales channels",
      "Real-time order sync",
      "Social commerce integration",
    ],
    liveBadge: "LIVE · OMNICHANNEL",
    statusBadge: "CONNECTED",
    orderTitle: "Physical Store",
    orderDetail: "POS • Walk-in Sales",
    orderState: "Open",
    orderIcon: Store,
    rows: [
      {
        title: "Website",
        detail: "Orders • Inventory",
        icon: Globe,
        iconClassName: "bg-brand text-white",
      },
      {
        title: "Facebook & Messenger",
        detail: "Chats • Customer Orders",
        icon: MessageCircle,
        iconClassName: "bg-[#1046c9] text-white",
      },
      {
        title: "Telegram",
        detail: "Messages • Order Requests",
        icon: Send,
        iconClassName: "bg-[#229ED9] text-white",
      },
    ],
  },
  {
    label: "03 · Automate Work Smarter",
    title: "Less manual work",
    accent: "More productivity",
    description:
      "Automate everyday tasks to save time and reduce errors.",
    points: [
      "Automatic inventory updates",
      "Smart notifications and reminders",
      "Auto-generated reports and invoices",
    ],
    liveBadge: "LIVE · AUTOMATION",
    statusBadge: "RUNNING",
    orderTitle: "Stock Sync",
    orderDetail: "Completed",
    orderState: "Success",
    orderIcon: Box,
    rows: [
      {
        title: "Daily Reports",
        detail: "Generated",
        icon: ReceiptText,
        iconClassName: "bg-brand text-white",
      },
      {
        title: "Smart Alerts",
        detail: "10 Notifications",
        icon: BellRing,
        iconClassName: "bg-amber text-white",
      },
      {
        title: "Auto Reordering",
        detail: "Updated across every channel",
        icon: RefreshCw,
        iconClassName: "bg-[#1046c9] text-white",
      },
    ],
  },
  {
    label: "04 · Manage Anytime, Anywhere",
    title: "Your business",
    accent: "Always with you",
    description:
      "Review sales, inventory, and business performance anytime from your phone or tablet—wherever you go.",
    points: [
      "Access your business from any device",
      "Monitor operations in real time",
      "Stay connected anytime, anywhere",
    ],
    liveBadge: "LIVE · MOBILE ACCESS",
    statusBadge: "CONNECTED",
    orderTitle: "Mobile Dashboard",
    orderDetail: "iPhone • iPad • Tablet",
    orderState: "Online",
    orderIcon: Smartphone,
    rows: [
      {
        title: "Sales Overview",
        detail: "Check revenue anytime",
        icon: BarChart3,
        iconClassName: "bg-brand text-white",
      },
      {
        title: "Inventory Status",
        detail: "Monitor stock anywhere",
        icon: Boxes,
        iconClassName: "bg-amber text-white",
      },
      {
        title: "Business Alerts",
        detail: "Instant notifications",
        icon: BellRing,
        iconClassName: "bg-[#1046c9] text-white",
      },
    ],
  },
];

function DashboardCard({ card }: { card: ShowcaseCard }) {
  const OrderIcon = card.orderIcon;

  return (
    <div className="px-5 py-5 sm:px-7 lg:h-full lg:overflow-hidden lg:px-9 lg:py-4">
      <p className="font-mono text-xs font-semibold tracking-[0.16em] text-brand sm:text-sm">
        {card.label}
      </p>

      <div
        className="
          mt-4 grid items-center gap-7
          lg:mt-1
          lg:grid-cols-[1.15fr_0.85fr]
          lg:gap-10
          xl:grid-cols-[1.2fr_0.8fr]
          xl:gap-12
        "
      >
        {/* Left content */}
        <div className="min-w-0 lg:py-3">
          <h2
            className="
              max-w-[760px]
              font-sans
              text-[2.8rem]
              font-medium
              leading-[0.92]
              tracking-[-0.055em]
              text-brand
              sm:text-[3.6rem]
              md:text-[4.1rem]
             lg:text-[2 rem]
             xl:text-[2 rem]
              2xl:text-[2 rem]
            "
          >
            <span className="block">{card.title}</span>

            <span className="mt-1 block text-amber">
              {card.accent}
            </span>
          </h2>

          <p
            className="
              mt-5 max-w-xl
              text-[15px]
              leading-6
              text-muted-foreground
              sm:text-base
              lg:text-[1.05rem]
              lg:leading-7
            "
          >
            {card.description}
          </p>

          <ul className="mt-5 space-y-3">
            {card.points.map((point) => (
              <li
                key={point}
                className="
                  flex items-center gap-3
                  text-[15px]
                  font-medium
                  text-foreground
                  sm:text-base
                "
              >
                <span
                  className="
                    grid size-6 shrink-0 place-items-center
                    rounded-full
                    bg-brand-soft
                    dark:bg-brand/15
                  "
                >
                  <Check
                    className="size-3.5 text-brand"
                    strokeWidth={2.5}
                  />
                </span>

                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right dashboard */}
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span
              className="
                inline-flex items-center gap-2
                rounded-full
                bg-[#083b22]
                px-3.5 py-1.5
                text-xs font-bold text-white
                sm:text-sm
              "
            >
              <span className="size-2 rounded-full bg-amber" />
              {card.liveBadge}
            </span>

            <span
              className="
                inline-flex items-center gap-2
                rounded-full
                bg-muted
                px-3.5 py-1.5
                text-xs font-semibold
                text-muted-foreground
                sm:text-sm
              "
            >
              <span className="size-2 rounded-full bg-brand" />
              {card.statusBadge}
            </span>
          </div>

          <div
            className="
              mt-4 flex items-center gap-3
              rounded-[18px]
              border border-secondary
              bg-amber-soft
              px-3.5 py-3
              dark:border-amber/30
              dark:bg-amber/10
            "
          >
            <span
              className="
                grid size-11 shrink-0 place-items-center
                rounded-xl
                bg-brand
                text-white
              "
            >
              <OrderIcon className="size-5" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-bold text-foreground lg:text-[1.05rem]">
                {card.orderTitle}
              </p>

              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {card.orderDetail}
              </p>
            </div>

            <span
              className="
                shrink-0 rounded-full
                bg-[#FEB90D]
                px-3.5 py-1
                text-sm font-bold
                text-[#3d2a00]
              "
            >
              {card.orderState}
            </span>
          </div>

          <div className="mt-3 space-y-2.5">
            {card.rows.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    flex items-center gap-3
                    rounded-[18px]
                    border border-border
                    bg-card
                    px-3.5 py-3
                    shadow-sm
                  "
                >
                  <span
                    className={[
                      "grid size-11 shrink-0 place-items-center rounded-xl",
                      item.iconClassName,
                    ].join(" ")}
                  >
                    <Icon className="size-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold text-card-foreground">
                      {item.title}
                    </p>

                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>

                  <ChevronRight className="size-5 shrink-0 text-muted-foreground/60" />
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
  return (
    <section
      aria-label="Dashboard and inventory sync showcase"
      className="
         relative
        overflow-visible
        px-6
        pb-8
        pt-6
        dark:bg-background
        sm:px-10
        sm:pt-8
        lg:pb-6
        lg:pt-10
      "
    >
      <div className="relative mx-auto w-full max-w-7xl">
        {SHOWCASE_CARDS.map((card, index) => (
          <StickyStackCard
            key={`${card.label}-${index}`}
            index={index}
          >
            <DashboardCard card={card} />
          </StickyStackCard>
        ))}

        {/* Extra scrolling space for the sticky animation */}
        <div
          aria-hidden="true"
          className="h-[25vh] sm:h-[35vh] lg:h-[45vh]"
        />
      </div>
    </section>
  );
}