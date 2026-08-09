"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PRICING_PLANS } from "@/lib/constants";
import { fadeUp } from "@/lib/animations";
import { scrollToTarget } from "@/lib/lenis";

function FeatureRow({ feature }: { feature: string }) {
  return (
    <li className="flex items-center gap-3.5">
      <span
        className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#0e4b33]"
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
      className="bg-white px-5 pb-28 pt-20 text-black md:px-10 md:pb-36 md:pt-28 lg:px-16"
      data-nav-theme="light"
      style={{ fontFamily: "var(--font-card)" }}
    >
      {/* Intro: toggle left, statement right */}
      <div
        data-price-reveal
        className="mb-16 flex flex-col items-start gap-12 md:mb-28 md:flex-row md:items-center md:justify-between md:gap-10"
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
                ? "border-[#CBEB3A] bg-[#CBEB3A]"
                : "border-black/15 bg-[#f3f3f1]"
            }`}
          >
            <span
              className={`absolute top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-[#0e4b33] transition-[left] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-10 md:w-10 ${
                mode === "project"
                  ? "left-1.5"
                  : "left-[calc(100%-2.55rem)] md:left-[calc(100%-2.75rem)]"
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
            design team — without the
          </span>
          <br className="hidden md:block" />
          <span className="md:hidden"> </span>
          <span className="md:whitespace-nowrap">
            overhead of full-time hires.
          </span>
        </h2>
      </div>

      {/* Three equal cards — Habito scale / alignment */}
      <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-3 md:gap-4 lg:gap-5">
        {PRICING_PLANS.map((plan) => {
          const content = plan[mode];
          const featuresExtra =
            "featuresExtra" in content ? content.featuresExtra : null;

          return (
            <article
              key={plan.id}
              data-price-reveal
              className="flex h-full min-h-[880px] flex-col rounded-none bg-[#F7F7F5] px-7 py-8 md:min-h-[1020px] md:px-8 md:py-10 lg:min-h-[1100px] lg:px-10 lg:py-11"
            >
              <div className="mb-7 flex items-center justify-between gap-3 md:mb-8">
                <h3 className="font-editorial text-[1.45rem] font-normal tracking-[-0.035em] md:text-[1.65rem] lg:text-[1.8rem]">
                  {plan.name}
                </h3>
                <span className="shrink-0 rounded-full bg-[#CBEB3A] px-5 py-3.5 text-[13px] font-normal leading-none tracking-[-0.015em] text-black md:px-6 md:py-4 md:text-[15px]">
                  {plan.badge}
                </span>
              </div>

              <p className="font-editorial mb-6 flex flex-wrap items-baseline gap-x-1 leading-none tracking-[-0.045em] md:mb-7">
                <span className="text-[clamp(2.85rem,3.8vw,3.85rem)] font-semibold">
                  {content.price}
                </span>
                {content.unit ? (
                  <span className="text-[1rem] font-normal tracking-[-0.02em] text-black md:text-[1.05rem]">
                    {content.unit}
                  </span>
                ) : null}
              </p>

              <div className="mb-8 border-t border-black/10 md:mb-9" />

              <ul className="flex flex-col gap-7 md:gap-8">
                {content.features.map((feature) => (
                  <FeatureRow key={feature} feature={feature} />
                ))}
              </ul>

              {featuresExtra?.length ? (
                <>
                  <div className="my-8 border-t border-black/10 md:my-9" />
                  <ul className="flex flex-col gap-7 md:gap-8">
                    {featuresExtra.map((feature) => (
                      <FeatureRow key={feature} feature={feature} />
                    ))}
                  </ul>
                </>
              ) : null}

              <div className="mt-auto flex flex-col pt-12">
                {"footnoteLines" in plan && plan.footnoteLines ? (
                  <div className="mb-5 border-t border-black/10 pt-6">
                    <p className="text-[17px] font-normal leading-[1.45] tracking-[-0.015em] text-black/55 md:text-[18px]">
                      {plan.footnoteLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                    <a
                      href="#top"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToTarget("#top");
                      }}
                      className="mt-3 inline-block text-[17px] font-normal tracking-[-0.015em] text-black underline underline-offset-[3px] md:text-[18px]"
                    >
                      Book a Call
                    </a>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => scrollToTarget("#top")}
                  className="w-full rounded-none bg-black px-4 py-6 text-[20px] font-normal tracking-[-0.02em] text-white transition-[background-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#CBEB3A] hover:text-black md:py-7 md:text-[22px]"
                >
                  Choose Plan
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
