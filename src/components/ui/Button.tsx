import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
}

/**
 * The primary variant is a solid near-white fill on near-black — not an accent
 * gradient. Restraint is the point: accent is reserved for selection and focus.
 */
const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-canvas hover:opacity-90 border border-transparent font-medium",
  secondary:
    "bg-surface text-ink border border-subtle hover:bg-elevated hover:border-strong",
  ghost:
    "bg-transparent text-muted border border-transparent hover:bg-elevated hover:text-ink",
  danger:
    "bg-transparent text-muted border border-transparent hover:bg-danger/10 hover:text-danger",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-[8px]",
  md: "h-10 px-4 text-sm gap-2 rounded-control",
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap",
        "transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
