"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { SERVICE_GROUPS } from "@/lib/constants";
import { prefersReducedMotion, isMobileViewport, fadeUp } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

/** Glyphs in the scroll line — clover sits between OUR and SERVICES. */
const HEADLINE_PARTS = [
  { type: "char" as const, value: "O" },
  { type: "char" as const, value: "U" },
  { type: "char" as const, value: "R" },
  { type: "space" as const },
  { type: "clover" as const },
  { type: "space" as const },
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

      if (prefersReducedMotion() || isMobileViewport()) {
        gsap.set(letters, { yPercent: 0 });
        gsap.set(cards, { yPercent: 0, opacity: 1 });
        fadeUp(cards, { trigger: stage, stagger: 0.12, y: 40 });
        return;
      }

      const overshoot = () =>
        -Math.max(0, track.scrollWidth - window.innerWidth + 48);

      gsap.set(letters, { yPercent: 125 });
      gsap.set(cards, { yPercent: 118 });

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
        },
      });

      /* Letters + clover rise as one sequence, then the line slides left. */
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
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={rootRef}
      className="relative bg-[var(--color-bg)] text-[var(--color-fg)]"
      data-nav-theme="light"
    >
      <div ref={stageRef} className="relative overflow-hidden md:h-[100svh]">
        <div className="relative z-0 overflow-hidden pt-[calc(var(--nav-height)+2rem)] md:absolute md:inset-x-0 md:top-[28%] md:pt-0">
          <div
            ref={trackRef}
            style={{ fontSize: "clamp(4.5rem, 21vw, 28rem)" }}
            className="font-display flex w-max items-end pl-5 pr-[10vw] uppercase leading-[0.82] will-change-transform md:pl-10 lg:pl-12"
          >
            {HEADLINE_PARTS.map((part, index) => {
              if (part.type === "space") {
                return (
                  <span
                    key={`sp-${index}`}
                    className="w-[0.2em] shrink-0"
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
                      className="relative inline-block h-[0.72em] w-[0.72em] translate-y-[-0.04em] will-change-transform"
                    >
                      <Image
                        src="/images/leaf.avif"
                        alt=""
                        fill
                        sizes="200px"
                        className="object-contain"
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
                  <span
                    data-letter
                    className="inline-block will-change-transform"
                  >
                    {part.value}
                  </span>
                </span>
              );
            })}
          </div>
          <h2 className="sr-only">Our Services</h2>
        </div>

        <div className="relative z-[2] px-5 pb-10 pt-16 md:absolute md:inset-0 md:flex md:items-center md:px-[60px] md:pb-0 md:pt-0">
          <div className="grid w-full grid-cols-1 gap-[18px] md:grid-cols-3">
            {SERVICE_GROUPS.map((group) => (
              <div
                key={group.id}
                data-service-card
                className="flex min-h-[70vh] flex-col bg-white p-10 will-change-transform md:h-[760px] md:min-h-0 md:w-full"
                style={{ fontFamily: "var(--font-card)" }}
              >
                <h3 className="font-editorial mb-10 max-w-[360px] whitespace-pre-line text-[2rem] leading-[1.12] text-black md:mb-[56px] md:text-[44px]">
                  {group.title}
                </h3>
                <ul className="flex flex-col gap-7 md:gap-8">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-3.5">
                      <span
                        className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#0e4b33]"
                        aria-hidden
                      >
                        <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                          <path
                            d="M2.1 5.15 4.05 7.1 7.9 2.9"
                            stroke="#ccff00"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="text-[22px] font-normal leading-[1.25] tracking-[-0.02em] text-black md:text-[23px]">
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
