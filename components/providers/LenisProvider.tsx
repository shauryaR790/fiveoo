"use client";

import { useEffect } from "react";
import { createLenis, destroyLenis } from "@/lib/lenis";
import { prefersReducedMotion, refreshScrollTrigger } from "@/lib/animations";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      document.documentElement.classList.add("reduced-motion");
      return;
    }

    createLenis();
    document.documentElement.classList.add("lenis", "lenis-smooth");

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        refreshScrollTrigger();
      }, 200);
    };

    window.addEventListener("resize", onResize);
    requestAnimationFrame(() => refreshScrollTrigger());

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      /* Do not kill all ScrollTriggers here - section effects own their own. */
      destroyLenis();
    };
  }, []);

  return <>{children}</>;
}
