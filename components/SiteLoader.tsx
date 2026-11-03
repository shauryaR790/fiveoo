"use client";

import { useEffect, useRef, useState } from "react";
import { initMark, playMark, MARK_DURATION } from "@/lib/nomad/mark";
import { prefersReducedMotion, refreshScrollTrigger } from "@/lib/animations";
import { registerSiteLoader } from "@/lib/site-loader";
import NeonFog from "@/components/NeonFog";

const FADE_MS = 620;

export default function SiteLoader() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const busyRef = useRef(false);
  const bootedRef = useRef(false);

  useEffect(() => {
    const waitFade = () =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, FADE_MS);
      });

    const play = async (options?: { duration?: number }) => {
      const svg = svgRef.current;
      if (!svg || busyRef.current) return;

      busyRef.current = true;
      setFading(false);
      setVisible(true);
      document.body.style.overflow = "hidden";

      // Let the overlay paint before the mark starts.
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      try {
        await initMark(svg, "#ffffff");
        await playMark(svg, {
          reduced: prefersReducedMotion(),
          duration: options?.duration,
        });
      } finally {
        setFading(true);
        await waitFade();
        setVisible(false);
        setFading(false);
        document.body.style.overflow = "";
        refreshScrollTrigger();
        busyRef.current = false;
      }
    };

    registerSiteLoader(play);

    if (!bootedRef.current) {
      bootedRef.current = true;
      void play({
        duration: prefersReducedMotion() ? undefined : MARK_DURATION,
      });
    }

    return () => {
      registerSiteLoader(null);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] grid place-items-center bg-black transition-opacity ease-out ${
        visible && !fading
          ? "opacity-100 duration-0"
          : "pointer-events-none opacity-0 duration-[620ms]"
      }`}
      aria-hidden={!visible || fading}
      style={{ visibility: visible || fading ? "visible" : "hidden" }}
    >
      <NeonFog variant="loader" />

      <svg
        ref={svgRef}
        viewBox="0 0 480 120"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-[1] block h-auto w-[min(98vw,82vh)] overflow-visible"
      >
        <defs>
          <clipPath id="fiveoMarkClip">
            <rect className="mark__mask-rect" x="0" y="0" width="0" height="120" />
          </clipPath>
        </defs>
        <g className="mark__word" clipPath="url(#fiveoMarkClip)" />
        <g className="mark__star" />
      </svg>
    </div>
  );
}
