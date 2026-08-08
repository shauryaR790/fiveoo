"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/animations";
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

    const canFollow = () =>
      !prefersReducedMotion() &&
      window.matchMedia("(pointer: fine)").matches &&
      window.matchMedia("(min-width: 1024px)").matches;

    const PROXIMITY = 90;
    let maxOffset = 0;
    let restX = 0;

    const measure = () => {
      maxOffset = Math.max(0, track.clientWidth - slide.offsetWidth);
      restX = maxOffset * 0.4;
    };

    const xTo = gsap.quickTo(slide, "x", { duration: 2.2, ease: "power1.out" });

    measure();
    if (canFollow()) gsap.set(slide, { x: restX });

    const onMove = (e: PointerEvent) => {
      if (!canFollow()) return;

      const box = slide.getBoundingClientRect();
      const isNear =
        e.clientX >= box.left - PROXIMITY &&
        e.clientX <= box.right + PROXIMITY &&
        e.clientY >= box.top - PROXIMITY &&
        e.clientY <= box.bottom + PROXIMITY;

      if (!isNear) return;

      const rect = track.getBoundingClientRect();
      const target = e.clientX - rect.left - slide.offsetWidth / 2;
      xTo(gsap.utils.clamp(0, maxOffset, target));
    };

    const onResize = () => {
      const previous = (gsap.getProperty(slide, "x") as number) || 0;
      measure();
      gsap.set(slide, {
        x: canFollow() ? gsap.utils.clamp(0, maxOffset, previous) : 0,
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf(slide);
      gsap.set(slide, { x: 0 });
    };
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col bg-[var(--color-bg)] px-6 pb-10 pt-[calc(var(--nav-height)+1.5rem)] md:px-10 lg:px-12"
      data-nav-theme="light"
    >
      <div className="flex flex-1 flex-col gap-12 lg:flex-row lg:gap-0">
        {/* Showreel track — the bounded area the box slides within */}
        <div ref={trackRef} className="relative lg:w-[40%] lg:pt-2">
          <div
            ref={slideRef}
            data-cursor-grow
            className="w-full max-w-[420px] will-change-transform lg:w-[420px] lg:max-w-none"
          >
            <div
              ref={mediaRef}
              className="relative aspect-video w-full overflow-hidden bg-[var(--color-bg-inverse)] will-change-transform"
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

      {/* Bottom row: big paragraph left, arrow links right */}
      <div className="mt-16 flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:gap-0">
        <p
          data-hero-sub
          className="max-w-[12.5em] text-[clamp(2rem,4.1vw,3.75rem)] font-normal leading-[1.16] tracking-[-0.02em] lg:w-[58.5%]"
        >
          Pick a plan, send in your request, and your design journey starts
          tomorrow.
        </p>

        <div
          data-hero-sub
          className="flex w-full items-center gap-10 lg:w-[41.5%] lg:justify-between"
        >
          <button
            type="button"
            onClick={() => scrollToTarget("#about")}
            className="group inline-flex items-center gap-2 border-b border-[var(--color-fg)] pb-1 text-[17px] font-semibold tracking-[-0.01em] transition-opacity hover:opacity-60"
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
            className="group inline-flex items-center gap-2 border-b border-[var(--color-fg)] pb-1 text-[17px] font-semibold tracking-[-0.01em] transition-opacity hover:opacity-60"
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
