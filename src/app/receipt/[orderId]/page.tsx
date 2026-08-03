import ReceiptComponent from "@/components/receipt/receipt-component";

export default function ReceiptPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  return <ReceiptComponent params={params} />;
}
