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
  return (
    <article
      data-work-card
      data-work-size={work.size}
      className={`group shrink-0 ${
        work.size === "lg"
          ? "w-[clamp(220px,28vw,420px)]"
          : "w-[clamp(150px,18vw,280px)]"
      }`}
    >
      <div
        data-work-meta
        className="mb-[18px] flex items-baseline justify-between gap-4 text-[13px] leading-none will-change-transform"
      >
        <span className="truncate">{work.client}</span>
        <span className="shrink-0">{work.year}</span>
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
          sizes={
            work.size === "lg"
              ? "(max-width: 768px) 70vw, 420px"
              : "(max-width: 768px) 45vw, 280px"
          }
        />
        <div
          data-work-overlay
          className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
        <p className="pointer-events-none absolute inset-x-0 bottom-0 p-4 font-display text-lg uppercase leading-tight text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:p-5 md:text-xl">
          {work.title}
        </p>
      </div>
    </article>
  );
}

export default function Works() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!root || !stage || !track) return;

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

      const getScrollDistance = () =>
        Math.max(0, track.scrollWidth - stage.clientWidth);

      gsap.set(title, { transformOrigin: "top center" });

      const introScale = 2.2;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 1.2, getScrollDistance() * 0.85)}`,
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
        { scale: 1, y: 0, ease: "power1.inOut", duration: 0.42 },
        0,
      )
        .fromTo(
          risers,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 0.28,
            stagger: 0.04,
          },
          0.24,
        )
        .fromTo(
          track,
          { x: 0 },
          {
            x: () => -getScrollDistance(),
            ease: "none",
            duration: 0.58,
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
      <div className="relative flex min-h-[100svh] flex-col px-5 pb-16 md:px-10 md:pb-24 lg:px-12">
        <h2
          data-works-title
          className="font-display shrink-0 pt-[calc(var(--nav-height)+1.25rem)] text-center text-[clamp(2rem,6.2vw,5.25rem)] uppercase leading-[0.88] text-[var(--color-fg)] will-change-transform"
        >
          Selected
          <br />
          Works
          <br />
          (2023–2026)
        </h2>

        <div
          ref={stageRef}
          data-works-gallery
          className="mt-12 flex flex-1 items-start overflow-hidden md:mt-16"
        >
          <div
            ref={trackRef}
            data-works-track
            className="flex w-max items-start gap-2.5 will-change-transform md:gap-3"
          >
            {WORKS.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
