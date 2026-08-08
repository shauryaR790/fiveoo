"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/animations";

/** Subtle follower dot — desktop only, transform-only for 60fps */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.body.classList.add("has-custom-cursor");
    gsap.set(dot, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest("a, button, [data-cursor-grow]");
      gsap.to(dot, {
        scale: interactive ? 2.4 : 1,
        duration: 0.35,
        ease: "power3.out",
      });

      const theme = target
        ?.closest("[data-nav-theme]")
        ?.getAttribute("data-nav-theme");
      document.body.classList.toggle("on-dark", theme === "dark");
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    return () => {
      document.body.classList.remove("has-custom-cursor", "on-dark");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="cursor-dot pointer-events-none fixed left-0 top-0 z-[90] hidden h-5 w-5 rounded-full bg-[var(--color-cursor)] md:block"
      aria-hidden
    />
  );
}
