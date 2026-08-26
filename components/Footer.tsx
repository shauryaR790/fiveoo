"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { FOOTER_LINK_COLUMNS } from "@/lib/constants";
import {
  fadeUp,
  infiniteMarquee,
  prefersReducedMotion,
} from "@/lib/animations";
import { navigateToSection } from "@/lib/navigate";
import { getLenis } from "@/lib/lenis";
import NeonFog from "@/components/NeonFog";
import GooglePreferredSource from "@/components/GooglePreferredSource";

function BrandUnit() {
  return (
    <div className="flex shrink-0 items-center gap-[0.1em] whitespace-nowrap px-[0.2em] font-display text-[clamp(5rem,18vw,15rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.06em]">
      <span>Wemakeitreal</span>
      <span className="relative mx-[0.06em] inline-block h-[0.95em] w-[0.95em] shrink-0 translate-y-[-0.02em]">
        <Image
          src="/images/leaf.avif"
          alt=""
          fill
          sizes="320px"
          className="object-contain theme-leaf"
        />
      </span>
      <span>Fiveo Studio</span>
    </div>
  );
}

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    let onScroll: (() => void) | undefined;
    let marqueeTween: gsap.core.Tween | null = null;
    let rafId = 0;

    const ctx = gsap.context(() => {
      fadeUp(root.querySelectorAll("[data-footer-reveal]"), {
        trigger: root,
        stagger: 0.08,
        y: 28,
      });

      const startMarquee = () => {
        if (prefersReducedMotion()) return;

        marqueeTween?.kill();
        marqueeTween = infiniteMarquee(track, { duration: 32, reversed: false });
        if (!marqueeTween) return;

        onScroll = () => {
          const velocity = Math.abs(getLenis()?.velocity ?? 0);
          marqueeTween?.timeScale(
            gsap.utils.clamp(1, 1.5, 1 + velocity / 40),
          );
        };

        getLenis()?.on("scroll", onScroll);
      };

      const tryStart = () => {
        if (track.scrollWidth > 0) {
          startMarquee();
          return;
        }
        rafId = requestAnimationFrame(tryStart);
      };

      const boot = () => requestAnimationFrame(tryStart);

      if (document.fonts?.ready) {
        void document.fonts.ready.then(boot);
      } else {
        boot();
      }
    }, root);

    return () => {
      cancelAnimationFrame(rafId);
      if (onScroll) getLenis()?.off("scroll", onScroll);
      marqueeTween?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <footer
      id="footer"
      ref={rootRef}
      className="relative theme-surface flex min-h-dvh flex-col overflow-x-clip"
      data-nav-theme="dark"
      style={{ fontFamily: "var(--font-card)" }}
    >
      <NeonFog variant="footer" />
      {/* Soft dissolve at page edge - overlay, not clip, so no hard fog border */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[48%] bg-gradient-to-b from-transparent via-[var(--color-bg)]/55 to-[var(--color-bg)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20 bg-[var(--color-bg)]"
        aria-hidden
      />

      <div className="relative z-[2] flex flex-1 flex-col">
      <div className="relative shrink-0 overflow-hidden pt-8 md:pt-12" aria-hidden>
        <div ref={trackRef} className="flex w-max will-change-transform">
          <BrandUnit />
          <BrandUnit />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-5 py-16 md:px-10 md:py-20 lg:px-16">
        <div className="grid grid-cols-1 items-start gap-16 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Left - slim Habito CTA */}
          <div data-footer-reveal>
            <p className="max-w-[16ch] font-[family-name:var(--font-card)] text-[clamp(1.7rem,3vw,2.65rem)] font-light leading-[1.25] tracking-[-0.03em] text-[var(--color-fg)]">
              Choose a plan, send in your request, and your design journey
              starts tomorrow.
            </p>
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                void navigateToSection("#pricing");
              }}
              className="mt-8 inline-flex items-center gap-2 border-b border-[var(--color-fg)]/75 pb-0.5 font-[family-name:var(--font-card)] text-[15px] font-light tracking-[-0.015em] text-[var(--color-fg)] transition-opacity hover:opacity-55"
            >
              Explore Plans
              <span aria-hidden>→</span>
            </a>
          </div>

          {/* Right - Habito link columns */}
          <div data-footer-reveal>
            <div className="grid grid-cols-3 gap-x-6 md:gap-x-10 lg:gap-x-14">
              {FOOTER_LINK_COLUMNS.map((column, colIndex) => (
                <ul key={colIndex} className="flex flex-col gap-5 md:gap-6">
                  {column.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          if (link.href.startsWith("#") && link.href !== "#") {
                            e.preventDefault();
                            void navigateToSection(link.href);
                          }
                        }}
                        className="whitespace-nowrap font-[family-name:var(--font-card)] text-[20px] font-light tracking-[-0.02em] text-[var(--color-fg)] transition-opacity hover:opacity-50 md:text-[24px] lg:text-[28px]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>

            <button
              type="button"
              onClick={() => void navigateToSection("#top")}
              className="mt-14 inline-flex items-center gap-2 border-b border-[var(--color-fg)]/75 pb-0.5 font-[family-name:var(--font-card)] text-[15px] font-light tracking-[-0.015em] text-[var(--color-fg)] transition-opacity hover:opacity-55"
            >
              Back to Top
              <span aria-hidden>↑</span>
            </button>
          </div>
        </div>
      </div>

      <div
        data-footer-reveal
        className="relative mt-auto flex shrink-0 flex-col items-start justify-between gap-4 border-t border-[var(--color-fg)]/10 px-5 py-5 text-[13px] font-light tracking-[-0.015em] text-[var(--color-fg)] md:flex-row md:items-center md:px-10 md:py-6 lg:px-16"
      >
        <a
          href="#"
          className="inline-flex items-center gap-2.5 text-[var(--color-fg)] transition-opacity hover:opacity-60"
        >
          Company Deck
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-neon-orange)]"
            aria-hidden
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 2.2v5.2M3.6 5.8 6 8.3l2.4-2.5M2.4 9.8h7.2"
                stroke="#000"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>

        <GooglePreferredSource />

        <p className="text-[var(--color-fg)]/55">
          All right reserved by FIVEO Studio, {new Date().getFullYear()}
        </p>

        <p className="text-[var(--color-fg)]/55 md:text-right">Powered by FIVEO Studio</p>
      </div>
      </div>
    </footer>
  );
}
