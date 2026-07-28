import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * LANDING PAGE EDITING GUIDE
 *
 * - Change image paths in LANDING_IMAGES below.
 * - Section layout helpers and reveal animation live in this same file.
 * - Add replacement assets under public/image/landing.
 */
export const LANDING_IMAGES = {
  dashboardPreview: "/image/landing/dashboard-bo.png",
  businessToolsPreview: "/image/landing/business-tools-preview.png",
  features: {
    pos: "/image/landing/card/business.png",
    inventory: "/image/landing/card/inventory.png",
    dashboard: "/image/landing/dashboard-preview.png",
  },
  surfaces: {
    dashboard: "/image/landing/surface.png",
    storefront: "/image/landing/surface-storefront.png",
    mobile: "/image/landing/surface-mobile.png",
  },
  tools: {
    posScreen: "/image/landing/pos-screen.png",
    product: "/image/landing/product-shoe.png",
  },
  migration: "/image/landing/migration-illustration.svg",
} as const;

type RevealVariant = "up" | "left" | "right" | "pop" | "draw";

export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  duration = 500,
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
}) {
  const style = {
    "--reveal-delay": `${delay}ms`,
    "--reveal-duration": `${duration}ms`,
  } as CSSProperties;

  return (
    <div
      className={cn("landing-reveal", `landing-reveal-${variant}`, className)}
      style={style}
    >
      {children}
    </div>
  );
}

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("w-full px-5 py-20 md:px-8 md:py-28", className)}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({
  children,
  className,
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.18em] text-amber",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function RuledEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-px w-6 bg-brand/40" aria-hidden />
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand/70">
        {children}
      </span>
      <span className="h-px w-6 bg-brand/40" aria-hidden />
    </div>
  );
}

export function SectionHeading({
  children,
  description,
  align = "left",
  className,
}: {
  children: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <h2
        className={cn(
          "text-3xl font-extrabold leading-[1.1] text-brand-deep md:text-[2.75rem]",
          align === "center" && "mx-auto max-w-3xl",
        )}
      >
        {children}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-[15px] leading-relaxed text-muted-foreground",
            align === "center" ? "mx-auto max-w-2xl" : "max-w-xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function Accent({ children }: { children: ReactNode }) {
  return <span className="text-amber">{children}</span>;
}
