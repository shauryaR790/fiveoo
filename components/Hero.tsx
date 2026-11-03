"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/constants";
import { prefersReducedMotion, bindCursorSlideTrack } from "@/lib/animations";
import { scrollToTarget } from "@/lib/lenis";
import NeonFog from "@/components/NeonFog";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLSpanElement[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
        y: 28,
        scale: 0.98,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.05,
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

  useLayoutEffect(() => {
    const track = trackRef.current;
    const slide = slideRef.current;
    if (!track || !slide) return;

    return bindCursorSlideTrack(track, slide, { restRatio: 1 });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion()) return;
    void video.play().catch(() => {});
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col overflow-x-hidden bg-black px-5 pb-12 pt-[calc(var(--nav-height)+0.75rem)] text-[var(--color-fg)] md:px-10 md:pb-10 md:pt-[calc(var(--nav-height)+1.5rem)] lg:px-12"
      data-nav-theme="dark"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <img
          src="/images/hero-deck.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-left-bottom"
        />
      </div>
      <NeonFog variant="hero" />

      <div className="relative z-[1] flex flex-1 flex-col gap-10 md:gap-12 lg:flex-row lg:items-center lg:gap-0">
        <div className="flex flex-1 flex-col justify-center">
          <h1 className="font-display max-w-[14ch] text-left text-[clamp(2.35rem,11.2vw,7.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em] md:text-[clamp(2.75rem,7.8vw,7.5rem)] md:leading-[0.88]">
            {["We build", "seamless", "identity"].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <span
                  ref={(el) => {
                    if (el) linesRef.current[i] = el;
                  }}
                  className="block will-change-transform md:whitespace-nowrap"
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>
        </div>

        {/* POS product — fills the right field over the glass panels */}
        <div
          ref={trackRef}
          className="relative order-first w-full lg:order-none lg:ml-auto lg:w-[42%] lg:max-w-[480px]"
        >
          <div
            ref={slideRef}
            data-cursor-grow
            className="ml-auto w-full max-w-[min(100%,420px)] will-change-transform lg:ml-auto lg:w-full lg:max-w-none"
          >
            <button
              type="button"
              onClick={() => scrollToTarget("#pos")}
              className="group block w-full text-left"
              aria-label="Watch the new POS software"
            >
              <div
                ref={mediaRef}
                className="relative aspect-video w-full overflow-hidden rounded-none bg-black/50 ring-1 ring-white/15 will-change-transform"
              >
                <video
                  ref={videoRef}
                  src="/videos/web_pos.mp4"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <p
                data-hero-sub
                className="mt-3 flex items-center gap-2 text-[15px] text-[var(--color-fg)]"
              >
                The new POS
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </p>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-[1] mt-12 flex flex-col items-start gap-8 md:mt-16 md:gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
        <p
          data-hero-sub
          className="max-w-[16ch] font-[family-name:var(--font-card)] text-[clamp(1.65rem,5.2vw,3.75rem)] font-light leading-[1.2] tracking-[-0.03em] md:max-w-[12.5em] md:text-[clamp(2rem,4.1vw,3.75rem)] md:leading-[1.15] lg:w-[52%]"
        >
          <span className="md:hidden">
            Brand, product, and motion—crafted with studio precision.
          </span>
          <span className="hidden md:inline">
            Pick a plan, send in your request, and your design journey starts
            tomorrow.
          </span>
        </p>

        <div
          data-hero-sub
          className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8 md:gap-5 lg:ml-auto lg:w-[41.5%]"
        >
          <button
            type="button"
            onClick={() => scrollToTarget("#about")}
            className="group inline-flex min-h-11 items-center gap-3 border-b border-[var(--color-fg)] pb-1.5 text-[clamp(1.2rem,4.5vw,2.15rem)] font-normal tracking-[-0.025em] transition-opacity hover:opacity-60 md:text-[clamp(1.35rem,2.4vw,2.15rem)]"
          >
            About us
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </button>
          <a
            href={CONTACT_MAILTO}
            className="group inline-flex min-h-11 items-center gap-3 border-b border-[var(--color-fg)] pb-1.5 text-[clamp(1.2rem,4.5vw,2.15rem)] font-normal tracking-[-0.025em] transition-opacity hover:opacity-60 md:hidden"
          >
            {CONTACT_EMAIL}
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </a>
          <button
            type="button"
            onClick={() => scrollToTarget("#pricing")}
            className="group hidden min-h-11 items-center gap-3 border-b border-[var(--color-fg)] pb-1.5 text-[clamp(1.35rem,2.4vw,2.15rem)] font-normal tracking-[-0.025em] transition-opacity hover:opacity-60 md:inline-flex"
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
