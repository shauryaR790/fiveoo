"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICE_GROUPS } from "@/lib/constants";
import { prefersReducedMotion, isMobileViewport, fadeUp } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = "Our Services";

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

      /** How far the line has to travel once it runs out of room. */
      const overshoot = () =>
        -Math.max(0, track.scrollWidth - window.innerWidth + 48);

      // Set the hidden state outright rather than relying on a from-value
      // rendering before the first scrub tick.
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
          // Pinned sections must refresh in document order; this one is last.
          refreshPriority: -1,
        },
      });

      /* ---- Letters rise one at a time; once the line fills the width it
         slides left to keep making room for the ones still arriving. ---- */
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
        /* Cards start rising before the last letters finish sliding in. */
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
        {/* Oversized line, wider than the viewport on purpose. The size lives
            in a style so the em-based word space scales with it. */}
        <div className="overflow-hidden pt-[calc(var(--nav-height)+2rem)] md:absolute md:inset-x-0 md:top-[28%] md:pt-0">
          <div
            ref={trackRef}
            style={{ fontSize: "clamp(4.5rem, 21vw, 28rem)" }}
            className="font-display flex w-max items-end pl-5 pr-[10vw] uppercase leading-[0.82] will-change-transform md:pl-10 lg:pl-12"
          >
            {HEADLINE.split("").map((char, index) =>
              char === " " ? (
                <span key={index} className="w-[0.2em] shrink-0" aria-hidden />
              ) : (
                <span
                  key={index}
                  className="inline-block overflow-hidden"
                >
                  <span data-letter className="inline-block will-change-transform">
                    {char}
                  </span>
                </span>
              ),
            )}
          </div>
          <h2 className="sr-only">{HEADLINE}</h2>
        </div>

        {/* Three equal tall cards over the type — match Habito proportions */}
        <div className="px-5 pb-10 pt-16 md:absolute md:inset-x-0 md:bottom-6 md:top-[calc(var(--nav-height)+1.25rem)] md:px-8 md:pb-0 md:pt-0 lg:px-10">
          <div className="grid h-full grid-cols-1 gap-2.5 md:grid-cols-3 md:gap-2.5">
            {SERVICE_GROUPS.map((group) => (
              <div
                key={group.id}
                data-service-card
                className="flex h-full min-h-[70vh] flex-col bg-white px-7 py-8 will-change-transform md:min-h-0 md:px-8 md:py-9"
                style={{ fontFamily: "var(--font-card)" }}
              >
                {/* Inter (not Inter Tight) — Habito's cards use an open
                    geometric sans, not a condensed display cut. */}
                <h3 className="mb-9 whitespace-pre-line text-[clamp(1.85rem,2.7vw,2.55rem)] font-semibold leading-[1.18] tracking-[-0.02em]">
                  {group.title}
                </h3>
                <ul className="flex flex-1 flex-col justify-between gap-5 pb-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-3.5">
                      <span
                        className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#0d4a3a]"
                        aria-hidden
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <path
                            d="M2 5.2 4 7.2 8 3"
                            stroke="#fff"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="text-[16px] font-normal leading-none tracking-[-0.01em]">
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
