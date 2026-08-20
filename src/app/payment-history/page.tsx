import type { Metadata } from "next";
import PaymentHistoryComponent from "@/components/payment-history/payment-history-component";
import StoreNavbar from "@/components/store/store-component/navbar";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Payment History - FluxiBiz",
  description: "View your receipts and past transactions across all stores.",
  robots: NOINDEX,
};

export default function PaymentHistoryPage() {
  return (
    <div className="relative min-h-screen bg-gray-50 pb-24 dark:bg-background lg:pb-0">
      <PaymentHistoryComponent />
      <StoreNavbar />
    </div>
  );
}
