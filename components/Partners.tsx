"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { PARTNERS } from "@/lib/constants";
import { fadeUp } from "@/lib/animations";

export default function Partners() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      fadeUp(root.querySelectorAll("[data-partner]"), {
        trigger: root,
        stagger: 0.06,
        y: 24,
        duration: 0.7,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="bg-[var(--color-bg)] px-5 py-20 text-[var(--color-fg)] md:px-8 md:py-28 lg:px-12"
      data-nav-theme="light"
      aria-label="Partners"
    >
      <p className="mb-10 text-sm uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
        Partners
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
        {PARTNERS.map((name) => (
          <div
            key={name}
            data-partner
            className="flex aspect-[3/2] items-center justify-center bg-[var(--color-surface-muted)] transition-colors duration-300 hover:bg-[var(--color-accent)]"
          >
            <span className="font-display text-lg uppercase tracking-[0.18em] md:text-xl">
              {name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
