import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex w-fit shrink-0 items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
