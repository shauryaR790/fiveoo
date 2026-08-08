"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { PROCESS_STEPS } from "@/lib/constants";
import { fadeUp, revealText } from "@/lib/animations";

export default function Process() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const heading = root.querySelector("[data-process-heading] span");
      if (heading) {
        revealText(heading, { trigger: root });
      }

      fadeUp(root.querySelectorAll("[data-process-step]"), {
        trigger: root,
        stagger: 0.18,
        y: 40,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="bg-[var(--color-bg)] px-5 py-24 text-[var(--color-fg)] md:px-8 md:py-32 lg:px-12"
      data-nav-theme="light"
      aria-label="Process"
    >
      <h2
        data-process-heading
        className="mb-16 overflow-hidden font-display text-[clamp(2.5rem,7vw,5.5rem)] uppercase leading-[0.95] md:mb-24"
      >
        <span className="block will-change-transform">Optimal Results</span>
      </h2>

      <div className="mx-auto max-w-5xl">
        {PROCESS_STEPS.map((step) => (
          <div
            key={step.number}
            data-process-step
            className="grid grid-cols-[auto_1fr] gap-6 border-t border-[var(--color-border)] py-10 md:grid-cols-[6rem_1fr_1.2fr] md:gap-12 md:py-14"
          >
            <span className="font-display text-sm tracking-[0.16em] text-[var(--color-fg-muted)] md:text-base">
              {step.number}
            </span>
            <h3 className="font-display text-2xl uppercase leading-tight md:text-3xl">
              {step.title}
            </h3>
            <p className="col-span-2 max-w-xl text-sm leading-relaxed text-[var(--color-fg-muted)] md:col-span-1 md:text-base">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
