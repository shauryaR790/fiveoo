"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createLenis, destroyLenis } from "@/lib/lenis";
import { prefersReducedMotion, refreshScrollTrigger } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

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

    const lenis = createLenis();
    if (lenis) {
      document.documentElement.classList.add("lenis", "lenis-smooth");
    }

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        refreshScrollTrigger();
      }, 200);
    };

    window.addEventListener("resize", onResize);
    // Keep ScrollTrigger synced when Lenis is off (mobile native scroll).
    const onScroll = () => ScrollTrigger.update();
    if (!lenis) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    requestAnimationFrame(() => refreshScrollTrigger());

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(resizeTimer);
      document.documentElement.classList.remove(
        "lenis",
        "lenis-smooth",
        "native-scroll",
      );
      /* Do not kill all ScrollTriggers here - section effects own their own. */
      destroyLenis();
    };
  }, []);

  return <>{children}</>;
}
