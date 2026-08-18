export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Rendered by `components/marketing/Faq.tsx` and fed to `faqSchema()` in
 * `lib/schema.ts`. One array, two consumers — so the visible FAQ and the
 * structured data can never disagree.
 */
export const faqItems: readonly FaqItem[] = [
  {
    question: "Is Responsive Devices free?",
    answer:
      "Yes, completely. There is no account, no trial and no paid tier. Everything runs in your browser.",
  },
  {
    question: "Does my site get sent to a server?",
    answer:
      "No. The preview loads the URL directly in your own browser inside an iframe. There is no backend, and the page you are testing is never proxied or stored.",
  },
  {
    question: "Why does some site refuse to load in the preview?",
    answer:
      "Sites can forbid being embedded using the X-Frame-Options or Content-Security-Policy frame-ancestors headers. Google, X and most banks do this. It is a restriction set by that site, not something a preview tool can work around — use the Open in new tab fallback instead.",
  },
  {
    question: "Is this the same as resizing my browser window?",
    answer:
      "It is more precise. Each frame is a real iframe at exact device dimensions, so your CSS media queries and container queries respond to the true viewport width rather than whatever your window happens to be. You can also see several widths at once.",
  },
  {
    question: "Are the previews pixel-accurate to a real phone?",
    answer:
      "The viewport dimensions are accurate, and that is what your layout responds to. Rendering still uses your desktop browser engine, so device-specific font rendering, scrollbar behaviour and mobile browser chrome will differ slightly from real hardware. Test on a real device before shipping anything critical.",
  },
  {
    question: "Can I add a device that is not in the list?",
    answer:
      "Yes. Add Custom Device takes any width and height between 100 and 5000 pixels, and it is saved in your browser for next time.",
  },
  {
    question: "Do my custom devices sync between browsers?",
    answer:
      "No. They are stored in your browser's local storage, so they stay on that one device and browser. Clearing site data removes them.",
  },
  {
    question: "Can I share a preview with someone?",
    answer:
      "Yes. The Share button copies a link that encodes the URL, the selected devices, the orientation and the zoom level, so whoever opens it sees exactly the same setup.",
  },
];
