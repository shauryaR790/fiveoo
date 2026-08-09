"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion, bindCursorSlideTrack } from "@/lib/animations";
import { scrollToTarget } from "@/lib/lenis";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLSpanElement[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(linesRef.current, { yPercent: 0, opacity: 1 });
        gsap.set(mediaRef.current, { opacity: 1, scale: 1 });
        return;
      }

      gsap.from(mediaRef.current, {
        opacity: 0,
        scale: 1.04,
        duration: 1.3,
        ease: "power3.out",
      });

      gsap.from(linesRef.current, {
        yPercent: 110,
        duration: 1.15,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
      });

      gsap.from("[data-hero-sub]", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.12,
        delay: 0.55,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  /** Showreel drifts horizontally with the cursor, only when near it. */
  useLayoutEffect(() => {
    const track = trackRef.current;
    const slide = slideRef.current;
    if (!track || !slide) return;

    return bindCursorSlideTrack(track, slide);
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col overflow-x-hidden bg-transparent px-6 pb-10 pt-[calc(var(--nav-height)+1.5rem)] text-[var(--color-fg)] md:px-10 lg:px-12"
      data-nav-theme="dark"
    >
      <div className="relative z-[1] flex flex-1 flex-col gap-12 lg:flex-row lg:gap-0">
        {/* Showreel track — the bounded area the box slides within */}
        <div ref={trackRef} className="relative lg:w-[40%] lg:pt-2">
          <div
            ref={slideRef}
            data-cursor-grow
            className="w-full max-w-[420px] will-change-transform lg:w-[420px] lg:max-w-none"
          >
            <div
              ref={mediaRef}
              className="relative aspect-video w-full overflow-hidden bg-[var(--color-surface-muted)] will-change-transform"
            >
              <video
                src="/videos/frontfiveo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            </div>
            <p data-hero-sub className="mt-3 text-[15px] text-[var(--color-fg)]">
              FIVEO Showreels
            </p>
          </div>
        </div>

        {/* Massive headline — left edge aligns with the first nav link */}
        <div className="lg:ml-auto lg:w-[41.5%]">
          <h1 className="font-display text-left text-[clamp(2.75rem,7.8vw,7.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.03em]">
            {["We build", "seamless", "identity"].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <span
                  ref={(el) => {
                    if (el) linesRef.current[i] = el;
                  }}
                  className="block whitespace-nowrap will-change-transform"
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>
        </div>
      </div>

      <div className="relative z-[1] mt-16 flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
        <p
          data-hero-sub
          className="max-w-[12.5em] font-[family-name:var(--font-card)] text-[clamp(2rem,4.1vw,3.75rem)] font-light leading-[1.15] tracking-[-0.03em] lg:w-[52%]"
        >
          Pick a plan, send in your request, and your design journey starts
          tomorrow.
        </p>

        <div
          data-hero-sub
          className="flex w-full items-end justify-between gap-8 lg:ml-auto lg:w-[41.5%]"
        >
          <button
            type="button"
            onClick={() => scrollToTarget("#about")}
            className="group inline-flex items-center gap-3 border-b border-[var(--color-fg)] pb-1.5 text-[clamp(1.35rem,2.4vw,2.15rem)] font-normal tracking-[-0.025em] transition-opacity hover:opacity-60"
          >
            About us
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </button>
          <button
            type="button"
            onClick={() => scrollToTarget("#pricing")}
            className="group inline-flex items-center gap-3 border-b border-[var(--color-fg)] pb-1.5 text-[clamp(1.35rem,2.4vw,2.15rem)] font-normal tracking-[-0.025em] transition-opacity hover:opacity-60"
          >
            Explore Plans
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
