"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ApiErrorFallbackProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  backHref?: string;
  backLabel?: string;
  variant?: "full" | "card" | "compact";
  iconType?: "error" | "wifi";
  className?: string;
}

export default function ApiErrorFallback({
  title,
  description,
  onRetry,
  isRetrying = false,
  backHref = "/store",
  backLabel,
  variant = "card",
  iconType = "error",
  className,
}: ApiErrorFallbackProps) {
  const defaultTitle = title || "មិនអាចទាញយកទិន្នន័យបានឡើយ";
  const defaultDesc =
    description ||
    "មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Server ឬទិន្នន័យមិនទាន់រួចរាល់។ សូមព្យាយាមម្ដងទៀត។";

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive dark:bg-destructive/10",
          className
        )}
      >
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
          <span className="font-medium">{defaultTitle}</span>
        </div>
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            disabled={isRetrying}
            className="h-8 gap-1.5 rounded-lg border-destructive/30 text-xs font-semibold hover:bg-destructive/10"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isRetrying && "animate-spin")} />
            {isRetrying ? "កំពុងទាញយក..." : "ព្យាយាមឡើងវិញ"}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        variant === "full"
          ? "min-h-[50vh] px-4 py-16"
          : "my-6 rounded-3xl border border-neutral-200/80 bg-white/90 p-8 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-card/70",
        className
      )}
    >
      {/* Animated Glowing Icon Ring */}
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/10 blur-xl dark:bg-red-500/20" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-red-200/60 bg-gradient-to-b from-red-50 to-red-100/50 shadow-inner dark:border-red-900/40 dark:from-red-950/40 dark:to-red-900/20">
          {iconType === "wifi" ? (
            <WifiOff className="h-8 w-8 text-red-500 dark:text-red-400" />
          ) : (
            <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
          )}
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="max-w-md text-lg font-bold tracking-tight text-neutral-900 sm:text-xl dark:text-foreground">
        {defaultTitle}
      </h3>
      <p className="mt-2 max-w-md text-sm text-neutral-500 dark:text-muted-foreground">
        {defaultDesc}
      </p>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            onClick={onRetry}
            disabled={isRetrying}
            className="gap-2 rounded-full bg-green-600 px-5 text-sm font-semibold text-white shadow-md hover:bg-green-700 dark:bg-primary dark:text-primary-foreground"
          >
            <RefreshCw className={cn("h-4 w-4", isRetrying && "animate-spin")} />
            {isRetrying ? "កំពុងទាញយក..." : "ព្យាយាមឡើងវិញ (Retry)"}
          </Button>
        )}

        {backHref && (
          <Link href={backHref}>
            <Button
              variant="outline"
              className="gap-2 rounded-full border-neutral-300 px-5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel || "ត្រឡប់ទៅហាង (Back)"}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
