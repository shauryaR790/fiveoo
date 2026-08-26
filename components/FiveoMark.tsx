"use client";

import { useEffect, useId, useRef } from "react";
import { cropMarkViewBox, initMark, setMarkFinal } from "@/lib/nomad/mark";
import { cn } from "@/lib/utils";

type FiveoMarkProps = {
  className?: string;
  ink?: string;
};

export default function FiveoMark({
  className = "",
  ink = "currentColor",
}: FiveoMarkProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const clipId = useId().replace(/:/g, "");

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let cancelled = false;

    void initMark(svg, ink).then(() => {
      if (cancelled) return;
      setMarkFinal(svg);
      cropMarkViewBox(svg);
    });

    return () => {
      cancelled = true;
    };
  }, [ink, clipId]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 480 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("block h-[34px] w-auto overflow-visible md:h-[40px]", className)}
    >
      <defs>
        <clipPath id={clipId}>
          <rect className="mark__mask-rect" x="0" y="0" width="0" height="120" />
        </clipPath>
      </defs>
      <g className="mark__word" clipPath={`url(#${clipId})`} />
      <g className="mark__star" />
    </svg>
  );
}
