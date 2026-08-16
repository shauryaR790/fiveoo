"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fadeUp } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessReel() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      fadeUp(root.querySelectorAll("[data-reel-reveal]"), {
        trigger: root,
        stagger: 0.1,
        y: 32,
      });
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
          data-reel-reveal
          className="relative overflow-hidden bg-black"
        >
          <div className="relative aspect-video w-full">
            <video
              ref={videoRef}
              src="/videos/process-reel.mp4"
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              className="absolute inset-0 h-full w-full object-contain"
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
