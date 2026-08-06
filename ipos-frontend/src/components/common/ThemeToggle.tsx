"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  mobile?: boolean;
  showLabel?: boolean;
}

export default function ThemeToggle({
  mobile = false,
  showLabel = false,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const handleToggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const mobileClassName = `
    group
    relative
    h-11
    w-full
    shrink-0
    justify-start
    gap-3
    rounded-lg
    !bg-transparent
    px-3
    text-base
    font-bold
    text-[#1f2937]
    shadow-none
    hover:!bg-transparent
    hover:text-primary
    focus-visible:!bg-transparent
    active:!bg-transparent

    dark:!bg-transparent
    dark:text-white
    dark:hover:!bg-transparent
    dark:hover:text-primary
    dark:focus-visible:!bg-transparent
    dark:active:!bg-transparent
  `;

  const desktopClassName = `
    group
    relative
    size-10
    min-h-10
    min-w-10
    shrink-0
    rounded-full
    !bg-transparent
    p-0
    text-[#6a6a6a]
    shadow-none
    hover:!bg-transparent
    hover:text-secondary
    focus-visible:!bg-transparent
    active:!bg-transparent

    dark:!bg-transparent
    dark:text-white
    dark:hover:!bg-transparent
    dark:hover:text-secondary
    dark:focus-visible:!bg-transparent
    dark:active:!bg-transparent
  `;

  return (
    <Button
      type="button"
      variant="ghost"
      size={mobile ? "default" : "icon"}
      onClick={mounted ? handleToggleTheme : undefined}
      disabled={!mounted}
      aria-label={
        !mounted
          ? "Switch theme"
          : isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
      }
      title={
        !mounted
          ? "Switch theme"
          : isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
      }
      className={mobile ? mobileClassName : desktopClassName}
    >
      {/*
        Fixed icon container:
        both Sun and Moon always occupy the same width,
        height, left position, and center alignment.
      */}
      <span
        aria-hidden="true"
        className="
          relative
          grid
          size-6
          shrink-0
          place-items-center
        "
      >
        <Sun
          className={`
            absolute
            inset-0
            size-6
            stroke-current
            transition-opacity
            duration-200
            group-hover:stroke-secondary

            ${
              mounted && !isDark
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }
          `}
          strokeWidth={2}
        />

        <Moon
          className={`
            absolute
            inset-0
            size-6
            stroke-current
            transition-opacity
            duration-200
            group-hover:stroke-secondary

            ${
              mounted && isDark
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }
          `}
          strokeWidth={2}
        />
      </span>

      {mobile && showLabel && (
        <span className="min-w-0">
          {mounted
            ? isDark
              ? "Light mode"
              : "Dark mode"
            : "Theme"}
        </span>
      )}

      <span className="sr-only">
        {!mounted
          ? "Switch theme"
          : isDark
            ? "Switch to light mode"
            : "Switch to dark mode"}
      </span>
    </Button>
  );
}