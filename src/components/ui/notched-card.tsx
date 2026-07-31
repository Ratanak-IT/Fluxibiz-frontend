import * as React from "react";

import { cn } from "@/lib/utils";

const R = 28;

type NotchedCardProps = React.HTMLAttributes<HTMLDivElement> & {
  surface: string;
  tabWidth?: string;
  tabSide?: "left" | "right";
};

export function NotchedCard({
  surface,
  tabWidth = "55%",
  tabSide = "left",
  className,
  children,
  ...props
}: NotchedCardProps) {
  const fillet = `radial-gradient(circle ${R}px at ${
    tabSide === "left" ? "100% 0" : "0 0"
  }, transparent ${R - 0.5}px, #000 ${R}px)`;

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <div
        className={cn(
          "flex h-7 shrink-0",
          tabSide === "right" && "flex-row-reverse",
        )}
      >
        <div
          className={cn("h-7 rounded-t-[28px]", surface)}
          style={{ width: tabWidth }}
        />
        <div className="relative flex-1">
          <div
            className={cn(
              "absolute bottom-0 h-7 w-7",
              tabSide === "left" ? "left-0" : "right-0",
              surface,
            )}
            style={{ WebkitMaskImage: fillet, maskImage: fillet }}
          />
        </div>
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col rounded-[28px]",
          tabSide === "left" ? "rounded-tl-none" : "rounded-tr-none",
          surface,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function Contours({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      {[0, 34, 68, 102].map((offset) => (
        <path
          key={offset}
          d={`M-20 ${60 + offset} C 90 ${10 + offset}, 210 ${120 + offset}, 420 ${
            30 + offset
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}
