"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { PRICING_PLANS } from "@/lib/constants";
import { fadeUp } from "@/lib/animations";
import { scrollToTarget } from "@/lib/lenis";

export default function Pricing() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      fadeUp(root.querySelectorAll("[data-price-card]"), {
        trigger: root,
        stagger: 0.12,
        y: 56,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="pricing"
      ref={rootRef}
      className="bg-[var(--color-bg)] px-5 py-24 text-[var(--color-fg)] md:px-8 md:py-32 lg:px-12"
      data-nav-theme="light"
    >
      <div className="mb-14 max-w-2xl">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          Pricing
        </p>
        <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.95]">
          Choose a plan that fits
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {PRICING_PLANS.map((plan) => (
          <article
            key={plan.name}
            data-price-card
            className="flex flex-col border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--color-accent-deep)] md:p-8"
          >
            <h3 className="font-display text-2xl uppercase tracking-tight md:text-3xl">
              {plan.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-4xl tracking-tight">
                {plan.price}
              </span>
              {plan.period ? (
                <span className="text-sm text-[var(--color-fg-muted)]">
                  {plan.period}
                </span>
              ) : null}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {plan.description}
            </p>
            <ul className="mt-8 flex flex-1 flex-col gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 bg-[var(--color-accent-deep)]"
                    aria-hidden
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => scrollToTarget("#top")}
              className="mt-10 w-full bg-[var(--color-bg-inverse)] px-4 py-3.5 text-sm uppercase tracking-[0.14em] text-[var(--color-fg-inverse)] transition-opacity hover:opacity-85"
            >
              Choose Plan
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
