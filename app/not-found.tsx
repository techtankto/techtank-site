import { FishCanvas } from "@/components/ui/fish-canvas";
import { PreviousButton } from "@/components/ui/previous-button";

export default function NotFound() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      {/* Canvas */}
      <FishCanvas />

      {/* UI overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
        <h1 className="text-[8rem] leading-[0.85] tracking-[-0.04em] sm:text-[12rem] md:text-[16rem]">404</h1>
        <p className="mt-6 font-mono text-[0.7rem] tracking-[0.22em] uppercase">Page not found</p>
        <p className="mt-3 animate-pulse text-[0.6rem] tracking-[0.18em] uppercase">move cursor or touch to reveal</p>
        <PreviousButton />
      </div>
    </div>
  );
}
