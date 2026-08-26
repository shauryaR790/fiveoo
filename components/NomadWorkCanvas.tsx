"use client";

import { useEffect, useRef, useState } from "react";
import { WorkCanvas } from "@/lib/nomad/work-canvas";
import { scrollToTarget } from "@/lib/lenis";
import { refreshScrollTrigger } from "@/lib/animations";

export default function NomadWorkCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const work = new WorkCanvas(canvas, container, {
      onRoute: (route) => {
        if (route === "about") scrollToTarget("#about");
        else scrollToTarget("#pricing");
      },
      onFirstDrag: () => setHintVisible(false),
    });

    const startIfVisible = () => {
      const rect = container.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (visible) work.start();
      else work.stop();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) work.start();
        else work.stop();
      },
      { threshold: 0.08 },
    );

    observer.observe(container);

    const resizeObserver = new ResizeObserver(() => {
      work.resize();
      refreshScrollTrigger();
    });
    resizeObserver.observe(container);
    window.addEventListener("resize", startIfVisible, { passive: true });

    startIfVisible();

    const hintTimer = window.setTimeout(() => setHintVisible(false), 8000);

    return () => {
      window.clearTimeout(hintTimer);
      window.removeEventListener("resize", startIfVisible);
      observer.disconnect();
      resizeObserver.disconnect();
      work.stop();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mt-8 h-[100svh] w-full bg-white md:mt-12"
      aria-label="Drag to explore selected work films"
    >
      <canvas
        ref={canvasRef}
        className="nomad-work-canvas absolute inset-0 block h-full w-full touch-none"
      />
      <p
        className={`pointer-events-none absolute bottom-[clamp(18px,3.4vh,34px)] left-1/2 m-0 -translate-x-1/2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#5d5b63] transition-opacity duration-700 ${
          hintVisible ? "opacity-75" : "opacity-0"
        }`}
      >
        drag to explore
      </p>
    </div>
  );
}
