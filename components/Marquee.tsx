"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { infiniteMarquee, prefersReducedMotion } from "@/lib/animations";
import { getLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

type MarqueeProps = {
  label?: string;
  className?: string;
  textClassName?: string;
  glyphClassName?: string;
  duration?: number;
  reversed?: boolean;
};

export default function Marquee({
  label = "Fiveo Studio",
  className = "",
  textClassName = "",
  glyphClassName = "h-8 w-8 md:h-12 md:w-12",
  duration = 26,
  reversed = false,
}: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    let onScroll: (() => void) | undefined;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      const tween = infiniteMarquee(track, { duration, reversed });
      if (!tween) return;

      onScroll = () => {
        const velocity = Math.abs(getLenis()?.velocity ?? 0);
        tween.timeScale(gsap.utils.clamp(1, 1.5, 1 + velocity / 40));
      };

      getLenis()?.on("scroll", onScroll);
    }, root);

    return () => {
      if (onScroll) getLenis()?.off("scroll", onScroll);
      ctx.revert();
    };
  }, [duration, reversed]);

  const half = (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-5 px-3 md:gap-8 md:px-4"
        >
          <span
            className={`font-display whitespace-nowrap uppercase leading-none tracking-[-0.04em] ${textClassName}`}
          >
            {label}
          </span>
          <span className={`relative shrink-0 ${glyphClassName}`}>
            <Image
              src="/images/leaf.avif"
              alt=""
              fill
              sizes="80px"
              className="object-contain"
            />
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={rootRef} className={`overflow-hidden ${className}`} aria-hidden>
      <div ref={trackRef} className="flex w-max will-change-transform">
        {half}
        {half}
      </div>
    </div>
  );
}
