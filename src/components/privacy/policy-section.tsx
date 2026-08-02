import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { FadeIn } from "./fade-in";

interface PolicySectionProps {
  id: string;
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}


export function PolicySection({ id, icon: Icon, title, children }: PolicySectionProps) {
  return (
    <FadeIn>
      <section
        id={id}
        aria-labelledby={`${id}-heading`}
        className="scroll-mt-28 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#2D2D2D] dark:bg-[#1E1E1E] sm:p-8"
      >
        <div className="mb-4 flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00932A]/10 text-[#00932A] dark:bg-[#21B94B]/10 dark:text-[#21B94B]"
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" />
          </span>
          <h2
            id={`${id}-heading`}
            className="text-xl font-bold tracking-tight text-gray-900 dark:text-[#F5F5F5] sm:text-2xl"
          >
            {title}
          </h2>
        </div>
        <div className="space-y-4 leading-[1.8] text-gray-600 dark:text-gray-300">
          {children}
        </div>
      </section>
    </FadeIn>
  );
}

/**
 * Consistent bullet list styling used throughout the policy body.
 */
export function PolicyList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span
            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00932A] dark:bg-[#21B94B]"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
