"use client";

import { Moon, Sun } from "lucide-react";

/**
 * No React state and no `mounted` flag on purpose.
 *
 * Both icons are always rendered — identically on server and client — and CSS
 * decides which is visible. That means no hydration mismatch and no flash,
 * without needing to know the theme at render time.
 */
export function ThemeToggle() {
  const toggle = () => {
    const dark = document.documentElement.classList.toggle("dark");
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    localStorage.setItem("rd:theme", dark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle colour theme"
      title="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-control
                 border border-subtle bg-surface text-muted
                 transition-colors duration-150 hover:bg-elevated hover:text-ink"
    >
      <Sun size={15} className="hidden dark:block" />
      <Moon size={15} className="block dark:hidden" />
    </button>
  );
}
