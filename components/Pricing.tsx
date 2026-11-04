"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PRICING_PLANS } from "@/lib/constants";
import { fadeUp } from "@/lib/animations";
import { scrollToTarget } from "@/lib/lenis";
import NeonFog from "@/components/NeonFog";
import { ChatAsterisk } from "@/components/Chatbot";

function FeatureRow({ feature }: { feature: string }) {
  return (
    <li className="flex items-center gap-3.5">
      <span
        className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-white"
        aria-hidden
      >
        <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
          <path
            d="M2.1 5.15 4.05 7.1 7.9 2.9"
            stroke="#000"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-[22px] font-normal leading-[1.25] tracking-[-0.02em] md:text-[23px]">
        {feature}
      </span>
    </li>
  );
}

export default function Pricing() {
  const rootRef = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<"project" | "subscription">("project");

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      fadeUp(root.querySelectorAll("[data-price-reveal]"), {
        trigger: root,
        stagger: 0.1,
        y: 40,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="pricing"
      ref={rootRef}
      className="relative theme-surface scroll-mt-[var(--nav-height)] overflow-x-clip px-5 pb-16 pt-[calc(var(--nav-height)+1.25rem)] md:px-10 md:pb-36 md:pt-[calc(var(--nav-height)+3rem)] lg:px-16"
      data-nav-theme="dark"
      style={{ fontFamily: "var(--font-card)" }}
    >
      <div
        data-price-reveal
        className="relative z-[2] mb-10 flex flex-col items-start gap-8 md:mb-28 md:flex-row md:items-center md:justify-between md:gap-10 lg:mb-32"
      >
        <div className="flex shrink-0 items-center gap-5">
          <span
            className={`text-[18px] font-medium tracking-[-0.02em] transition-opacity duration-300 md:text-[20px] ${
              mode === "project" ? "opacity-100" : "opacity-40"
            }`}
          >
            Project
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={mode === "subscription"}
            aria-label="Toggle Project or Subscription pricing"
            onClick={() =>
              setMode((m) => (m === "project" ? "subscription" : "project"))
            }
            className={`relative h-12 w-[5.75rem] shrink-0 rounded-full border transition-[background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-[3.25rem] md:w-[6.5rem] ${
              mode === "subscription"
                ? "border-[var(--color-neon-orange)] bg-[var(--color-neon-orange)]"
                : "border-[var(--color-fg)]/25 bg-[var(--color-fg)]/10"
            }`}
          >
            <span
              className={`absolute top-1/2 h-9 w-9 -translate-y-1/2 rounded-full transition-[left,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-10 md:w-10 ${
                mode === "project"
                  ? "left-1.5 bg-[var(--color-bg-inverse)]"
                  : "left-[calc(100%-2.55rem)] bg-[var(--color-fg)] md:left-[calc(100%-2.75rem)]"
              }`}
            />
          </button>
          <span
            className={`text-[18px] font-medium tracking-[-0.02em] transition-opacity duration-300 md:text-[20px] ${
              mode === "subscription" ? "opacity-100" : "opacity-40"
            }`}
          >
            Subscription
          </span>
        </div>

        <h2 className="font-editorial text-[clamp(2.25rem,4.8vw,4.25rem)] font-normal leading-[1.05] tracking-[-0.04em] [hyphens:none]">
          <span className="md:whitespace-nowrap">
            Think of it as your on-demand
          </span>
          <br className="hidden md:block" />
          <span className="md:hidden"> </span>
          <span className="md:whitespace-nowrap">
            design team, without the
          </span>
          <br className="hidden md:block" />
          <span className="md:hidden"> </span>
          <span className="md:whitespace-nowrap">
            overhead of full-time hires.
          </span>
        </h2>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <NeonFog variant="hero" className="!h-full" />
        </div>

        <div className="relative z-[1] grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 md:gap-4 lg:gap-5">
        {PRICING_PLANS.map((plan) => {
          const content = plan[mode];
          const featuresExtra =
            "featuresExtra" in content ? content.featuresExtra : null;

          const isPopular = plan.id === "business";

          return (
            <article
              key={plan.id}
              className="theme-card glass-fallback relative isolate flex h-full min-h-0 flex-col rounded-[22px] px-5 py-6 md:rounded-[28px] md:px-8 md:py-8 lg:px-9 lg:py-9"
            >
              {isPopular ? (
                <span
                  className="absolute -right-2 -top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#e11d2e] text-white shadow-[0_8px_20px_rgba(225,29,46,0.35)] md:-right-2.5 md:-top-2.5 md:h-12 md:w-12"
                  aria-hidden
                >
                  <ChatAsterisk className="h-6 w-6 text-white md:h-7 md:w-7" />
                </span>
              ) : null}
              <div data-price-reveal className="flex flex-1 flex-col">
                <div className="mb-5 flex items-center justify-between gap-3 md:mb-6">
                  <h3 className="font-editorial text-[1.45rem] font-normal tracking-[-0.035em] md:text-[1.65rem] lg:text-[1.8rem]">
                    {plan.name}
                  </h3>
                  <span className="glass-fallback shrink-0 rounded-full px-5 py-3.5 text-[13px] font-medium leading-none tracking-[-0.015em] text-[var(--color-fg)] md:px-6 md:py-4 md:text-[15px]">
                    {plan.badge}
                  </span>
                </div>

                <p className="font-editorial mb-5 flex flex-wrap items-baseline gap-x-1 leading-none tracking-[-0.045em] md:mb-6">
                  <span className="text-[clamp(2.85rem,3.8vw,3.85rem)] font-semibold">
                    {content.price}
                  </span>
                  {content.unit ? (
                    <span className="text-[1rem] font-normal tracking-[-0.02em] text-[var(--color-fg)]/70 md:text-[1.05rem]">
                      {content.unit}
                    </span>
                  ) : null}
                </p>

                <div className="mb-6 border-t border-[var(--color-fg)]/12 md:mb-7" />

                <ul className="flex flex-col gap-3.5 md:gap-6">
                  {content.features.map((feature) => (
                    <FeatureRow key={feature} feature={feature} />
                  ))}
                </ul>

                {featuresExtra?.length ? (
                  <>
                    <div className="my-5 border-t border-[var(--color-fg)]/12 md:my-7" />
                    <ul className="flex flex-col gap-3.5 md:gap-6">
                      {featuresExtra.map((feature) => (
                        <FeatureRow key={feature} feature={feature} />
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>

              <div className="mt-auto pt-6 md:pt-9">
                <button
                  type="button"
                  className="price-choose-btn flex w-full items-center justify-center rounded-full bg-[#e11d2e] px-[22px] py-[15px] text-[18px] font-bold tracking-[-0.02em] text-white transition-[filter,transform] duration-300 hover:brightness-110 active:scale-[0.98] md:py-[18px] md:text-[22px]"
                  onClick={() => scrollToTarget("#top")}
                >
                  Choose Plan
                </button>
              </div>
            </article>
          );
        })}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[22%] bg-gradient-to-b from-transparent to-[var(--color-bg)]"
        aria-hidden
      />
    </section>
  );
}
