"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { revealText, prefersReducedMotion } from "@/lib/animations";

type ScrollTextProps = {
  as?: "h1" | "h2" | "h3" | "p" | "span";
  children: React.ReactNode;
  className?: string;
  triggerOnScroll?: boolean;
  delay?: number;
};

export default function ScrollText({
  as: Tag = "h2",
  children,
  className = "",
  triggerOnScroll = true,
  delay = 0,
}: ScrollTextProps) {
  const wrapRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(inner, { yPercent: 0, opacity: 1 });
        return;
      }

      if (triggerOnScroll) {
        revealText(inner, { delay, trigger: wrap });
      } else {
        gsap.from(inner, {
          yPercent: 100,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          delay,
        });
      }
    }, wrap);

    return () => ctx.revert();
  }, [delay, triggerOnScroll]);

  return (
    <Tag
      ref={wrapRef as React.RefObject<HTMLHeadingElement>}
      className={`overflow-hidden ${className}`}
    >
      <span ref={innerRef} className="block will-change-transform">
        {children}
      </span>
    </Tag>
  );
}
