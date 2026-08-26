"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { PARTNER_LOGOS_BOTTOM, PARTNER_LOGOS_TOP } from "@/lib/constants";
import { infiniteMarquee, prefersReducedMotion } from "@/lib/animations";
import { getLenis } from "@/lib/lenis";
import NeonFog from "@/components/NeonFog";

type Logo = { name: string; src: string };

function LogoTile({ logo }: { logo: Logo }) {
  return (
    <div className="partner-logo-tile mr-3 flex aspect-square h-[209px] w-[209px] shrink-0 items-center justify-center px-3 md:mr-4 md:h-[266px] md:w-[266px] md:px-3.5 lg:h-[304px] lg:w-[304px] lg:px-4">
      <div className="relative h-[96%] w-[96%]">
        <Image
          src={logo.src}
          alt={logo.name}
          fill
          sizes="320px"
          className="partner-logo-img object-contain"
        />
      </div>
    </div>
  );
}

function LogoRow({
  logos,
  reversed,
  duration,
}: {
  logos: readonly Logo[];
  reversed: boolean;
  duration: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    let onScroll: (() => void) | undefined;
    let resetTween: gsap.core.Tween | undefined;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      const tween = infiniteMarquee(track, { duration, reversed });
      if (!tween) return;

      onScroll = () => {
        const velocity = getLenis()?.velocity ?? 0;
        resetTween?.kill();

        const scale = gsap.utils.clamp(-2.6, 2.6, 1 + velocity / 28);
        tween.timeScale(scale);

        resetTween = gsap.to(tween, {
          timeScale: 1,
          duration: 1.15,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      getLenis()?.on("scroll", onScroll);
    }, root);

    return () => {
      if (onScroll) getLenis()?.off("scroll", onScroll);
      resetTween?.kill();
      ctx.revert();
    };
  }, [duration, reversed]);

  const half = (
    <div className="flex shrink-0">
      {logos.map((logo, i) => (
        <LogoTile key={`${logo.name}-${i}`} logo={logo} />
      ))}
    </div>
  );

  return (
    <div ref={rootRef} className="overflow-hidden" aria-hidden>
      <div ref={trackRef} className="flex w-max will-change-transform">
        {half}
        {half}
      </div>
    </div>
  );
}

export default function Partners() {
  return (
    <section
      id="clients"
      className="theme-surface relative overflow-x-clip bg-[var(--color-bg)] px-3 pb-16 pt-2 md:px-4 md:pb-24 md:pt-3"
      data-nav-theme="dark"
      aria-label="Partner logos"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <NeonFog variant="hero" className="!h-full" />
      </div>

      <div className="relative z-[1] flex flex-col gap-3 md:gap-4">
        <LogoRow logos={PARTNER_LOGOS_TOP} reversed duration={36} />
        <LogoRow logos={PARTNER_LOGOS_BOTTOM} reversed={false} duration={40} />
      </div>
    </section>
  );
}
