"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type Direction = "up" | "left" | "right" | "scale" | "draw";

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  threshold = 0.18,
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      data-visible={visible}
      data-direction={direction}
      className={cn("scroll-reveal", className)}
      style={{ "--scroll-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
