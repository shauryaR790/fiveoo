"use client";

import { useEffect, useRef, useState } from "react";
import { initMark, playMark } from "@/lib/nomad/mark";
import { prefersReducedMotion, refreshScrollTrigger } from "@/lib/animations";
import NeonFog from "@/components/NeonFog";

export default function SiteLoader() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const skippedRef = useRef(false);

  const finish = () => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    setFading(true);
    window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
      refreshScrollTrigger();
    }, 620);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const svg = svgRef.current;
    if (!svg) {
      finish();
      return;
    }

    let cancelled = false;

    (async () => {
      await initMark(svg, "#ffffff");
      if (cancelled) return;
      await playMark(svg, { reduced: prefersReducedMotion() });
      if (cancelled) return;
      finish();
    })();

    return () => {
      cancelled = true;
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] grid place-items-center overflow-hidden bg-black transition-opacity duration-[620ms] ease-out ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden={fading}
    >
      <NeonFog variant="hero" />

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
