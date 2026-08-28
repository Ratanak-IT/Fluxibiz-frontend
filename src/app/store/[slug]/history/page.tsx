"use client";

import PaymentHistoryComponent from "@/components/payment-history/payment-history-component";

/**
 * The Mini App's "Payment" tab — same component the site-wide
 * /payment-history page uses, just nested under /store/[slug] so it picks
 * up TmaNavbar/TmaBottomTabBar from the layout above instead of losing
 * them (the site-wide route sits outside that layout entirely).
 */
export default function StoreHistoryPage() {
  return <PaymentHistoryComponent />;
}
