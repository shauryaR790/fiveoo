"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { CONTACT_EMAIL, CONTACT_MAILTO, FOOTER_LINK_COLUMNS } from "@/lib/constants";
import {
  fadeUp,
  infiniteMarquee,
  prefersReducedMotion,
} from "@/lib/animations";
import { navigateToSection } from "@/lib/navigate";
import { getLenis } from "@/lib/lenis";
import NeonFog from "@/components/NeonFog";
import LiquidGlass from "@/components/ui/liquid-glass";
import StickerSlapFooter from "@/components/ui/sticker-slap-footer";

/** Full-bleed fiveo wordmark + stickers under the classic footer. */
const FOOTER_WORDMARK_CSS = `
.ssf.ssf-fiveo-wordmark {
  min-height: 0 !important;
  height: auto !important;
  padding: 0 !important;
  overflow: visible !important;
  background: transparent !important;
  color: var(--color-fg);
}
.ssf.ssf-fiveo-wordmark .ssf-panel {
  background: transparent !important;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  overflow: visible !important;
  flex: none !important;
}
.ssf.ssf-fiveo-wordmark .ssf-stage {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  align-self: stretch !important;
}
.ssf.ssf-fiveo-wordmark .ssf-stage-in {
  margin-bottom: -4% !important;
  transform: translateY(-6%) !important;
}
.ssf.ssf-fiveo-wordmark .ssf-wm {
  color: var(--color-fg);
}
.ssf.ssf-fiveo-wordmark .ssf-st {
  width: max(7.5cqw, 58px) !important;
}
@media (max-width: 760px) {
  .ssf.ssf-fiveo-wordmark .ssf-stage {
    width: 100% !important;
    margin-left: 0 !important;
    padding: 0 4px !important;
  }
  .ssf.ssf-fiveo-wordmark .ssf-stage-in {
    margin-bottom: 0 !important;
    transform: translateY(-2%) !important;
  }
  .ssf.ssf-fiveo-wordmark .ssf-st {
    width: max(11cqw, 42px) !important;
  }
}
`;

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
      className="relative theme-surface flex min-h-0 flex-col overflow-x-clip md:min-h-dvh"
      data-nav-theme="dark"
      style={{ fontFamily: "var(--font-card)" }}
    >
      <NeonFog variant="footer" />
      {/* Soft dissolve at page edge - overlay, not clip, so no hard fog border */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[36%] bg-gradient-to-b from-transparent via-[var(--color-bg)]/55 to-[var(--color-bg)] md:h-[48%]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-12 bg-[var(--color-bg)] md:h-20"
        aria-hidden
      />

      <div className="relative z-[2] flex flex-1 flex-col">
      <div className="relative shrink-0 overflow-hidden pt-6 md:pt-12" aria-hidden>
        <div ref={trackRef} className="flex w-max will-change-transform">
          <BrandUnit />
          <BrandUnit />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-5 py-10 md:px-10 md:py-20 lg:px-16">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Left - CTA */}
          <div data-footer-reveal>
            <p className="max-w-[18ch] font-[family-name:var(--font-card)] text-[clamp(1.55rem,4.8vw,2.65rem)] font-light leading-[1.22] tracking-[-0.03em] text-[var(--color-fg)] md:max-w-[16ch] md:leading-[1.25]">
              <span className="md:hidden">
                Tell us what you are building—we will reply from the studio within
                one business day.
              </span>
              <span className="hidden md:inline">
                Choose a plan, send in your request, and your design journey
                starts tomorrow.
              </span>
            </p>
            <LiquidGlass
              as="a"
              href={CONTACT_MAILTO}
              preset="pill"
              className="mt-7 gap-2 md:hidden"
            >
              <span className="text-[15px] font-medium tracking-[-0.015em] text-[var(--color-fg)]">
                {CONTACT_EMAIL}
              </span>
              <span aria-hidden>→</span>
            </LiquidGlass>
            <LiquidGlass
              as="button"
              preset="pill"
              className="mt-8 hidden gap-2 md:inline-flex"
              onClick={() => void navigateToSection("#pricing")}
            >
              <span className="text-[15px] font-medium tracking-[-0.015em] text-[var(--color-fg)]">
                Explore Plans
              </span>
              <span aria-hidden>→</span>
            </LiquidGlass>
          </div>

          {/* Right - Habito link columns */}
          <div data-footer-reveal>
            <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:gap-x-6 md:grid-cols-3 md:gap-x-10 md:gap-y-5 lg:gap-x-14">
              {FOOTER_LINK_COLUMNS.map((column, colIndex) => (
                <ul key={colIndex} className="flex flex-col gap-3.5 md:gap-6">
                  {column.map((link) => (
                    <li
                      key={link.label}
                      className={
                        link.href === "#pricing" ? "hidden md:list-item" : undefined
                      }
                    >
                      <a
                        href={link.href}
                        onClick={(e) => {
                          if (link.href.startsWith("#") && link.href !== "#") {
                            e.preventDefault();
                            void navigateToSection(link.href);
                          }
                        }}
                        className="inline-flex min-h-11 items-center font-[family-name:var(--font-card)] text-[18px] font-light tracking-[-0.02em] text-[var(--color-fg)] transition-opacity hover:opacity-50 md:text-[24px] lg:text-[28px]"
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

      <div className="relative mt-auto w-full overflow-x-clip px-1 pt-4 md:px-0 md:pt-10">
        <style>{FOOTER_WORDMARK_CSS}</style>
        <StickerSlapFooter
          as="div"
          showTop={false}
          wordmark="fiveo"
          jobs={[]}
          address={[]}
          email=""
          chatHref=""
          socials={[]}
          credits={[]}
          stickers={["burst", "smiley", "heart", "daisy", "bubble", "bolt"]}
          paper="transparent"
          panel="transparent"
          ink="var(--color-fg)"
          cream="var(--color-fg)"
          accent="var(--color-neon-orange)"
          fontSans="var(--font-card)"
          height="auto"
          wordmarkMaxHeight="min(52vw, 280px)"
          className="ssf-fiveo-wordmark"
        />
      </div>

      <div
        data-footer-reveal
        className="relative z-[2] flex shrink-0 flex-col items-start justify-between gap-3 border-t border-[var(--color-fg)]/10 px-5 py-5 text-[12px] font-light tracking-[-0.015em] text-[var(--color-fg)] md:flex-row md:items-center md:gap-4 md:px-10 md:py-6 md:text-[13px] lg:px-16"
      >
        <a
          href="#"
          className="inline-flex min-h-11 items-center gap-2.5 text-[var(--color-fg)] transition-opacity hover:opacity-60"
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

        <a
          href={CONTACT_MAILTO}
          className="inline-flex min-h-11 items-center text-[var(--color-fg)]/55 transition-opacity hover:text-[var(--color-fg)] hover:opacity-100"
        >
          {CONTACT_EMAIL}
        </a>

        <p className="text-[var(--color-fg)]/55">
          All right reserved by FIVEO Studio, {new Date().getFullYear()}
        </p>

        <p className="text-[var(--color-fg)]/55 md:text-right">Powered by FIVEO Studio</p>
      </div>
      </div>
    </footer>
  );
}
