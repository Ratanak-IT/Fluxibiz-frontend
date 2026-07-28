import {
    Check,
    MessageCircle,
    Minus,
    Plus,
    QrCode,
    Search,
    Send,
    Store,
    TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Designed FluxiBiz product-UI fragments.
 *
 * These stand in for real application screenshots across the landing page so
 * every section shows product surfaces rather than stock photography. They are
 * built from design tokens only, render on the server, and carry no live data —
 * every value shown is demonstration data.
 *
 * Status is never signalled by colour alone: low stock pairs the rose token with
 * both an icon and the words "Low stock", so it survives colourblindness,
 * greyscale print and forced-colours mode.
 */

function Frame({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={cn(
                "h-full w-full overflow-hidden rounded-xl border border-hairline bg-card p-3",
                className,
            )}
            aria-hidden
        >
            {children}
        </div>
    );
}

/** Small window chrome so a fragment reads as an app screen, not a card. */
function Chrome({ title }: { title: string }) {
    return (
        <div className="mb-2.5 flex items-center gap-2 border-b border-hairline pb-2">
            <span className="flex gap-1">
                <span className="size-1.5 rounded-full bg-hairline" />
                <span className="size-1.5 rounded-full bg-hairline" />
                <span className="size-1.5 rounded-full bg-hairline" />
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                {title}
            </span>
        </div>
    );
}

/* ── Point of sale ─────────────────────────────────────────────────────── */

const POS_TILES = ["Iced Latte", "Lok Lak", "Cola", "Amok", "Coffee", "Tea"];

export function PosMockup({ className }: { className?: string }) {
    return (
        <Frame className={className}>
            <Chrome title="Point of sale" />

            <div className="flex gap-2.5">
                <div className="min-w-0 flex-[1.4]">
                    <div className="mb-2 flex items-center gap-1.5 rounded-md bg-muted px-2 py-1.5">
                        <Search className="size-3 shrink-0 text-muted-foreground" />
                        <span className="text-[9px] text-muted-foreground">
                            Search items
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                        {POS_TILES.map((tile, i) => (
                            <div
                                key={tile}
                                className={cn(
                                    "rounded-md border px-1.5 py-2 text-[8px] font-medium leading-tight",
                                    i === 0
                                        ? "border-brand bg-brand-soft text-brand-deep"
                                        : "border-hairline bg-background text-muted-foreground",
                                )}
                            >
                                {tile}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col rounded-md border border-hairline bg-background p-2">
                    <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
                        Order #2241
                    </p>

                    <div className="mt-1.5 space-y-1.5">
                        {[
                            { n: "Iced Latte", q: 1, p: "2.75" },
                            { n: "Lok Lak", q: 2, p: "13.00" },
                        ].map((line) => (
                            <div
                                key={line.n}
                                className="flex items-center justify-between gap-1"
                            >
                                <span className="truncate text-[8px] text-foreground">
                                    {line.n}
                                </span>
                                <span className="flex items-center gap-0.5 text-muted-foreground">
                                    <Minus className="size-2" />
                                    <span className="font-mono text-[8px]">
                                        {line.q}
                                    </span>
                                    <Plus className="size-2" />
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto space-y-1.5 border-t border-hairline pt-1.5">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-[8px] uppercase text-muted-foreground">
                                Total
                            </span>
                            <span className="font-mono text-[11px] font-bold text-foreground">
                                $17.25
                            </span>
                        </div>
                        <div className="rounded-md bg-brand py-1 text-center text-[8px] font-semibold text-brand-foreground">
                            Charge
                        </div>
                    </div>
                </div>
            </div>
        </Frame>
    );
}

/* ── Opening the register ──────────────────────────────────────────────── */

export function OpenRegisterMockup({ className }: { className?: string }) {
    return (
        <Frame className={className}>
            <Chrome title="Open register" />

            <div className="flex items-baseline justify-between">
                <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
                    Starting cash
                </span>
                <span className="font-mono text-lg font-bold text-foreground">
                    $100.00
                </span>
            </div>

            <ul className="mt-2 space-y-1">
                {[
                    { task: "Confirm cash drawer", done: true },
                    { task: "Review low-stock items", done: true },
                    { task: "Check pending orders", done: false },
                ].map((item) => (
                    <li
                        key={item.task}
                        className="flex items-center gap-1.5 rounded-md border border-hairline bg-background px-2 py-1"
                    >
                        <span
                            className={cn(
                                "flex size-3 shrink-0 items-center justify-center rounded-full",
                                item.done
                                    ? "bg-brand-soft text-brand-deep"
                                    : "border border-hairline",
                            )}
                        >
                            {item.done ? <Check className="size-2" /> : null}
                        </span>
                        <span className="text-[8px] text-foreground">
                            {item.task}
                        </span>
                    </li>
                ))}
            </ul>

            <p className="mt-2 border-t border-hairline pt-1.5 font-mono text-[7px] uppercase tracking-[0.12em] text-muted-foreground">
                Shift 07:00 · demo data
            </p>
        </Frame>
    );
}

/* ── Inventory ─────────────────────────────────────────────────────────── */

const STOCK_ROWS = [
    { name: "Coffee beans", qty: "72 kg", low: false },
    { name: "Rice", qty: "45 bags", low: false },
    { name: "Cola cans", qty: "8", low: true },
] as const;

export function StockMockup({ className }: { className?: string }) {
    return (
        <Frame className={className}>
            <Chrome title="Inventory" />

            <ul className="space-y-1.5">
                {STOCK_ROWS.map((row) => (
                    <li
                        key={row.name}
                        className="flex items-center justify-between gap-2 rounded-md border border-hairline bg-background px-2 py-1.5"
                    >
                        <span className="min-w-0 truncate text-[9px] font-medium text-foreground">
                            {row.name}
                        </span>

                        <span className="flex shrink-0 items-center gap-1.5">
                            <span className="font-mono text-[9px] font-semibold text-foreground">
                                {row.qty}
                            </span>
                            {row.low ? (
                                <span className="flex items-center gap-0.5 rounded-full bg-rose/10 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wide text-rose">
                                    <TriangleAlert className="size-2" />
                                    Low stock
                                </span>
                            ) : (
                                <span className="flex items-center gap-0.5 rounded-full bg-brand-soft px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wide text-brand-deep">
                                    <Check className="size-2" />
                                    In stock
                                </span>
                            )}
                        </span>
                    </li>
                ))}
            </ul>
        </Frame>
    );
}

/* ── Unified orders ────────────────────────────────────────────────────── */

const CHANNELS = [
    { label: "POS", icon: Store },
    { label: "Storefront", icon: Store },
    { label: "Telegram", icon: Send },
    { label: "Messenger", icon: MessageCircle },
] as const;

const ORDER_QUEUE = [
    { id: "#2241", channel: "Telegram", state: "New" },
    { id: "#2240", channel: "Storefront", state: "Accepted" },
    { id: "#2239", channel: "POS", state: "Preparing" },
    { id: "#2238", channel: "Messenger", state: "Completed" },
] as const;

export function OrderQueueMockup({
    className,
    inverted = false,
}: {
    className?: string;
    inverted?: boolean;
}) {
    return (
        <div
            className={cn(
                "h-full w-full overflow-hidden rounded-xl border p-3",
                inverted
                    ? "border-white/15 bg-white/5"
                    : "border-hairline bg-card",
                className,
            )}
            aria-hidden
        >
            <div className="mb-2.5 flex flex-wrap gap-1">
                {CHANNELS.map(({ label, icon: Icon }) => (
                    <span
                        key={label}
                        className={cn(
                            "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-medium",
                            inverted
                                ? "bg-white/10 text-white/80"
                                : "bg-muted text-muted-foreground",
                        )}
                    >
                        <Icon className="size-2" />
                        {label}
                    </span>
                ))}
            </div>

            <ul className="space-y-1.5">
                {ORDER_QUEUE.map((order) => (
                    <li
                        key={order.id}
                        className={cn(
                            "flex items-center justify-between gap-2 rounded-md px-2 py-1.5",
                            inverted
                                ? "bg-white/5"
                                : "border border-hairline bg-background",
                        )}
                    >
                        <span
                            className={cn(
                                "font-mono text-[9px] font-semibold",
                                inverted ? "text-white" : "text-foreground",
                            )}
                        >
                            {order.id}
                        </span>
                        <span
                            className={cn(
                                "min-w-0 flex-1 truncate text-[8px]",
                                inverted
                                    ? "text-white/60"
                                    : "text-muted-foreground",
                            )}
                        >
                            {order.channel}
                        </span>
                        <span
                            className={cn(
                                "shrink-0 rounded-full px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wide",
                                order.state === "Completed"
                                    ? inverted
                                        ? "bg-white/15 text-white"
                                        : "bg-brand-soft text-brand-deep"
                                    : inverted
                                      ? "bg-white/10 text-white/70"
                                      : "bg-muted text-muted-foreground",
                            )}
                        >
                            {order.state}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* ── Payments ──────────────────────────────────────────────────────────── */

export function PaymentMockup({ className }: { className?: string }) {
    return (
        <Frame className={className}>
            <Chrome title="Payment" />

            <div className="flex items-baseline justify-between">
                <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
                    Order total
                </span>
                <span className="font-mono text-lg font-bold text-foreground">
                    $17.25
                </span>
            </div>

            <div className="mt-2 flex items-center gap-1.5 rounded-md border border-amber/30 bg-amber-soft px-2 py-1.5">
                <QrCode className="size-3 shrink-0 text-amber" />
                <span className="text-[9px] font-medium text-foreground">
                    KHQR
                </span>
            </div>

            <div className="mt-2 flex items-center gap-1.5">
                <span className="rounded-full bg-muted px-1.5 py-0.5 font-mono text-[7px] font-semibold uppercase tracking-wide text-muted-foreground line-through">
                    Pending
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="flex items-center gap-0.5 rounded-full bg-brand-soft px-1.5 py-0.5 font-mono text-[7px] font-semibold uppercase tracking-wide text-brand-deep">
                    <Check className="size-2" />
                    Paid
                </span>
            </div>

            <p className="mt-2 border-t border-hairline pt-1.5 text-[8px] text-muted-foreground">
                Receipt generated
            </p>
        </Frame>
    );
}

/* ── Reports ───────────────────────────────────────────────────────────── */

const REPORT_TILES = [
    { label: "Sales", value: "$2,410" },
    { label: "Orders", value: "124" },
    { label: "Cash", value: "$840" },
    { label: "Digital", value: "$1,570" },
] as const;

/** Single-series trend. One hue, thin marks, rounded ends, 2px gaps. */
const TREND = [38, 52, 44, 66, 58, 82, 74];

export function ReportMockup({ className }: { className?: string }) {
    return (
        <Frame className={className}>
            <Chrome title="Reports" />

            <div className="grid grid-cols-2 gap-1.5">
                {REPORT_TILES.map((tile) => (
                    <div
                        key={tile.label}
                        className="rounded-md border border-hairline bg-background px-2 py-1.5"
                    >
                        <p className="text-[7px] uppercase tracking-[0.12em] text-muted-foreground">
                            {tile.label}
                        </p>
                        <p className="font-mono text-[11px] font-bold text-foreground">
                            {tile.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-2.5 flex h-10 items-end gap-0.5">
                {TREND.map((height, i) => (
                    <span
                        key={i}
                        style={{ height: `${height}%` }}
                        className={cn(
                            "flex-1 rounded-t-xs",
                            i === TREND.length - 1 ? "bg-brand" : "bg-brand/25",
                        )}
                    />
                ))}
            </div>
            <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.12em] text-muted-foreground">
                Last 7 days · demo data
            </p>
        </Frame>
    );
}

/* ── Customers ─────────────────────────────────────────────────────────── */

const CUSTOMERS = [
    { name: "Sokha Chan", tier: "Gold", orders: "42", spend: "$684" },
    { name: "Dara Kim", tier: "Silver", orders: "18", spend: "$237" },
    { name: "Srey Neang", tier: "Member", orders: "9", spend: "$112" },
] as const;

export function CustomerMockup({ className }: { className?: string }) {
    return (
        <Frame className={className}>
            <Chrome title="Customers" />

            <ul className="space-y-1.5">
                {CUSTOMERS.map((customer) => (
                    <li
                        key={customer.name}
                        className="rounded-md border border-hairline bg-background px-2 py-1.5"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="min-w-0 truncate text-[9px] font-medium text-foreground">
                                {customer.name}
                            </span>
                            <span className="shrink-0 rounded-full bg-brand-soft px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wide text-brand-deep">
                                {customer.tier}
                            </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 font-mono text-[8px] text-muted-foreground">
                            <span>{customer.orders} orders</span>
                            <span aria-hidden>·</span>
                            <span>{customer.spend}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </Frame>
    );
}

/* ── Staff access ──────────────────────────────────────────────────────── */

const ROLES = [
    { role: "Owner", access: "Full access" },
    { role: "Cashier", access: "Sell + payments" },
    { role: "Stock manager", access: "Items + stock" },
    { role: "Staff", access: "Assigned tasks" },
] as const;

export function RolesMockup({ className }: { className?: string }) {
    return (
        <Frame className={className}>
            <Chrome title="Staff access" />

            <ul className="space-y-1.5">
                {ROLES.map((entry) => (
                    <li
                        key={entry.role}
                        className="flex items-center justify-between gap-2 rounded-md border border-hairline bg-background px-2 py-1.5"
                    >
                        <span className="text-[9px] font-medium text-foreground">
                            {entry.role}
                        </span>
                        <span className="text-[8px] text-muted-foreground">
                            {entry.access}
                        </span>
                    </li>
                ))}
            </ul>
        </Frame>
    );
}

/* ── Storefront ────────────────────────────────────────────────────────── */

export function StorefrontMockup({ className }: { className?: string }) {
    return (
        <Frame className={className}>
            <Chrome title="Online storefront" />

            <div className="mb-2 flex items-center gap-1.5 rounded-md bg-muted px-2 py-1.5">
                <Search className="size-3 shrink-0 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">
                    Search products
                </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
                {["Drinks", "Meals", "Snacks", "Coffee", "Tea", "Desserts"].map(
                    (group, i) => (
                        <div
                            key={group}
                            className="rounded-md border border-hairline bg-background p-1.5"
                        >
                            <div
                                className={cn(
                                    "mb-1 h-6 rounded-sm",
                                    i % 2 === 0 ? "bg-brand-soft" : "bg-muted",
                                )}
                            />
                            <p className="truncate text-[7px] font-medium text-foreground">
                                {group}
                            </p>
                            <p className="font-mono text-[7px] text-muted-foreground">
                                $2.75
                            </p>
                        </div>
                    ),
                )}
            </div>
        </Frame>
    );
}

/* ── Social ordering ───────────────────────────────────────────────────── */

export function SocialOrderMockup({ className }: { className?: string }) {
    return (
        <Frame className={className}>
            <Chrome title="Telegram order" />

            <div className="space-y-1.5">
                <div className="max-w-[85%] rounded-lg rounded-tl-sm bg-muted px-2 py-1.5">
                    <p className="text-[8px] text-foreground">
                        1× Iced Latte, 2× Beef Lok Lak please
                    </p>
                </div>

                <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm bg-brand-soft px-2 py-1.5">
                    <p className="font-mono text-[8px] font-semibold text-brand-deep">
                        Order #2241 · $17.25
                    </p>
                    <p className="text-[8px] text-brand-deep/80">
                        Pay with KHQR to confirm
                    </p>
                </div>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-hairline pt-1.5">
                <span className="flex items-center gap-1 text-[8px] text-muted-foreground">
                    <Send className="size-2.5" />
                    Telegram
                </span>
                <span className="flex items-center gap-0.5 rounded-full bg-brand-soft px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wide text-brand-deep">
                    <Check className="size-2" />
                    Accepted
                </span>
            </div>
        </Frame>
    );
}

/* ── Owner dashboard ───────────────────────────────────────────────────── */

export function DashboardMockup({ className }: { className?: string }) {
    return (
        <Frame className={className}>
            <Chrome title="Owner dashboard" />

            <div className="grid grid-cols-3 gap-1.5">
                {[
                    { label: "Sales", value: "$2,410" },
                    { label: "Orders", value: "124" },
                    { label: "Customers", value: "86" },
                ].map((tile) => (
                    <div
                        key={tile.label}
                        className="rounded-md border border-hairline bg-background px-1.5 py-1.5"
                    >
                        <p className="text-[7px] uppercase tracking-widest text-muted-foreground">
                            {tile.label}
                        </p>
                        <p className="font-mono text-[10px] font-bold text-foreground">
                            {tile.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-2 flex h-12 items-end gap-0.5">
                {[42, 58, 50, 72, 64, 88, 78, 60].map((height, i, all) => (
                    <span
                        key={i}
                        style={{ height: `${height}%` }}
                        className={cn(
                            "flex-1 rounded-t-xs",
                            i === all.length - 1 ? "bg-brand" : "bg-brand/25",
                        )}
                    />
                ))}
            </div>

            <p className="mt-1.5 font-mono text-[7px] uppercase tracking-[0.12em] text-muted-foreground">
                Demo data
            </p>
        </Frame>
    );
}
