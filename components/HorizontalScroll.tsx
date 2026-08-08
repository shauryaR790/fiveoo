"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import {
  horizontalFromVertical,
  prefersReducedMotion,
  isMobileViewport,
} from "@/lib/animations";

type HorizontalScrollProps = {
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
  scrub?: number | boolean;
};

export default function HorizontalScroll({
  children,
  className = "",
  trackClassName = "",
  scrub = 1,
}: HorizontalScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let ctx = gsap.context(() => {
      if (prefersReducedMotion() || isMobileViewport()) return;
      horizontalFromVertical(section, track, { scrub });
    }, section);

    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        ctx.revert();
        ctx = gsap.context(() => {
          if (prefersReducedMotion() || isMobileViewport()) return;
          horizontalFromVertical(section, track, { scrub });
        }, section);
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, [scrub]);

  return (
    <div ref={sectionRef} className={`relative ${className}`}>
      <div
        ref={trackRef}
        className={`flex w-max will-change-transform ${trackClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
