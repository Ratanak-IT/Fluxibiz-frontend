"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export default function ThemeToggle({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size={mobile ? "default" : "icon"}
        className={
          mobile
            ? `
              group
              h-11
              w-full
              justify-start
              gap-3
              rounded-lg
              bg-transparent
              px-3
              text-[#6a6a6a]
              shadow-none
              hover:!bg-transparent
              hover:text-secondary
              focus-visible:!bg-transparent
              active:!bg-transparent
            `
            : `
              group
              relative
              size-10
              rounded-full
              bg-transparent
              text-[#6a6a6a]
              shadow-none
              hover:!bg-transparent
              hover:text-secondary
              focus-visible:!bg-transparent
              active:!bg-transparent
            `
        }
        aria-label="Switch theme"
      >
        <Sun className="size-6 stroke-current transition-colors duration-200 group-hover:stroke-secondary" />

        {mobile && <span>Theme</span>}
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size={mobile ? "default" : "icon"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={
        mobile
          ? `
            group
            relative
            h-11
            w-full
            justify-start
            gap-3
            rounded-lg
            bg-transparent
            px-3
            text-[#6a6a6a]
            shadow-none
            hover:!bg-transparent
            hover:text-secondary
            focus-visible:!bg-transparent
            active:!bg-transparent
            dark:bg-transparent
            dark:text-[#6a6a6a]
            dark:hover:!bg-transparent
            dark:hover:text-secondary
          `
          : `
            group
            relative
            size-10
            rounded-full
            bg-transparent
            text-[#6a6a6a]
            shadow-none
            hover:!bg-transparent
            hover:text-secondary
            focus-visible:!bg-transparent
            active:!bg-transparent
            dark:bg-transparent
            dark:text-[#6a6a6a]
            dark:hover:!bg-transparent
            dark:hover:text-secondary
          `
      }
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun
        className="
          size-6
          rotate-0
          scale-100
          stroke-current
          transition-all
          duration-200
          group-hover:stroke-secondary
          dark:-rotate-90
          dark:scale-0
        "
      />

      <Moon
        className={
          mobile
            ? `
              absolute
              left-3
              size-6
              rotate-90
              scale-0
              stroke-current
              transition-all
              duration-200
              group-hover:stroke-secondary
              dark:relative
              dark:left-auto
              dark:rotate-0
              dark:scale-100
            `
            : `
              absolute
              size-6
              rotate-90
              scale-0
              stroke-current
              transition-all
              duration-200
              group-hover:stroke-secondary
              dark:rotate-0
              dark:scale-100
            `
        }
      />

      {mobile && (
        <span>
          {isDark ? "Light mode" : "Dark mode"}
        </span>
      )}

      <span className="sr-only">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </Button>
  );
}