"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { BRANDING_FEATURES } from "@/lib/constants";
import {
  fadeUp,
  isMobileViewport,
  prefersReducedMotion,
  setNavInvert,
} from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

export default function Branding() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const ctx = gsap.context(() => {
      const card = stage.querySelector("[data-branding-card]");
      const heading = stage.querySelector("[data-branding-heading]");
      const chip = stage.querySelector("[data-branding-chip]");
      const items = gsap.utils.toArray<HTMLElement>(
        "[data-branding-item]",
        stage,
      );

      if (prefersReducedMotion() || isMobileViewport()) {
        gsap.set(card, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(chip, { width: "1.6em" });
        fadeUp(items, { trigger: stage, stagger: 0.12, y: 30 });
        return;
      }

      /* ---- The white panel arrives as a small box on the dark canvas and
         opens out to full bleed as you scroll, the statement growing with it.
         Only once it owns the screen do the four notes arrive, one by one, and
         everything holds while the pin runs out. ---- */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // White while the black canvas shows; black once the light panel owns the screen.
          onUpdate: (self) => setNavInvert(self.progress < 0.55),
          onLeave: () => setNavInvert(false),
          onLeaveBack: () => setNavInvert(true),
        },
      });

      // Four explicit sides on both ends: mismatched value counts cannot be
      // interpolated, which is what made the panel snap between sizes.
      tl.fromTo(
        card,
        { clipPath: "inset(21% 20% 21% 20%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "power2.inOut",
          duration: 0.44,
        },
        0,
      )
        .fromTo(
          heading,
          { scale: 0.82 },
          { scale: 1, ease: "power1.inOut", duration: 0.45 },
          0,
        )
        // Width rather than scale: the words either side have to be pushed
        // apart to make room, so this has to affect layout.
        .fromTo(
          chip,
          { width: 0 },
          { width: "1.6em", ease: "power2.out", duration: 0.32 },
          0.12,
        )
        // Centred while it is the only thing on screen, then it makes room.
        .fromTo(
          heading,
          { y: () => window.innerHeight * 0.2 },
          { y: 0, ease: "power2.inOut", duration: 0.2 },
          0.48,
        )
        .fromTo(
          items,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.12,
            stagger: 0.08,
          },
          0.56,
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="careers"
      ref={rootRef}
      data-nav-theme="dark"
      className="relative -mt-px bg-[var(--color-bg-inverse)]"
      aria-label="Branding statement"
    >
      <div
        ref={stageRef}
        className="relative md:h-[100svh] md:overflow-hidden"
      >
        <div
          data-branding-card
          className="relative bg-[var(--color-bg)] text-[var(--color-fg)] md:absolute md:inset-0 md:[clip-path:inset(21%_20%_21%_20%)]"
        >
          <div className="flex min-h-[100svh] flex-col px-5 pb-16 pt-[calc(var(--nav-height)+1rem)] md:h-full md:min-h-0 md:px-10 md:pb-0 lg:px-12">
            {/* Fixed line breaks so the image always lands mid-statement */}
            <h2
              data-branding-heading
              className="font-display text-center text-[clamp(2rem,7.8vw,7rem)] uppercase leading-[0.86] will-change-transform"
            >
              We build
              <br />
              branding{" "}
              <span
                data-branding-chip
                className="relative inline-block h-[0.62em] w-0 -translate-y-[0.09em] overflow-hidden align-middle"
                aria-hidden
              >
                {/* Held at a fixed width and centred, so the frame opening
                    around it reads as a reveal rather than a squash. */}
                <span className="absolute left-1/2 top-0 block h-full w-[1.6em] -translate-x-1/2">
                  <Image
                    src="/images/krosan.jpg"
                    alt=""
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </span>
              </span>
              for
              <br />
              your MVP
            </h2>

            <div className="mt-auto grid grid-cols-1 gap-x-12 gap-y-8 pb-8 md:grid-cols-2 md:gap-x-16 md:gap-y-10 md:pb-12">
              {BRANDING_FEATURES.map((feature) => (
                <div
                  key={feature.id}
                  data-branding-item
                  className="border-b border-[var(--color-border)]/12 pb-6 will-change-transform"
                >
                  <div className="mb-4 grid grid-cols-[3rem_1fr] gap-x-4 md:grid-cols-[5rem_1fr]">
                    <span className="text-[15px] tabular-nums leading-[1.35] text-[var(--color-fg-muted)]">
                      ({feature.id})
                    </span>
                    <h3 className="text-[15px] font-bold uppercase leading-[1.35] tracking-[0.01em]">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-[15px] leading-[1.6] text-[var(--color-fg-muted)]">
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
