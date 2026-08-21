"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import {
  CheckCircle2,
  Loader2,
  QrCode,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

type PaymentStep = "PAYMENT" | "PROCESSING" | "DONE";

type OrderStatusResponse = {
  orderId: string;
  invoiceNumber: string;
  status: string;
  subtotal: number;
  total: number;
  currency: string;
  qrPayload: string;
  qrImageUri: string;
  bakongDeepLink: string;
  abapayDeeplink: string;
};

export default function MessengerCheckoutPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = use(params);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [step, setStep] = useState<PaymentStep>("PAYMENT");
  const [orderData, setOrderData] = useState<OrderStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 💡 ប្រកាស Function សម្រាប់បិទ Webview នៅខាងលើ មុន useEffect
  const closeMessengerWebview = useCallback(() => {
    if (typeof window !== "undefined" && (window as any).MessengerExtensions) {
      (window as any).MessengerExtensions.requestCloseBrowser(
        () => console.log("Messenger Webview closed"),
        (err: any) => console.error("Error closing Webview", err),
      );
    }
  }, []);

  // 1. ទាញយកទិន្នន័យ Order & KHQR
  useEffect(() => {
    if (!orderId) {
      setError("មិនមានទិន្នន័យលេខបញ្ជាទិញ (Order ID missing)");
      setLoading(false);
      return;
    }

    async function fetchOrderDetails() {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(
          `${apiBase}/api/v1/public/orders/${orderId}/status`,
        );
        if (res.ok) {
          const data: OrderStatusResponse = await res.json();
          setOrderData(data);
          if (data.status === "PAID") {
            setStep("DONE");
          }
        } else {
          setError("រកមិនឃើញព័ត៌មានការបញ្ជាទិញឡើយ");
        }
      } catch (err) {
        console.error("Failed to load order details", err);
        setError("មានបញ្ហាក្នុងការទាញយកទិន្នន័យ");
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  // 2. ពេលចុច "Pay via Bakong App" (App-to-App)
  const handlePayWithBakong = () => {
    setStep("PROCESSING");
    if (orderData?.bakongDeepLink) {
      window.location.href = orderData.bakongDeepLink;
    }
  };

  const handlePayWithAba = () => {
    setStep("PROCESSING");
    if (orderData?.abapayDeeplink) {
      window.location.href = orderData.abapayDeeplink;
    }
  };

  // 3. Polling ឆែកមើល Status ពេលកំពុង PROCESSING
  useEffect(() => {
    if (step !== "PROCESSING" || !orderId) return;

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${apiBase}/api/v1/public/orders/${orderId}/status`,
        );
        if (res.ok) {
          const data: OrderStatusResponse = await res.json();
          if (data.status === "PAID") {
            clearInterval(interval);
            setStep("DONE");
          }
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [step, orderId]);

  // 4. បិទ Messenger Webview ស្វ័យប្រវត្តិ ពេល DONE ក្រោយ ២ វិនាទី
  useEffect(() => {
    if (step === "DONE") {
      const timer = setTimeout(() => {
        closeMessengerWebview();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [step, closeMessengerWebview]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-6 text-center bg-white">
        <p className="text-sm font-semibold text-red-600">
          {error || "Something went wrong"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-xl bg-slate-900 px-5 py-2 text-xs font-medium text-white"
        >
          ព្យាយាមម្តងទៀត
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 p-4 font-sans text-slate-900">
      {/* SDK សម្រាប់បិទ Webview */}
      <Script
        src="https://connect.facebook.net/en_US/messenger.Extensions.js"
        strategy="lazyOnload"
      />

      {/* 📍 Progress Bar Step Indicator */}
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
        <StepBadge
          active={step === "PAYMENT"}
          completed={step === "PROCESSING" || step === "DONE"}
          stepNumber="1"
          label="ទូទាត់"
        />
        <div
          className={`h-0.5 flex-1 mx-2 ${step !== "PAYMENT" ? "bg-emerald-500" : "bg-slate-200"}`}
        />
        <StepBadge
          active={step === "PROCESSING"}
          completed={step === "DONE"}
          stepNumber="2"
          label="ផ្ទៀងផ្ទាត់"
        />
        <div
          className={`h-0.5 flex-1 mx-2 ${step === "DONE" ? "bg-emerald-500" : "bg-slate-200"}`}
        />
        <StepBadge
          active={step === "DONE"}
          completed={step === "DONE"}
          stepNumber="3"
          label="ជោគជ័យ"
        />
      </div>

      {/* 1️⃣ STEP 1: PAYMENT */}
      {step === "PAYMENT" && (
        <div className="flex flex-1 flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
          <div>
            <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 mb-2">
              វិក្កយបត្រ៖ {orderData.invoiceNumber}
            </span>
            <h1 className="text-lg font-bold text-slate-800">
              ទូទាត់ប្រាក់តាម KHQR
            </h1>
            <p className="mt-1 text-3xl font-black text-emerald-600">
              ${orderData.total.toFixed(2)}{" "}
              {orderData.currency !== "USD" ? orderData.currency : ""}
            </p>

            {/* KHQR Code Display */}
            <div className="my-4 flex justify-center">
              <div className="rounded-2xl border-2 border-emerald-500/20 bg-white p-3 shadow-inner">
                {orderData.qrImageUri ? (
                  <Image
                    src={orderData.qrImageUri}
                    width={224}
                    height={224}
                    alt="KHQR Code"
                    className="h-56 w-56 rounded-xl object-contain"
                  />
                ) : (
                  <div className="flex h-56 w-56 items-center justify-center rounded-xl bg-slate-100">
                    <QrCode className="h-12 w-12 animate-pulse text-slate-400" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handlePayWithBakong}
            disabled={!orderData?.bakongDeepLink}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-base font-bold text-white shadow-lg shadow-red-600/30 active:scale-[0.98] transition-all hover:bg-red-700 disabled:opacity-40"
          >
            <ExternalLink className="h-5 w-5" />
            ទូទាត់តាម Bakong App
          </button>

          <button
            onClick={handlePayWithAba}
            disabled={!orderData?.abapayDeeplink}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 disabled:opacity-40"
          >
            <ExternalLink className="h-5 w-5" />
            ទូទាត់តាម ABA Pay
          </button>
        </div>
      )}

      {/* 2️⃣ STEP 2: PROCESSING */}
      {step === "PROCESSING" && (
        <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            កំពុងផ្ទៀងផ្ទាត់ការទូទាត់...
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            សូមរង់ចាំបន្តិច ប្រព័ន្ធកំពុងទទួលទិន្នន័យទូទាត់ប្រាក់ពី Bakong
          </p>
        </div>
      )}

      {/* 3️⃣ STEP 3: DONE */}
      {step === "DONE" && (
        <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <div className="mb-6 flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            ទូទាត់ប្រាក់ជោគជ័យ!
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            វិក្កយបត្រត្រូវបានផ្ញើចូលក្នុង Messenger Chat របស់អ្នករួចរាល់ហើយ។
          </p>
          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
            <ShieldCheck className="h-4 w-4" /> ផ្ទាំងនេះនឹងបិទស្វ័យប្រវត្តិ...
          </span>
        </div>
      )}
    </div>
  );
}

function StepBadge({ active, completed, stepNumber, label }: any) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
          completed
            ? "bg-emerald-500 text-white"
            : active
              ? "bg-slate-900 text-white ring-4 ring-slate-900/10"
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {completed ? "✓" : stepNumber}
      </div>
      <span
        className={`text-xs font-semibold ${active || completed ? "text-slate-900" : "text-slate-400"}`}
      >
        {label}
      </span>
    </div>
  );
}