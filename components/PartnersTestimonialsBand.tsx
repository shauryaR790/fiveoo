import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import NeonFog from "@/components/NeonFog";

/** Partners logos + testimonials heading share one fog field — no hard section chop. */
export default function PartnersTestimonialsBand() {
  return (
    <div className="relative overflow-x-clip bg-[var(--color-bg)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[clamp(820px,88vw,1120px)]"
        aria-hidden
      >
        <NeonFog variant="hero" className="!h-full" />
        <div className="absolute inset-x-0 bottom-0 h-[24%] bg-gradient-to-b from-transparent to-[var(--color-bg)]" />
      </div>

      <div className="relative z-[1]">
        <Partners />
        <Testimonials />
      </div>
    </div>
  );
}
