"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { PROCESS_STEPS } from "@/lib/constants";
import { fadeUp } from "@/lib/animations";
export default function Process() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      fadeUp(root.querySelectorAll("[data-process-reveal]"), {
        trigger: root,
        stagger: 0.12,
        y: 36,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={rootRef}
      className="relative theme-surface overflow-hidden border-b border-[var(--color-fg)]/12 px-5 pb-12 pt-20 md:px-10 md:pb-16 md:pt-28 lg:px-16"
      data-nav-theme="dark"
      aria-label="Process"
      style={{ fontFamily: "var(--font-card)" }}
    >
      <div className="grid grid-cols-1 items-start gap-16 md:grid-cols-2 md:gap-14 lg:gap-24">
        <div className="mt-[7px] md:-mt-[3px] lg:-mt-px">
          <h2
            data-process-reveal
            className="font-display m-0 max-w-[8ch] text-[clamp(4rem,9vw,8.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.055em] md:sticky md:top-24"
          >
            <span className="block">Seamless</span>
            <span className="block">Process,</span>
            <span className="block">Optimal</span>
            <span className="block">Results.</span>
          </h2>
        </div>

        <div className="w-full">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.number}
              data-process-reveal
              data-process-step
              className={`grid grid-cols-[4.5rem_1fr] gap-x-6 md:grid-cols-[5.5rem_1fr] md:gap-x-10 ${
                step.number === "01"
                  ? "pb-9 md:pb-12"
                  : "border-t border-white/12 py-9 md:py-12"
              }`}
            >
              <span className="pt-0.5 text-[18px] font-medium tracking-[-0.02em] text-[var(--color-neon-orange)] md:text-[20px]">
                ({step.number})
              </span>
              <div>
                <h3 className="mb-4 text-[20px] font-semibold leading-[1.25] tracking-[-0.03em] text-white md:mb-5 md:text-[24px]">
                  {step.title}
                </h3>
                <p className="max-w-[36rem] text-[16px] font-normal leading-[1.55] tracking-[-0.015em] text-white/55 md:text-[18px]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
