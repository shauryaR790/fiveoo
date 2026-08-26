import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import NeonFog from "@/components/NeonFog";

/** Partners logos + testimonials heading share one fog field — no hard section chop. */
export default function PartnersTestimonialsBand() {
  return (
    <div className="relative overflow-x-clip bg-[var(--color-bg)] text-[var(--color-fg)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-[34%] z-0 h-[min(640px,58vh)] md:top-[36%] md:h-[min(720px,62vh)]"
        aria-hidden
      >
        <NeonFog variant="partners" />
      </div>

      <div className="relative z-[1]">
        <Partners />
        <Testimonials />
      </div>
    </div>
  );
}
