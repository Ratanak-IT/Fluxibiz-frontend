"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthErrorBannerProps {
  message?: string | null;
  className?: string;
}

export function AuthErrorBanner({ message, className }: AuthErrorBannerProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-600 shadow-xs transition-all duration-200 animate-in fade-in slide-in-from-top-1 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400",
        className,
      )}
    >
      <AlertCircle className="size-4.5 shrink-0 text-red-500 dark:text-red-400" />
      <span className="leading-snug">{message}</span>
    </div>
  );
}
