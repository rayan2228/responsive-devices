"use client";

import { CornerDownLeft, RotateCw, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { usePreview } from "@/state/preview-context";

export function UrlField() {
  const { state, dispatch } = usePreview();
  const inputRef = useRef<HTMLInputElement>(null);

  // `/` focuses the field from anywhere — see useKeyboardShortcuts.
  useEffect(() => {
    const onFocusRequest = () => {
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    document.addEventListener("rd:focus-url", onFocusRequest);
    return () => document.removeEventListener("rd:focus-url", onFocusRequest);
  }, []);

  return (
    <div className="flex-1">
      <div
        className={cn(
          "flex h-10 items-center gap-2 rounded-control border bg-surface pl-3 pr-1.5",
          "transition-colors focus-within:border-accent",
          state.urlError ? "border-danger/50" : "border-subtle",
        )}
      >
        <span className="shrink-0 font-mono text-[13px] text-faint">https://</span>

        <input
          ref={inputRef}
          type="text"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          value={state.urlInput.replace(/^https?:\/\//i, "")}
          onChange={(e) => dispatch({ t: "url/input", value: e.target.value })}
          onBlur={() => dispatch({ t: "url/commit" })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              dispatch({ t: "url/commit" });
              inputRef.current?.blur();
            }
            if (e.key === "Escape") inputRef.current?.blur();
          }}
          placeholder="example.com"
          aria-label="URL to preview"
          aria-invalid={Boolean(state.urlError)}
          className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-ink
                     outline-none placeholder:text-faint"
        />

        {state.urlInput && (
          <button
            onClick={() => dispatch({ t: "url/clear" })}
            aria-label="Clear URL"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] text-faint
                       transition-colors hover:bg-elevated hover:text-ink"
          >
            <X size={13} />
          </button>
        )}

        {state.committedUrl ? (
          <button
            onClick={() => dispatch({ t: "url/reload" })}
            aria-label="Reload preview"
            title="Reload"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] text-faint
                       transition-colors hover:bg-elevated hover:text-ink"
          >
            <RotateCw size={13} />
          </button>
        ) : (
          <span className="hidden shrink-0 items-center gap-1 pr-1.5 text-faint sm:flex">
            <CornerDownLeft size={12} />
          </span>
        )}
      </div>

      {state.urlError && (
        <p role="alert" className="mt-1.5 text-xs text-danger">
          {state.urlError}
        </p>
      )}
    </div>
  );
}
