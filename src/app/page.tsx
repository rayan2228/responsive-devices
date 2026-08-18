import { Suspense } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Faq } from "@/components/marketing/Faq";
import { Features } from "@/components/marketing/Features";
import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { PreviewWorkbench } from "@/components/preview/PreviewWorkbench";
import { PreviewProvider } from "@/state/preview-context";
import Loading from "./loading";

export default function Home() {
  return (
    // The provider reads useSearchParams for share links, so it needs a
    // Suspense boundary. Removing it is a build-time prerender failure, not a
    // runtime one.
    <Suspense fallback={<Loading />}>
      <PreviewProvider>
        <SiteHeader />
        <main className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <Hero />
          <PreviewWorkbench />
          <Features />
          <HowItWorks />
          <Faq />
        </main>
        <SiteFooter />
      </PreviewProvider>
    </Suspense>
  );
}
