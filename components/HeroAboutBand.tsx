import Hero from "@/components/Hero";
import About from "@/components/About";
import NeonFog from "@/components/NeonFog";

/** Hero + About share one fog field so the hue flows naturally page to page. */
export default function HeroAboutBand() {
  return (
    <div className="relative bg-[var(--color-bg)]">
      <NeonFog variant="continuous" />
      <Hero />
      <About />
    </div>
  );
}
