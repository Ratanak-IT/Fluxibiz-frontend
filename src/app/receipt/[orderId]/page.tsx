import type { Metadata } from "next";
import ReceiptComponent from "@/components/receipt/receipt-component";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Order Receipt",
  robots: NOINDEX,
};

export default function ReceiptPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  return <ReceiptComponent params={params} />;
}
