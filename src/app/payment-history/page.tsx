import PaymentHistoryComponent from "@/components/payment-history/payment-history-component";
import StoreNavbar from "@/components/store/store-component/navbar";

export const metadata = {
  title: "Payment History - FluxiBiz",
  description: "View your receipts and past transactions across all stores.",
};

export default function PaymentHistoryPage() {
  return (
    <div className="relative min-h-screen bg-gray-50 pb-24 dark:bg-background lg:pb-0">
      <PaymentHistoryComponent />
      <StoreNavbar />
    </div>
  );
}
