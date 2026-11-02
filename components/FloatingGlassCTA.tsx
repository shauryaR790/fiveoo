"use client";

import { useEffect, useState } from "react";
import LiquidGlass from "liquid-glass-react";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/constants";

/**
 * Uses the upstream `liquid-glass-react` floating pill API directly
 * (elasticity + edge refraction). Hidden on coarse/mobile pointers for perf.
 */
export default function FloatingGlassCTA() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 768px) and (any-hover: hover) and (any-pointer: fine)",
    );
    const sync = () => setReady(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!ready) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40" aria-hidden={false}>
      <LiquidGlass
        displacementScale={64}
        blurAmount={0.1}
        saturation={130}
        aberrationIntensity={2}
        elasticity={0.32}
        cornerRadius={100}
        padding="12px 22px"
        mode="standard"
        onClick={() => {
          window.location.href = CONTACT_MAILTO;
        }}
        style={{
          position: "fixed",
          top: "88%",
          left: "50%",
          pointerEvents: "auto",
          zIndex: 40,
        }}
      >
        <span className="flex items-center gap-2 whitespace-nowrap text-[14px] font-semibold tracking-[-0.02em] text-white">
          Talk to FIVEO
          <span className="opacity-70">{CONTACT_EMAIL}</span>
        </span>
      </LiquidGlass>
    </div>
  );
}
