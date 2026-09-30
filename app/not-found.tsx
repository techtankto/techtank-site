import FishCanvas from "@/components/ui/fish-canvas";
import PreviousButton from "@/components/ui/previous-button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// Unmatched URLs render here, outside the `(site)` group, so this adds the
// site chrome itself; otherwise a broken link would leave no way back in.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative min-h-dvh flex-1 overflow-x-hidden">
        {/* Canvas */}
        <FishCanvas />

        {/* UI overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
          <h1 className="text-[8rem] leading-[0.85] tracking-[-0.04em] sm:text-[12rem] md:text-[16rem]">404</h1>
          <p className="mt-6 font-mono text-[0.7rem] tracking-[0.22em] uppercase">Page not found</p>
          <p className="mt-3 animate-pulse text-[0.6rem] tracking-[0.18em] uppercase">move cursor or touch to reveal</p>
          <PreviousButton />
        </div>
      </main>
      <Footer />
    </div>
  );
}
