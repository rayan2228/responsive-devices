import { faqItems } from "@/data/faq";
import { faqSchema } from "@/lib/schema";

/**
 * Renders from `data/faq.ts` and emits FAQPage JSON-LD from the same array, so
 * the structured data can never describe questions the page doesn't show.
 */
export function Faq() {
  return (
    <section className="border-t border-subtle py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqItems)) }}
      />

      <h2 className="text-h2 text-ink">Questions</h2>

      <div className="mt-8 max-w-2xl divide-y divide-subtle border-y border-subtle">
        {faqItems.map((item) => (
          <details key={item.question} className="group">
            <summary
              className="flex cursor-pointer list-none items-center justify-between gap-4
                         py-4 text-[14px] font-medium text-ink marker:content-none"
            >
              {item.question}
              <span
                aria-hidden
                className="shrink-0 text-faint transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="pb-4 text-[13px] leading-relaxed text-muted text-pretty">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
