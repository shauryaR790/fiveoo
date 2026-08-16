"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fadeUp, prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessReel() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!root || !stage) return;

    const ctx = gsap.context(() => {
      fadeUp(root.querySelectorAll("[data-reel-reveal]"), {
        trigger: root,
        stagger: 0.1,
        y: 32,
      });

      if (prefersReducedMotion()) return;

      gsap.fromTo(
        stage,
        { scale: 0.94, y: 48 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top 88%",
            end: "top 42%",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        stage.querySelector("[data-reel-video]"),
        { scale: 1.08 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="reel"
      ref={rootRef}
      className="theme-surface relative overflow-hidden px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28"
      data-nav-theme="dark"
      aria-label="Process showreel"
    >
      <div className="mx-auto max-w-[1600px]">
        <div
          data-reel-reveal
          className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.18em] text-[var(--color-fg)]/45">
              Showreel
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em] text-[var(--color-fg)]">
              Craft in motion
            </h2>
          </div>
          <p className="max-w-[18rem] text-[15px] leading-[1.6] text-[var(--color-fg)]/55 md:text-right md:text-[16px]">
            A glimpse of the polish, pace, and precision behind every FIVEO
            delivery.
          </p>
        </div>

        <div
          ref={stageRef}
          className="relative overflow-hidden will-change-transform"
        >
          <div
            data-reel-video
            className="relative aspect-[16/9] w-full overflow-hidden bg-black will-change-transform md:aspect-[21/9]"
          >
            <video
              ref={videoRef}
              src="/videos/process-reel.mp4"
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover [image-rendering:auto]"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,transparent_22%,transparent_78%,rgba(0,0,0,0.28)_100%)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay [background-image:radial-gradient(circle_at_20%_20%,var(--color-neon-purple)_0%,transparent_42%),radial-gradient(circle_at_80%_80%,var(--color-neon-orange)_0%,transparent_40%)]"
              aria-hidden
            />
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--color-fg)]/12"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[var(--color-fg)]/12"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
