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
  refreshScrollTrigger,
  setNavInvert,
  setNavPinDrive,
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

      const measureHeadingY = () => {
        const headingEl = heading as HTMLElement | null;
        if (!headingEl) return 0;
        const top = headingEl.offsetTop;
        const h = headingEl.offsetHeight;
        return window.innerHeight / 2 - top - h / 2;
      };

      const buildTimeline = () => {
        const headingCenterY = measureHeadingY();

        gsap.set(card, { clipPath: "inset(21% 20% 21% 20%)" });
        gsap.set(heading, { transformOrigin: "center center", scale: 0.82, y: headingCenterY });
        gsap.set(chip, { width: 0 });
        gsap.set(items, { opacity: 0, y: 48 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=260%",
            pin: true,
            scrub: 0.65,
            invalidateOnRefresh: true,
            refreshPriority: 1,
            onEnter: () => setNavPinDrive(true),
            onEnterBack: () => setNavPinDrive(true),
            onUpdate: (self) => setNavInvert(self.progress >= 0.55),
            onLeave: () => {
              setNavPinDrive(false);
              setNavInvert(false);
              requestAnimationFrame(() => refreshScrollTrigger());
            },
            onLeaveBack: () => {
              setNavPinDrive(false);
              setNavInvert(false);
              requestAnimationFrame(() => refreshScrollTrigger());
            },
          },
        });

        tl.fromTo(
          card,
          { clipPath: "inset(21% 20% 21% 20%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "power2.inOut",
            duration: 0.38,
          },
          0,
        )
          .to(
            heading,
            { scale: 1, y: headingCenterY, ease: "power1.inOut", duration: 0.4 },
            0,
          )
          .to(chip, { width: "1.6em", ease: "power2.out", duration: 0.28 }, 0.1)
          .to(heading, { y: 0, ease: "power2.inOut", duration: 0.22 }, 0.44);

        items.forEach((item, index) => {
          tl.fromTo(
            item,
            { opacity: 0, y: 48 },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              duration: 0.1,
            },
            0.5 + index * 0.07,
          );
        });

        tl.to({}, { duration: 0.12 }, 0.88);

        return tl;
      };

      buildTimeline();
    }, root);

    requestAnimationFrame(() => refreshScrollTrigger());

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="careers"
      ref={rootRef}
      data-nav-theme="dark"
      className="relative bg-[var(--color-bg)]"
      aria-label="Branding statement"
    >
      <div
        ref={stageRef}
        className="relative h-[100svh] overflow-hidden bg-[var(--color-bg)]"
      >
        <div
          data-branding-card
          className="absolute inset-0 bg-white text-black [clip-path:inset(21%_20%_21%_20%)]"
        >
          <div className="flex h-full flex-col px-6 pb-16 pt-[calc(var(--nav-height)+1.5rem)] md:px-14 md:pb-0 lg:px-20 xl:px-24">
            <h2
              data-branding-heading
              className="font-display shrink-0 text-center text-[clamp(2rem,5.8vw,4.75rem)] uppercase leading-[0.9] will-change-transform lg:text-[clamp(2.25rem,6.5vw,5.75rem)] xl:text-[clamp(2rem,7.8vw,7rem)] xl:leading-[0.86]"
            >
              We build
              <br />
              branding{" "}
              <span
                data-branding-chip
                className="relative inline-block h-[0.62em] w-0 -translate-y-[0.09em] overflow-hidden align-middle"
                aria-hidden
              >
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

            <div className="mt-auto grid grid-cols-1 gap-x-14 gap-y-10 pb-8 md:grid-cols-2 md:gap-x-20 md:gap-y-12 lg:gap-x-32 lg:gap-y-14 md:pb-14">
              {BRANDING_FEATURES.map((feature) => (
                <div
                  key={feature.id}
                  data-branding-item
                  className="border-b border-black/12 pb-7 will-change-transform md:pb-9"
                >
                  <div className="mb-5 grid grid-cols-[3.5rem_1fr] gap-x-6 md:mb-6 md:grid-cols-[4.25rem_1fr] md:gap-x-10 lg:grid-cols-[5.5rem_1fr] lg:gap-x-12">
                    <span className="step-index text-[17px] md:text-[19px]">
                      ({feature.id})
                    </span>
                    <h3 className="text-[17px] font-bold uppercase leading-[1.3] tracking-[0.01em] md:text-[20px]">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="w-full text-[17px] leading-[1.55] text-black/55 md:text-[19px]">
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
