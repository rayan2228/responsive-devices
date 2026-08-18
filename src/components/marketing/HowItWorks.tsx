const steps = [
  {
    title: "Paste a URL",
    body: "Any public address. The scheme is optional — example.com works.",
  },
  {
    title: "Pick your devices",
    body: "Choose a preset, or switch to grid and line up several widths against each other.",
  },
  {
    title: "Rotate, zoom, share",
    body: "Check landscape, drop to 50% to see the whole page, then copy a link to the exact setup.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-subtle py-16 sm:py-20">
      <h2 className="text-h2 text-ink">How it works</h2>

      <ol className="mt-10 grid gap-8 sm:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title}>
            <span
              className="inline-grid h-7 w-7 place-items-center rounded-full border
                         border-subtle font-mono text-[12px] text-muted"
            >
              {i + 1}
            </span>
            <h3 className="mt-3 text-[14px] font-semibold text-ink">{step.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted text-pretty">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
