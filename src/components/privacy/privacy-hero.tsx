import { COMPANY_NAME, LAST_UPDATED } from "@/lib/privacy/privacy-content";
import { ShieldCheck, Clock } from "lucide-react";


export function PrivacyHero() {
  return (
    <header className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-[#00932A]/5 via-white to-white dark:border-card dark:from-[#21B94B]/10 dark:via-background dark:to-background">
      {/* subtle decorative glow, purely presentational */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#FEB90D]/10 blur-3xl dark:bg-[#F5B91B]/10"
      />

      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div
          className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00932A] text-white shadow-lg shadow-[#00932A]/20 dark:bg-[#21B94B] dark:shadow-[#21B94B]/20"
          aria-hidden="true"
        >
          <ShieldCheck className="h-7 w-7" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-[#F5F5F5] sm:text-5xl">
          Privacy Policy
        </h1>

        <p className="mt-4 max-w-xl text-base leading-[1.8] text-gray-600 dark:text-gray-300 sm:text-lg">
          This policy explains what information {COMPANY_NAME} collects across our
          marketplace, point-of-sale, and messaging products, and how we protect it.
        </p>

        {/* <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>
            Last updated: <time dateTime="2026-08-01">{LAST_UPDATED}</time>
          </span>
        </div> */}
      </div>
    </header>
  );
}
