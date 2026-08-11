"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { WORKS } from "@/lib/constants";
import {
  prefersReducedMotion,
  isMobileViewport,
  setNavInvert,
} from "@/lib/animations";
gsap.registerPlugin(ScrollTrigger);

export default function Works() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const title = root.querySelector<HTMLElement>("[data-works-title]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-work-card]", root);
      const risers = cards.flatMap((card) => [
        card.querySelector("[data-work-meta]"),
        card.querySelector("[data-work-frame]"),
      ]);

      if (prefersReducedMotion() || !title) {
        gsap.set(title, { color: "#ffffff" });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
          onEnter: () => setNavInvert(false),
          onEnterBack: () => setNavInvert(false),
          onLeaveBack: () => setNavInvert(false),
        },
      });

      gsap.set(title, { transformOrigin: "top center" });

      const introScale = 2.2;
      tl.fromTo(
        title,
        {
          scale: introScale,
          y: () => {
            const layoutTop = title.offsetTop;
            const scaledH = title.offsetHeight * introScale;
            return window.innerHeight / 2 - layoutTop - scaledH / 2;
          },
        },
        { scale: 1, y: 0, ease: "power1.inOut", duration: 0.68 },
        0,
      ).fromTo(
        risers,
        { y: 120, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 0.45,
          stagger: 0.05,
        },
        0.42,
      );

      if (isMobileViewport()) return;

      /* ---- Layered movement: the frame and the image inside it travel at
         slightly different rates as each card crosses the viewport. ---- */
      cards.forEach((card) => {
        const frame = card.querySelector("[data-work-frame]");
        const media = card.querySelector("[data-work-media]");
        const meta = card.querySelector("[data-work-meta]");

        gsap.fromTo(
          media,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        /* Hover reads as a small pressure on the composition, not an effect. */
        const hover = gsap
          .timeline({
            paused: true,
            defaults: { duration: 0.4, ease: "power2.out" },
          })
          .to(media, { scale: 1.05 }, 0)
          .to(frame, { scale: 1.01 }, 0)
          .to(card.querySelector("[data-work-overlay]"), { opacity: 1 }, 0)
          .to(meta, { x: 8 }, 0);

        card.addEventListener("mouseenter", () => hover.play());
        card.addEventListener("mouseleave", () => hover.reverse());
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="works"
      ref={rootRef}
      className="relative theme-surface overflow-hidden"
      data-nav-theme="dark"
    >
      <div className="relative px-5 pb-16 md:px-10 md:pb-24 lg:px-12">
        <h2
          data-works-title
              className="font-display pt-[calc(var(--nav-height)+1.25rem)] text-center text-[clamp(2rem,6.2vw,5.25rem)] uppercase leading-[0.88] text-[var(--color-fg)] will-change-transform"
        >
          Selected
          <br />
          Works
          <br />
          (2023–2026)
        </h2>

        <div className="grid grid-cols-1 items-start gap-x-2.5 gap-y-14 pt-16 md:grid-cols-12 md:gap-y-24 md:pt-24">
          {WORKS.map((work) => (
            <article
              key={work.id}
              data-work-card
              className={`group ${
                work.span === "lg" ? "md:col-span-6" : "md:col-span-3"
              }`}
            >
              <div
                data-work-meta
                className="mb-[18px] flex items-baseline justify-between text-[13px] leading-none will-change-transform"
              >
                <span>{work.client}</span>
                <span>{work.year}</span>
              </div>

              {/* Square frames: a half-width project simply reads twice as tall */}
              <div
                data-work-frame
                className="relative aspect-square overflow-hidden will-change-transform"
              >
                <div
                  data-work-media
                  className="absolute inset-[-8%] will-change-transform"
                >
                  <Image
                    src={work.src}
                    alt={work.title}
                    fill
                    sizes={
                      work.span === "lg"
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 100vw, 25vw"
                    }
                    className="object-cover"
                  />
                </div>
                <div
                  data-work-overlay
                  className="absolute inset-0 bg-black/40 opacity-0"
                  aria-hidden
                />
                <p className="absolute inset-x-0 bottom-0 p-5 font-display text-xl uppercase leading-tight text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:text-2xl">
                  {work.title}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
