"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/constants";
import { prefersReducedMotion, bindCursorSlideTrack } from "@/lib/animations";
import { scrollToTarget } from "@/lib/lenis";
import NeonFog from "@/components/NeonFog";
import FiveoMark from "@/components/FiveoMark";
import { HERO_PLAN } from "@/lib/hero-plan";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLSpanElement[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const planA = HERO_PLAN === "a";

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(linesRef.current, { yPercent: 0, opacity: 1 });
        if (!planA) gsap.set(mediaRef.current, { opacity: 1, scale: 1 });
        return;
      }

      if (!planA) {
        gsap.from(mediaRef.current, {
          opacity: 0,
          y: 28,
          scale: 0.98,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.05,
        });
      }

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
  }, [planA]);

  useLayoutEffect(() => {
    if (planA) return;
    const track = trackRef.current;
    const slide = slideRef.current;
    if (!track || !slide) return;

    return bindCursorSlideTrack(track, slide, { restRatio: 0 });
  }, [planA]);

  useEffect(() => {
    if (planA) return;
    const video = videoRef.current;
    if (!video || prefersReducedMotion()) return;
    void video.play().catch(() => {});
  }, [planA]);

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

      {planA ? (
        <a
          href="#top"
          className="absolute left-5 top-[75px] z-[2] -translate-x-2 overflow-visible text-[var(--color-fg)] md:left-10 md:-translate-x-8 lg:left-12 lg:-translate-x-10"
          aria-label="FIVEO"
        >
          <FiveoMark className="h-[22rem] w-auto overflow-visible md:h-[28rem]" />
        </a>
      ) : null}

      {planA ? (
        <div className="relative z-[1] flex flex-1 flex-col justify-center">
          <h1 className="font-display ml-auto max-w-[14ch] text-right text-[clamp(2.35rem,11.2vw,7.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em] md:text-[clamp(2.75rem,7.8vw,7.5rem)] md:leading-[0.88]">
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
      ) : (
        <div className="relative z-[1] flex flex-1 flex-col gap-10 md:gap-12 lg:flex-row lg:items-center lg:gap-0">
          {/* Showreel — left */}
          <div
            ref={trackRef}
            className="relative w-full lg:w-[42%] lg:max-w-[480px] lg:pt-2"
          >
            <div
              ref={slideRef}
              data-cursor-grow
              className="mr-auto w-full max-w-[min(100%,420px)] will-change-transform lg:w-full lg:max-w-none"
            >
              <div
                ref={mediaRef}
                className="relative aspect-video w-full overflow-hidden rounded-none bg-black/50 ring-1 ring-white/15 will-change-transform"
              >
                <video
                  ref={videoRef}
                  src="/videos/frontfiveo.mp4"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              </div>
              <p
                data-hero-sub
                className="mt-3 text-[15px] text-[var(--color-fg)]"
              >
                FIVEO Showreels
              </p>
            </div>
          </div>

          {/* Headline — right */}
          <div className="flex flex-1 flex-col justify-center lg:ml-auto lg:w-[41.5%] lg:flex-none">
            <h1 className="font-display ml-auto max-w-[14ch] text-right text-[clamp(2.35rem,11.2vw,7.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em] md:text-[clamp(2.75rem,7.8vw,7.5rem)] md:leading-[0.88]">
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
        </div>
      )}

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
