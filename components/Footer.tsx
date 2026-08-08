"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Marquee from "@/components/Marquee";
import { FOOTER_COLUMNS } from "@/lib/constants";
import { fadeUp } from "@/lib/animations";
import { scrollToTarget } from "@/lib/lenis";

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      fadeUp(root.querySelectorAll("[data-footer-col]"), {
        trigger: root,
        stagger: 0.08,
        y: 28,
      });

      gsap.from("[data-footer-seal]", {
        scale: 0.85,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="footer"
      ref={rootRef}
      className="bg-[var(--color-bg-inverse)] text-[var(--color-fg-inverse)]"
      data-nav-theme="dark"
    >
      <Marquee className="border-y border-white/10 py-6 md:py-10" />

      <div className="relative px-5 py-16 md:px-8 md:py-20 lg:px-12">
        <div
          data-footer-seal
          className="pointer-events-none absolute left-1/2 top-1/2 hidden h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 md:flex"
          aria-hidden
        >
          <span className="font-display text-center text-xs uppercase leading-tight tracking-[0.2em]">
            Fiveo
            <br />
            Studio
          </span>
        </div>

        <div className="grid gap-12 md:grid-cols-4 md:gap-8">
          <div data-footer-col>
            <p className="mb-5 text-xs uppercase tracking-[0.18em] text-white/45">
              Navigation
            </p>
            <ul className="flex flex-col gap-3">
              {FOOTER_COLUMNS.navigation.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToTarget(link.href);
                    }}
                    className="text-sm uppercase tracking-[0.1em] transition-opacity hover:opacity-60"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-footer-col>
            <p className="mb-5 text-xs uppercase tracking-[0.18em] text-white/45">
              Socials
            </p>
            <ul className="flex flex-col gap-3">
              {FOOTER_COLUMNS.socials.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm uppercase tracking-[0.1em] transition-opacity hover:opacity-60"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-footer-col>
            <p className="mb-5 text-xs uppercase tracking-[0.18em] text-white/45">
              Legal
            </p>
            <ul className="flex flex-col gap-3">
              {FOOTER_COLUMNS.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm uppercase tracking-[0.1em] transition-opacity hover:opacity-60"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-footer-col className="md:text-right">
            <button
              type="button"
              onClick={() => scrollToTarget("#top", { immediate: false })}
              className="border border-white/30 px-5 py-3 text-sm uppercase tracking-[0.14em] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Back to Top
            </button>
            <p className="mt-8 font-display text-2xl tracking-tight">FIVEO</p>
            <p className="mt-2 text-xs text-white/40">
              © {new Date().getFullYear()} FIVEO Studio
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
