"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { WORKS, type WorkItem } from "@/lib/constants";
import {
  prefersReducedMotion,
  isMobileViewport,
  setNavInvert,
} from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

function WorkCard({ work }: { work: WorkItem }) {
  const isBrandWork = Number(work.id.slice(1)) <= 6;

  return (
    <article data-work-card className="group col-span-1 md:col-span-4">
      <div
        data-work-meta
        className="mb-3 flex items-baseline justify-between gap-3 text-[12px] leading-none will-change-transform md:mb-[18px] md:text-[13px]"
      >
        <span className="truncate">{work.client}</span>
        <span className="shrink-0">{work.year}</span>
      </div>

      <div
        data-work-frame
        className={`theme-card relative overflow-hidden will-change-transform ${
          isBrandWork
            ? "bg-transparent"
            : "aspect-[3/4] bg-[var(--color-surface-muted)]"
        }`}
      >
        {isBrandWork ? (
          <Image
            src={work.src}
            alt={work.title}
            width={1600}
            height={2000}
            unoptimized
            className="block h-auto w-full max-w-none"
            sizes="(max-width: 768px) 33vw, 33vw"
          />
        ) : (
          <Image
            src={work.src}
            alt={work.title}
            fill
            unoptimized
            className="object-contain"
            sizes="(max-width: 768px) 33vw, 33vw"
          />
        )}
        <div
          data-work-overlay
          className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
        <p className="pointer-events-none absolute inset-x-0 bottom-0 p-3 font-display text-base uppercase leading-tight text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:p-5 md:text-xl">
          {work.title}
        </p>
      </div>
    </article>
  );
}

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
        gsap.set(title, {
          color:
            getComputedStyle(document.documentElement)
              .getPropertyValue("--color-fg")
              .trim() || "currentColor",
        });
        return;
      }

      const pinDistance = `${120 + Math.max(0, WORKS.length - 6) * 18}%`;

      gsap.set(title, { transformOrigin: "top center" });

      const introScale = 2.2;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: `+=${pinDistance}`,
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

      cards.forEach((card) => {
        const frame = card.querySelector("[data-work-frame]");
        const meta = card.querySelector("[data-work-meta]");

        const hover = gsap
          .timeline({
            paused: true,
            defaults: { duration: 0.4, ease: "power2.out" },
          })
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
      <div className="relative px-3 pb-16 md:px-10 md:pb-24 lg:px-12">
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

        <div className="grid grid-cols-3 items-start gap-1.5 pt-10 md:grid-cols-12 md:gap-2.5 md:pt-24 md:gap-y-8">
          {WORKS.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      </div>
    </section>
  );
}
