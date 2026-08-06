import type { CSSProperties, ReactNode } from "react";

interface StickyStackCardProps {
  index: number;
  children: ReactNode;
}

const MOBILE_STACK_STEP = 14;
const TABLET_STACK_STEP = 22;
const DESKTOP_STACK_STEP = 34;

export function StickyStackCard({
  index,
  children,
}: StickyStackCardProps) {
  const stackStyle = {
    "--mobile-stack-shift": `${index * MOBILE_STACK_STEP}px`,
    "--tablet-stack-shift": `${index * TABLET_STACK_STEP}px`,
    "--desktop-stack-shift": `${index * DESKTOP_STACK_STEP}px`,
    zIndex: index + 10,
  } as CSSProperties;

  return (
    <div
      className={[
        // Base card
        "relative mx-auto w-full",
        "overflow-hidden rounded-[22px]",
        "border border-border dark:border-white/10",
        "bg-card text-card-foreground",

        // Shadow
        "shadow-[0_20px_50px_-24px_rgba(0,0,0,0.38)]",
        "dark:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.75)]",

        // Sticky stack for mobile
        "sticky",
        "top-[72px]",
        "translate-y-[var(--mobile-stack-shift)]",
        "mb-[18vh]",
        "min-h-[500px]",

        // Smooth animation
        "transition-[transform,box-shadow,border-color]",
        "duration-500",
        "ease-out",
        "will-change-transform",

        // Tablet
        "sm:top-[80px]",
        "sm:translate-y-[var(--tablet-stack-shift)]",
        "sm:rounded-[26px]",
        "sm:min-h-[510px]",
        "sm:mb-[20vh]",

        // Desktop
        "lg:top-[64px]",
        "lg:translate-y-[var(--desktop-stack-shift)]",
        "lg:rounded-[28px]",
        "lg:mb-[16vh]",
        "lg:h-[clamp(470px,62vh,530px)]",
        "lg:min-h-0",
      ].join(" ")}
      style={stackStyle}
    >
      {children}
    </div>
  );
}