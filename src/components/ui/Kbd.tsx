import { cn } from "@/lib/cn";

const base =
  "inline-flex h-5 min-w-[20px] items-center justify-center rounded-[5px] " +
  "border border-subtle bg-elevated px-1.5 " +
  "font-mono text-[11px] leading-none text-muted";

/**
 * Renders a keycap. The token "mod" resolves to ⌘ on Apple platforms and Ctrl
 * elsewhere. Both are rendered and CSS picks one via the `is-apple` class set
 * on <html> before paint — deciding in JS at render time would mismatch during
 * hydration.
 */
export function Kbd({ children, className }: { children: string; className?: string }) {
  if (children === "mod") {
    return (
      <>
        <kbd className={cn(base, "kbd-mod-apple", className)}>⌘</kbd>
        <kbd className={cn(base, "kbd-mod-other", className)}>Ctrl</kbd>
      </>
    );
  }

  return <kbd className={cn(base, className)}>{children}</kbd>;
}

export function KbdGroup({ keys }: { keys: readonly string[] }) {
  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((k, i) => (
        <Kbd key={i}>{k}</Kbd>
      ))}
    </span>
  );
}
