import Hero from "@/components/Hero";
import About from "@/components/About";
import NeonFog from "@/components/NeonFog";

/** Hero + About — fog stays in the hero viewport; About stays clean. */
export default function HeroAboutBand() {
  return (
    <div className="relative bg-[var(--color-bg)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100svh]"
        aria-hidden
      >
        <NeonFog variant="hero" className="!h-full" />
      </div>
      <Hero />
      <About />
    </div>
  );
}
