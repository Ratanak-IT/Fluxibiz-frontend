import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function GlassCard({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/20 bg-white/12 shadow-[0_24px_70px_-32px_rgba(0,55,16,0.65)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
