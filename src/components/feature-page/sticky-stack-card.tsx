import type { CSSProperties, ReactNode } from "react";

interface StickyStackCardProps {
  index: number;
  children: ReactNode;
}

const STACK_STEP = 34;

export function StickyStackCard({ index, children }: StickyStackCardProps) {
  const stackStyle = {
    "--stack-shift": `${index * STACK_STEP}px`,
    zIndex: index + 10,
  } as CSSProperties;

  return (
    <div
      className={[
        "relative mx-auto w-full",
        "rounded-[28px]",
        "border border-black/5 dark:border-white/10",
        "bg-card text-card-foreground",
        "shadow-[0_30px_80px_-28px_rgba(0,0,0,0.42)]",
        "dark:shadow-[0_30px_80px_-24px_rgba(0,0,0,0.8)]",

        "my-5 min-h-[500px]",

        // គ្រប់កាត៖ top ដូចគ្នា កម្ពស់ដូចគ្នា margin ដូចគ្នា
        "lg:sticky",
        "lg:top-[64px]",
        "lg:translate-y-[var(--stack-shift)]",
        "lg:my-0",
        "lg:mb-[16vh]",
        "lg:h-[clamp(470px,62vh,530px)]",
        "lg:min-h-0",
        "lg:w-full",
        "lg:overflow-hidden",
      ].join(" ")}
      style={stackStyle}>
      {children}
    </div>
  );
}
