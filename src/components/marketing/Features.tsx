import {
  Columns2,
  Command,
  Gauge,
  Link2,
  Ruler,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Columns2,
    title: "Compare four at once",
    body: "Put a phone, a tablet and a desktop side by side against the same URL, and watch a breakpoint land across all of them at the same time.",
  },
  {
    icon: Ruler,
    title: "True viewport widths",
    body: "Each frame is a real iframe at exact device dimensions, so media queries and container queries respond to the actual width — not your window size.",
  },
  {
    icon: Command,
    title: "Built for the keyboard",
    body: "A command palette on ⌘K, plus single keys for rotate, zoom and grid. Reach for the mouse only when you want to.",
  },
  {
    icon: Link2,
    title: "Shareable setups",
    body: "One link carries the URL, every selected device, orientation and zoom — so a teammate opens exactly what you were looking at.",
  },
  {
    icon: ShieldCheck,
    title: "Nothing leaves the browser",
    body: "There is no backend. The page you are testing loads directly in your own browser and is never proxied, logged or stored.",
  },
  {
    icon: Gauge,
    title: "Any size you need",
    body: "Twenty-one presets from iPhone SE to 4K, plus custom viewports between 100 and 5000 pixels, saved for next time.",
  },
];

export function Features() {
  return (
    <section className="border-t border-subtle py-16 sm:py-20">
      <h2 className="text-h2 text-ink">Everything the job actually needs</h2>
      <p className="mt-2 max-w-xl text-[15px] text-muted text-pretty">
        No account, no trial, no upsell. Just the parts of a device lab that get
        used daily.
      </p>

      <div className="mt-10 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, body }) => (
          <div key={title}>
            <Icon size={17} strokeWidth={1.75} className="text-accent" />
            <h3 className="mt-3 text-[14px] font-semibold text-ink">{title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted text-pretty">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
