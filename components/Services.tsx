"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { SERVICE_GROUPS } from "@/lib/constants";
import {
  prefersReducedMotion,
  setNavInvert,
  setNavPinDrive,
  refreshScrollTrigger,
} from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

/** Glyphs in the scroll line - clover sits between OUR and SERVICES. */
const HEADLINE_PARTS = [
  { type: "char" as const, value: "O" },
  { type: "char" as const, value: "U" },
  { type: "char" as const, value: "R" },
  { type: "space" as const },
  { type: "clover" as const },
  /** Forces OUR * / SERVICES stack on mobile; hidden on md+ marquee. */
  { type: "break" as const },
  /** Gap between clover and SERVICES on desktop marquee only. */
  { type: "mdSpace" as const },
  { type: "char" as const, value: "S" },
  { type: "char" as const, value: "E" },
  { type: "char" as const, value: "R" },
  { type: "char" as const, value: "V" },
  { type: "char" as const, value: "I" },
  { type: "char" as const, value: "C" },
  { type: "char" as const, value: "E" },
  { type: "char" as const, value: "S" },
];

export default function Services() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!root || !stage || !track) return;

    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray<HTMLElement>("[data-letter]", track);
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-service-card]",
        stage,
      );
      const headline = headlineRef.current;

      const mm = gsap.matchMedia();

      // Phone: fully static - no pin, scrub, fade, or letter motion.
      mm.add("(max-width: 768px)", () => {
        gsap.killTweensOf([letters, cards, track, headline].filter(Boolean));
        gsap.set(letters, { yPercent: 0, x: 0, clearProps: "transform" });
        gsap.set(track, { x: 0, clearProps: "transform" });
        if (headline) {
          gsap.set(headline, {
            opacity: 1,
            y: 0,
            clearProps: "opacity,transform",
          });
        }
        gsap.set(cards, {
          yPercent: 0,
          y: 0,
          autoAlpha: 1,
          clearProps: "transform,opacity,visibility",
        });
        ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: "bottom top",
          onEnter: () => setNavInvert(true),
          onEnterBack: () => setNavInvert(true),
          onLeave: () => setNavInvert(false),
          onLeaveBack: () => setNavInvert(false),
        });
      });

      mm.add("(min-width: 769px)", () => {
        if (prefersReducedMotion()) {
          gsap.set(letters, { yPercent: 0 });
          gsap.set(track, { x: 0 });
          gsap.set(cards, { yPercent: 0, autoAlpha: 1 });
          if (headline) gsap.set(headline, { opacity: 1, y: 0 });
          return;
        }

        const overshoot = () =>
          -Math.max(0, track.scrollWidth - window.innerWidth + 48);

        gsap.set(letters, { yPercent: 125 });
        gsap.set(cards, { yPercent: 118, autoAlpha: 1 });
        if (headline) gsap.set(headline, { opacity: 1, y: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=340%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: -1,
            onEnter: () => setNavPinDrive(true),
            onEnterBack: () => setNavPinDrive(true),
            onUpdate: (self) => setNavInvert(self.progress >= 0.48),
            onLeave: () => {
              setNavPinDrive(false);
              setNavInvert(false);
            },
            onLeaveBack: () => {
              setNavPinDrive(false);
              setNavInvert(false);
            },
          },
        });

        tl.to(
          letters,
          {
            yPercent: 0,
            ease: "power2.out",
            duration: 0.16,
            stagger: { each: 0.055 },
          },
          0,
        )
          .fromTo(
            track,
            { x: 0 },
            { x: overshoot, ease: "none", duration: 0.58 },
            0.14,
          )
          .to(
            cards,
            {
              yPercent: 0,
              ease: "power3.out",
              duration: 0.28,
              stagger: 0.1,
            },
            0.48,
          );

        if (headline) {
          tl.to(
            headline,
            {
              opacity: 0,
              y: 56,
              ease: "power3.inOut",
              duration: 0.28,
            },
            0.72,
          );
        }
      });
    }, root);

    const refresh = () => refreshScrollTrigger();
    requestAnimationFrame(refresh);
    const t = window.setTimeout(refresh, 400);
    document.fonts?.ready?.then(refresh).catch(() => {});

    return () => {
      window.clearTimeout(t);
      setNavInvert(false);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="services"
      ref={rootRef}
      className="relative theme-surface bg-[var(--color-bg)] text-[var(--color-fg)]"
      data-nav-theme="dark"
    >
      <div
        ref={stageRef}
        className="relative min-h-0 overflow-x-clip overflow-y-visible bg-[var(--color-bg)] md:h-[100svh] md:min-h-[100svh] md:overflow-hidden"
      >
        <div
          ref={headlineRef}
          className="relative z-[2] overflow-x-clip overflow-y-visible pb-4 pt-[calc(var(--nav-height)+1rem)] md:absolute md:inset-x-0 md:bottom-[6%] md:overflow-visible md:pb-0 md:pt-0 lg:bottom-[7%]"
        >
          <div
            ref={trackRef}
            className="font-display flex w-full flex-wrap items-end pl-5 pr-5 text-[clamp(2.75rem,16vw,7rem)] uppercase leading-[0.82] text-[var(--color-fg)] md:w-max md:flex-nowrap md:pl-10 md:pr-[10vw] md:text-[clamp(4.5rem,21vw,28rem)] lg:pl-12"
          >
            {HEADLINE_PARTS.map((part, index) => {
              if (part.type === "break") {
                return (
                  <span
                    key={`br-${index}`}
                    className="basis-full w-full md:hidden"
                    aria-hidden
                  />
                );
              }

              if (part.type === "space" || part.type === "mdSpace") {
                return (
                  <span
                    key={`sp-${index}`}
                    className={
                      part.type === "mdSpace"
                        ? "hidden w-[0.2em] shrink-0 md:block"
                        : "w-[0.2em] shrink-0"
                    }
                    aria-hidden
                  />
                );
              }

              if (part.type === "clover") {
                return (
                  <span
                    key="clover"
                    className="inline-block overflow-hidden px-[0.04em]"
                  >
                    <span
                      data-letter
                      className="relative inline-block h-[0.72em] w-[0.72em] translate-y-[-0.04em]"
                    >
                      <Image
                        src="/images/leaf.avif"
                        alt=""
                        fill
                        sizes="200px"
                        className="object-contain theme-leaf"
                      />
                    </span>
                  </span>
                );
              }

              return (
                <span
                  key={`${part.value}-${index}`}
                  className="inline-block overflow-hidden"
                >
                  <span data-letter className="inline-block">
                    {part.value}
                  </span>
                </span>
              );
            })}
          </div>
          <h2 className="sr-only">Our Services</h2>
        </div>

        <div className="relative z-[4] px-5 pb-8 pt-10 md:absolute md:inset-0 md:flex md:translate-y-[15px] md:items-center md:px-[60px] md:pb-0 md:pt-0">
          <div className="grid w-full grid-cols-1 gap-3.5 md:grid-cols-3 md:gap-[18px]">
            {SERVICE_GROUPS.map((group) => (
              <div
                key={group.id}
                data-service-card
                className="theme-card glass-fallback flex min-h-0 flex-col rounded-[20px] p-5 text-[var(--color-fg)] will-change-transform md:h-[760px] md:w-full md:rounded-[24px] md:p-10"
                style={{ fontFamily: "var(--font-card)" }}
              >
                <h3 className="font-editorial mb-5 max-w-[360px] whitespace-pre-line text-[1.45rem] leading-[1.12] md:mb-[56px] md:text-[44px]">
                  {group.title}
                </h3>
                <ul className="flex flex-col gap-4 md:gap-8">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span
                        className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-black md:h-[26px] md:w-[26px]"
                        aria-hidden
                      >
                        <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                          <path
                            d="M2.1 5.15 4.05 7.1 7.9 2.9"
                            stroke="#fff"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="text-[16px] font-normal leading-[1.25] tracking-[-0.02em] md:text-[23px]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
