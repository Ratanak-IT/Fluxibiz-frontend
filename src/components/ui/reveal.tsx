"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={revealVariants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -60px" }}
    >
      {children}
    </motion.div>
  );
}
