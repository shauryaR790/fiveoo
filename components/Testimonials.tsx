"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { TESTIMONIALS } from "@/lib/constants";
import { fadeUp, prefersReducedMotion } from "@/lib/animations";

export default function Testimonials() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      fadeUp(root.querySelectorAll("[data-quote]"), {
        trigger: root,
        stagger: 0.2,
        y: 48,
      });

      if (!prefersReducedMotion()) {
        gsap.from(root.querySelectorAll("[data-quote-mark]"), {
          scale: 0.6,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="bg-[var(--color-surface-muted)] px-5 py-24 text-[var(--color-fg)] md:px-8 md:py-32 lg:px-12"
      data-nav-theme="light"
      aria-label="Testimonials"
    >
      <p className="mb-12 text-sm uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
        Clients
      </p>

      <div className="grid gap-16 md:grid-cols-2 md:gap-20">
        {TESTIMONIALS.map((item) => (
          <blockquote key={item.author} data-quote className="relative">
            <span
              data-quote-mark
              className="font-display text-6xl leading-none text-[var(--color-accent-deep)] md:text-7xl"
              aria-hidden
            >
              “
            </span>
            <p className="mt-2 max-w-xl text-xl leading-snug md:text-2xl lg:text-3xl">
              {item.quote}
            </p>
            <footer className="mt-8 text-sm uppercase tracking-[0.12em]">
              <cite className="not-italic font-medium">{item.author}</cite>
              <span className="mt-1 block text-[var(--color-fg-muted)]">
                {item.role}
              </span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
