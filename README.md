# Responsive Devices

**Preview any site on every device.** Paste a URL and see it render across phones, tablets and desktops — side by side, at true viewport widths, entirely in the browser.

🔗 **[responsivedevices.com](https://responsivedevices.com)**

---

## What it does

A responsive design tester with no backend, no account and no install. Each preview is a real `<iframe>` sized to exact device dimensions, so the page under test resolves its own media and container queries against the real width — not a resized browser window.

- **Grid view** — compare up to four viewports against one URL simultaneously
- **21 device presets** plus custom viewports from 100 to 5000 px
- **Realistic device chrome** — dynamic island, notch, punch-hole, tablet bezel, or desktop browser chrome, per device
- **Zoom** at Fit / 50 / 75 / 100 %, where 100 % is genuinely 1:1
- **Command palette** (⌘K) and single-key shortcuts for rotate, zoom, grid and theme
- **Shareable links** encoding the URL, devices, orientation and zoom
- **Light and dark**, with no flash of the wrong theme on load

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4

Runtime dependencies: `next`, `react`, `react-dom`, `lucide-react`, `@next/third-parties`, `@vercel/speed-insights`. The command palette, the fuzzy matcher, the theme system and every dialog are built in-house — no UI library, no `cmdk`, no `next-themes`.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Architecture notes

A few decisions worth explaining, since they're the interesting parts.

### Frames render at 1:1 and scale once

A device frame is built at true device pixels and scaled by a single CSS `transform` on the wrapper, with the outer box reserving the scaled footprint in the layout:

```tsx
<div style={{ width: w * scale, height: h * scale }}>
  <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "top left" }}>
```

Multiplying each dimension by the scale individually — bezel, notch, radius, screen — is how frame geometry drifts out of proportion. It also matters for correctness: a CSS transform doesn't affect the layout viewport, so the framed page still reports its true CSS-pixel width to media queries. That property is the whole premise of the tool.

### Design tokens, two layers deep

Semantic values live on `:root` / `.dark` as plain custom properties. `@theme inline` maps them into Tailwind's colour namespace:

```css
@custom-variant dark (&:where(.dark, .dark *));
:root      { --surface: #fafafb; }
.dark      { --surface: #0d0e10; }
@theme inline { --color-surface: var(--surface); }
```

`inline` is load-bearing. Without it Tailwind compiles `bg-surface` to `var(--color-surface)`, which resolves against `:root` and ignores nested `.dark` scopes. With it, the utility compiles straight to `var(--surface)` and resolves per element at any depth.

The upshot is that most components carry no `dark:` variant at all — `bg-surface border-subtle` is correct in both themes.

### The theme toggle has no state

Both icons render, identically on server and client, and CSS picks one:

```tsx
<Sun className="hidden dark:block" />
<Moon className="block dark:hidden" />
```

An inline blocking script in `<head>` sets the class before first paint. No `useState`, no `mounted` flag, no hydration mismatch, no flash.

### URL commits are debounced

Input state and the value passed to `<iframe src>` are separate. Typing updates `urlInput`; only `committedUrl` reaches the iframe, on a 600 ms debounce or on Enter/blur. Feeding the raw input straight through fires one navigation per keystroke.

### Share links stay backward-compatible

The current format is `?u=<url>&d=iphone-15-pro,ipad-air:l,1440x900&z=fit`. `parseShareParams` also reads the previous `?url=&device=&orientation=&width=&height=` format and maps the old positional device ids (`"1"`–`"14"`) through `LEGACY_DEVICE_IDS`, so links shared before the rename still resolve.

### Embed blocking is honest about its limits

A site sending `X-Frame-Options: DENY` either fires no event at all or — as Chrome does — fires `load` against an error document, which is indistinguishable from success because reading into a cross-origin frame throws by design. A timeout catches the silent case; every pane carries a permanent "open in new tab" control for the case that doesn't. Guessing harder would mean false positives on slow sites.

## Project layout

```
src/
  app/          routes, metadata, generated robots/sitemap/OG image
  components/
    brand/      logo and wordmark
    layout/     header, footer, theme toggle
    preview/    the workbench — toolbar, picker, stage, frames, chrome
    command/    command palette and shortcut sheet
    marketing/  hero, features, how-it-works, FAQ  (all RSC)
    ui/         button, segmented control, keycap
  state/        reducer, context, keyboard shortcuts
  lib/          devices, storage, validation, share, scale, fuzzy, schema
  data/         device presets, frame presets, FAQ content
  config/       site.ts — the single source of brand truth
```

## Licence

MIT

---

Built by [Rayan Hossain](https://www.linkedin.com/in/rayan2228/).
