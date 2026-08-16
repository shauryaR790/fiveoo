"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { WORK_ROWS, WORKS, type WorkItem } from "@/lib/constants";
import {
  prefersReducedMotion,
  isMobileViewport,
  setNavInvert,
} from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

const WORK_BY_ID = Object.fromEntries(WORKS.map((work) => [work.id, work]));

function WorkCard({ work }: { work: WorkItem }) {
  return (
    <article data-work-card className="group">
      <div
        data-work-meta
        className="mb-[18px] flex items-baseline justify-between text-[13px] leading-none will-change-transform"
      >
        <span>{work.client}</span>
        <span>{work.year}</span>
      </div>

      <div
        data-work-frame
        className="theme-card relative overflow-hidden will-change-transform"
      >
        <Image
          src={work.src}
          alt={work.title}
          width={1600}
          height={2000}
          unoptimized
          className="block h-auto w-full max-w-none"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div
          data-work-overlay
          className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
        <p className="pointer-events-none absolute inset-x-0 bottom-0 p-5 font-display text-xl uppercase leading-tight text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:text-2xl">
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

        <div className="flex flex-col gap-14 pt-16 md:gap-24 md:pt-24">
          {WORK_ROWS.map((row, rowIndex) => (
            <div
              key={`works-row-${rowIndex}`}
              className="grid grid-cols-1 items-start gap-2.5 md:grid-cols-3"
            >
              {row.map((column, columnIndex) => {
                if (column.type === "stack") {
                  return (
                    <div
                      key={`stack-${rowIndex}-${columnIndex}`}
                      className="flex flex-col gap-2.5"
                    >
                      {column.ids.map((id) => (
                        <WorkCard key={id} work={WORK_BY_ID[id]} />
                      ))}
                    </div>
                  );
                }

                return (
                  <WorkCard
                    key={column.id}
                    work={WORK_BY_ID[column.id]}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
